/**
 * Scheduled Netlify Function: delete RSVP registrations 3 months after their
 * event, and keep one count row per event (#107).
 *
 * The privacy policy promises that registrations are deleted 3 months after
 * the event. Funders only need the number of registrations per event, so
 * that is kept in a separate Baserow table ("RSVP counts") without any
 * personal data.
 *
 * Once a week (schedule in netlify.toml) it:
 * 1. Reads all registrations from Baserow and groups them by "Event ID", the
 *    Contentful ID that rsvp-submit.js stores with every registration.
 * 2. Looks up each event's date in the Contentful Delivery API.
 * 3. For every event that ended more than 3 months ago, writes one row
 *    (Event ID, Event title, Event date, Registrations) into "RSVP counts".
 * 4. Deletes that event's registrations with Baserow's batch delete.
 *
 * Rules:
 * - Events that are already in "RSVP counts" are only deleted, never counted
 *   again. That covers a run where the count was written but the delete
 *   failed.
 * - Registrations are only deleted after their count has been written.
 * - Events that Contentful doesn't return (deleted or unpublished) are left
 *   alone and logged, because without a date we can't tell whether they are
 *   due.
 *
 * Scheduled functions only run on the published production deploy. Locally
 * it can be run with `netlify functions:invoke rsvp-cleanup`, but only ever
 * against a copy of the tables, never the real registrations.
 *
 * Environment variables:
 * - BASEROW_TOKEN, BASEROW_URL, BASEROW_RSVP_TABLE_ID (shared with rsvp-submit.js)
 * - BASEROW_RSVP_COUNTS_TABLE_ID: the "RSVP counts" table
 * - CONTENTFUL_SPACE_ID, CONTENTFUL_DELIVERY_TOKEN (must be available to
 *   functions, not only to builds)
 * - RSVP_CLEANUP_DRY_RUN=true (optional): log what would be counted and
 *   deleted, but don't write or delete anything
 *
 * The core logic (`groupByEvent`, `planCleanup`, `runCleanup`) takes its
 * Baserow and Contentful access as arguments, so it can be tested with
 * mocked responses (netlify/tests/rsvp-cleanup.test.js).
 */

const fetch = require('node-fetch');

const RETENTION_MONTHS = 3;

// Baserow accepts at most 200 rows per batch request and 200 rows per page.
const BASEROW_BATCH_SIZE = 200;
const BASEROW_PAGE_SIZE = 200;

// Keeps the Contentful request URL well below length limits.
const CONTENTFUL_IDS_PER_REQUEST = 100;

// Baserow column names, as used with user_field_names=true. They must match
// the tables exactly: Baserow silently ignores unknown field names in
// filters (see rsvp-submit.js).
const REGISTRATION_FIELDS = {
  eventId: 'Event ID'
};

const COUNT_FIELDS = {
  eventId: 'Event ID',
  eventTitle: 'Event title',
  eventDate: 'Event date',
  registrations: 'Registrations'
};

// ---------------------------------------------------------------------------
// Core logic (no network)
// ---------------------------------------------------------------------------

/**
 * Groups registration rows by their "Event ID".
 *
 * @param {Object[]} rows - Baserow rows with `id` and "Event ID".
 * @returns {{ groups: Map<string, number[]>, withoutEventId: number[] }}
 *   Row IDs by Event ID. Rows without an Event ID can't be matched to
 *   an event, so they are returned separately and left alone.
 */
function groupByEvent(rows) {
  const groups = new Map();
  const withoutEventId = [];

  rows.forEach(row => {
    const eventId = String(row[REGISTRATION_FIELDS.eventId] || '').trim();
    if (!eventId) {
      withoutEventId.push(row.id);
      return;
    }

    const rowIds = groups.get(eventId) || [];
    rowIds.push(row.id);
    groups.set(eventId, rowIds);
  });

  return { groups, withoutEventId };
}

/**
 * The latest end date at which an event's registrations are due for
 * deletion: `now` minus 3 calendar months.
 *
 * @param {Date} now
 * @returns {Date}
 */
function retentionCutoff(now) {
  const cutoff = new Date(now.getTime());
  cutoff.setUTCMonth(cutoff.getUTCMonth() - RETENTION_MONTHS);
  return cutoff;
}

/**
 * When an event ended: its `endTime` (a full date and time in Contentful)
 * if set, otherwise its start `date`.
 *
 * @param {{ date?: string, endTime?: string }} event
 * @returns {Date|null} null if the event has no usable date.
 */
function eventEnd(event) {
  const end = new Date(event.endTime || event.date);
  return isNaN(end) ? null : end;
}

/**
 * Decides what to do with each event.
 *
 * @param {Object} args
 * @param {Map} args.groups - From `groupByEvent`.
 * @param {Map<string, { title: string, date: string, endTime?: string }>} args.events
 *   Contentful events by ID.
 * @param {Set<string>} args.countedEventIds - Event IDs already in "RSVP counts".
 * @param {Date} args.now
 * @returns {{ due: Object[], skipped: Object[] }} `due` lists the events to
 *   delete, with `alreadyCounted` telling whether a count row is still
 *   needed; `skipped` lists the others with a reason.
 */
function planCleanup({ groups, events, countedEventIds, now }) {
  const cutoff = retentionCutoff(now);
  const due = [];
  const skipped = [];

  groups.forEach((rowIds, eventId) => {
    const event = events.get(eventId);
    if (!event) {
      skipped.push({ eventId, reason: 'not-in-contentful' });
      return;
    }

    const end = eventEnd(event);
    if (!end) {
      skipped.push({ eventId, reason: 'no-date' });
      return;
    }

    if (end >= cutoff) {
      skipped.push({ eventId, reason: 'not-due' });
      return;
    }

    due.push({
      eventId,
      title: event.title || '',
      date: event.date,
      rowIds,
      alreadyCounted: countedEventIds.has(eventId)
    });
  });

  return { due, skipped };
}

/**
 * Runs one cleanup: reads, plans, then counts and deletes event by event.
 * A failure for one event is logged and doesn't stop the others.
 *
 * @param {Object} args
 * @param {Object} args.baserow - From `createBaserowClient`, or a mock.
 * @param {Object} args.contentful - From `createContentfulClient`, or a mock.
 * @param {Date} [args.now]
 * @param {boolean} [args.dryRun] - Plan and log only.
 * @param {Object} [args.log] - console-like logger.
 * @returns {Promise<Object>} A summary with event IDs and numbers only, no
 *   personal data, so it is safe to log.
 */
async function runCleanup({ baserow, contentful, now = new Date(), dryRun = false, log = console }) {
  const rows = await baserow.listRegistrations();
  const { groups, withoutEventId } = groupByEvent(rows);

  const events = await contentful.getEvents([...groups.keys()]);
  const countedEventIds = await baserow.listCountedEventIds();

  const { due, skipped } = planCleanup({ groups, events, countedEventIds, now });

  const summary = {
    dryRun,
    counted: [],
    deleted: [],
    failed: [],
    skipped,
    withoutEventId: withoutEventId.length
  };

  // One event at a time, so a count is always written before its delete.
  for (const item of due) {
    const { eventId, title, date, rowIds, alreadyCounted } = item;

    if (dryRun) {
      if (!alreadyCounted) summary.counted.push({ eventId, registrations: rowIds.length });
      summary.deleted.push({ eventId, rows: rowIds.length });
      continue;
    }

    if (!alreadyCounted) {
      try {
        await baserow.createCount({ eventId, title, date, registrations: rowIds.length });
        summary.counted.push({ eventId, registrations: rowIds.length });
      } catch (error) {
        // Without a count the registrations are the only record of the
        // event's attendance, so they stay until the next run.
        log.error(`rsvp-cleanup: count for ${eventId} failed, nothing deleted:`, error.message);
        summary.failed.push({ eventId, step: 'count', error: error.message });
        continue;
      }
    }

    try {
      await baserow.deleteRows(rowIds);
      summary.deleted.push({ eventId, rows: rowIds.length });
    } catch (error) {
      // The count is written, so the next run sees the event in
      // "RSVP counts" and only retries the delete.
      log.error(`rsvp-cleanup: delete for ${eventId} failed, will retry next run:`, error.message);
      summary.failed.push({ eventId, step: 'delete', error: error.message });
    }
  }

  return summary;
}

// ---------------------------------------------------------------------------
// Baserow and Contentful access
// ---------------------------------------------------------------------------

/**
 * Baserow access for the cleanup, using the same REST calls and
 * `Token` authentication as rsvp-submit.js and gatsby/source-baserow.js.
 *
 * @param {Object} config
 * @param {string} config.url - BASEROW_URL
 * @param {string} config.token - BASEROW_TOKEN
 * @param {string} config.registrationsTableId - BASEROW_RSVP_TABLE_ID
 * @param {string} config.countsTableId - BASEROW_RSVP_COUNTS_TABLE_ID
 * @param {Function} [config.fetchImpl] - Injected in tests.
 */
function createBaserowClient({ url, token, registrationsTableId, countsTableId, fetchImpl = fetch }) {
  const headers = {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  };

  async function request(requestUrl, options = {}) {
    const response = await fetchImpl(requestUrl, { ...options, headers });
    if (!response.ok) {
      throw new Error(`Baserow ${options.method || 'GET'} ${response.status}: ${await response.text()}`);
    }
    return response.status === 204 ? null : response.json();
  }

  // Follows Baserow's `next` links, like gatsby/source-baserow.js. `include`
  // limits the response to the named fields, so names and emails never reach
  // this function.
  async function listAllRows(tableId, fieldNames) {
    const include = encodeURIComponent(fieldNames.join(','));
    let pageUrl = `${url}/api/database/rows/table/${tableId}/?user_field_names=true&size=${BASEROW_PAGE_SIZE}&include=${include}`;
    const rows = [];
    while (pageUrl) {
      const data = await request(pageUrl);
      rows.push(...data.results);
      pageUrl = data.next;
    }
    return rows;
  }

  return {
    listRegistrations() {
      return listAllRows(registrationsTableId, [REGISTRATION_FIELDS.eventId]);
    },

    async listCountedEventIds() {
      const rows = await listAllRows(countsTableId, [COUNT_FIELDS.eventId]);
      return new Set(rows.map(row => String(row[COUNT_FIELDS.eventId] || '').trim()).filter(Boolean));
    },

    async createCount({ eventId, title, date, registrations }) {
      const row = await request(`${url}/api/database/rows/table/${countsTableId}/?user_field_names=true`, {
        method: 'POST',
        body: JSON.stringify({
          [COUNT_FIELDS.eventId]: eventId,
          [COUNT_FIELDS.eventTitle]: title,
          // "Event date" is a date-only field. The first 10 characters are
          // the date as entered in Contentful (Berlin time), which a UTC
          // conversion could shift to the previous day.
          [COUNT_FIELDS.eventDate]: date ? String(date).slice(0, 10) : null,
          [COUNT_FIELDS.registrations]: registrations
        })
      });
      // Baserow drops values for field names it doesn't know. If the columns
      // in "RSVP counts" are named differently, the count would be lost and
      // the event counted again on every retry, so treat it as a failure and
      // keep the registrations.
      if (!row || row[COUNT_FIELDS.eventId] !== eventId || row[COUNT_FIELDS.registrations] == null) {
        throw new Error('"RSVP counts" did not store Event ID and Registrations; check its field names');
      }
      return row;
    },

    async deleteRows(rowIds) {
      for (let i = 0; i < rowIds.length; i += BASEROW_BATCH_SIZE) {
        await request(`${url}/api/database/rows/table/${registrationsTableId}/batch-delete/`, {
          method: 'POST',
          body: JSON.stringify({ items: rowIds.slice(i, i + BASEROW_BATCH_SIZE) })
        });
      }
    }
  };
}

/**
 * Contentful Delivery API access for event dates.
 *
 * @param {Object} config
 * @param {string} config.spaceId - CONTENTFUL_SPACE_ID
 * @param {string} config.token - CONTENTFUL_DELIVERY_TOKEN
 * @param {Function} [config.fetchImpl] - Injected in tests.
 */
function createContentfulClient({ spaceId, token, fetchImpl = fetch }) {
  return {
    /**
     * @param {string[]} ids - Contentful entry IDs.
     * @returns {Promise<Map<string, { title, date, endTime }>>} Only the
     *   entries Contentful returns; deleted or unpublished events are missing.
     */
    async getEvents(ids) {
      const events = new Map();
      for (let i = 0; i < ids.length; i += CONTENTFUL_IDS_PER_REQUEST) {
        const chunk = ids.slice(i, i + CONTENTFUL_IDS_PER_REQUEST);
        // The site uses the default "master" environment (gatsby-config.js).
        // include=0: linked entries and assets aren't needed.
        const requestUrl = `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries`
          + `?sys.id[in]=${chunk.map(encodeURIComponent).join(',')}&limit=${CONTENTFUL_IDS_PER_REQUEST}&include=0`;
        const response = await fetchImpl(requestUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error(`Contentful ${response.status}: ${await response.text()}`);
        }
        const data = await response.json();
        data.items.forEach(item => {
          events.set(item.sys.id, {
            title: item.fields.title,
            date: item.fields.date,
            endTime: item.fields.endTime
          });
        });
      }
      return events;
    }
  };
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

exports.handler = async () => {
  const {
    BASEROW_TOKEN, BASEROW_URL, BASEROW_RSVP_TABLE_ID, BASEROW_RSVP_COUNTS_TABLE_ID,
    CONTENTFUL_SPACE_ID, CONTENTFUL_DELIVERY_TOKEN, RSVP_CLEANUP_DRY_RUN
  } = process.env;

  if (!BASEROW_TOKEN || !BASEROW_URL || !BASEROW_RSVP_TABLE_ID || !BASEROW_RSVP_COUNTS_TABLE_ID
    || !CONTENTFUL_SPACE_ID || !CONTENTFUL_DELIVERY_TOKEN) {
    console.error('rsvp-cleanup: missing Baserow or Contentful configuration, nothing done');
    return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error' }) };
  }

  try {
    const summary = await runCleanup({
      baserow: createBaserowClient({
        url: BASEROW_URL,
        token: BASEROW_TOKEN,
        registrationsTableId: BASEROW_RSVP_TABLE_ID,
        countsTableId: BASEROW_RSVP_COUNTS_TABLE_ID
      }),
      contentful: createContentfulClient({
        spaceId: CONTENTFUL_SPACE_ID,
        token: CONTENTFUL_DELIVERY_TOKEN
      }),
      dryRun: RSVP_CLEANUP_DRY_RUN === 'true'
    });

    console.log('rsvp-cleanup:', JSON.stringify(summary));
    return {
      statusCode: summary.failed.length ? 500 : 200,
      body: JSON.stringify(summary)
    };
  } catch (error) {
    // Reading failed (Baserow or Contentful unreachable): nothing was
    // written or deleted, and the next weekly run tries again.
    console.error('rsvp-cleanup: run failed, nothing changed:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

exports.groupByEvent = groupByEvent;
exports.retentionCutoff = retentionCutoff;
exports.eventEnd = eventEnd;
exports.planCleanup = planCleanup;
exports.runCleanup = runCleanup;
exports.createBaserowClient = createBaserowClient;
exports.createContentfulClient = createContentfulClient;
