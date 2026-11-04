// Tests for netlify/functions/rsvp-cleanup.js (#107). Run with
// `npm run test:functions`. No network: Baserow and Contentful are replaced
// by an in-memory fake that answers the same REST calls, so the real
// HTTP clients are exercised too.
//
// They live outside netlify/functions/ because Netlify deploys every .js
// file there as a function.

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  groupByEvent,
  retentionCutoff,
  planCleanup,
  runCleanup,
  createBaserowClient,
  createContentfulClient,
  handler
} = require('../functions/rsvp-cleanup');

const NOW = new Date('2026-11-04T10:00:00Z');
const BASEROW_URL = 'https://baserow.test';
const REG_TABLE = '1';
const COUNTS_TABLE = '2';

const silentLog = { error() {}, log() {} };

/**
 * An in-memory Baserow + Contentful. `fetch` routes requests to it; the
 * `fail*` switches simulate API errors.
 */
function createFakeBackend({ registrations = [], counts = [], events = {}, pageSize = 2 } = {}) {
  const state = {
    registrations: registrations.map(r => ({ ...r })),
    counts: counts.map(c => ({ ...c })),
    events,
    failCreateCount: false,
    // Like Baserow, the counts table only stores fields it has columns for.
    countColumns: ['Event ID', 'Event title', 'Event date', 'Registrations'],
    failDelete: false,
    batchDeleteCalls: [],
    requests: []
  };
  let nextCountId = 1000;

  const respond = (status, body) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body)
  });

  // Baserow pagination with a small page size, so `next` links are followed.
  function page(rows, url, include) {
    const pageNumber = Number(url.searchParams.get('page') || 1);
    const slice = rows.slice((pageNumber - 1) * pageSize, pageNumber * pageSize).map(row => {
      const picked = { id: row.id };
      include.forEach(name => { if (name in row) picked[name] = row[name]; });
      return picked;
    });
    let next = null;
    if (pageNumber * pageSize < rows.length) {
      const nextUrl = new URL(url);
      nextUrl.searchParams.set('page', pageNumber + 1);
      next = nextUrl.toString();
    }
    return respond(200, { count: rows.length, next, results: slice });
  }

  async function fetch(rawUrl, options = {}) {
    const url = new URL(rawUrl);
    const method = options.method || 'GET';
    state.requests.push({ method, url: rawUrl });

    if (url.host === 'cdn.contentful.com') {
      const ids = url.searchParams.get('sys.id[in]').split(',');
      const items = ids.filter(id => state.events[id]).map(id => ({ sys: { id }, fields: state.events[id] }));
      return respond(200, { items });
    }

    const include = (url.searchParams.get('include') || '').split(',').filter(Boolean);

    if (url.pathname === `/api/database/rows/table/${REG_TABLE}/` && method === 'GET') {
      return page(state.registrations, url, include);
    }
    if (url.pathname === `/api/database/rows/table/${COUNTS_TABLE}/` && method === 'GET') {
      return page(state.counts, url, include);
    }
    if (url.pathname === `/api/database/rows/table/${COUNTS_TABLE}/` && method === 'POST') {
      if (state.failCreateCount) return respond(500, { error: 'boom' });
      const body = JSON.parse(options.body);
      const row = { id: nextCountId++ };
      state.countColumns.forEach(name => { if (name in body) row[name] = body[name]; });
      state.counts.push(row);
      return respond(200, row);
    }
    if (url.pathname === `/api/database/rows/table/${REG_TABLE}/batch-delete/` && method === 'POST') {
      const { items } = JSON.parse(options.body);
      state.batchDeleteCalls.push(items);
      if (state.failDelete) return respond(500, { error: 'boom' });
      if (items.length > 200) return respond(400, { error: 'too many items' });
      state.registrations = state.registrations.filter(r => !items.includes(r.id));
      return { ok: true, status: 204, json: async () => null, text: async () => '' };
    }
    return respond(404, { error: `unexpected ${method} ${rawUrl}` });
  }

  return { state, fetch };
}

function clients(fetchImpl) {
  return {
    baserow: createBaserowClient({
      url: BASEROW_URL,
      token: 'test-token',
      registrationsTableId: REG_TABLE,
      countsTableId: COUNTS_TABLE,
      fetchImpl
    }),
    contentful: createContentfulClient({ spaceId: 'space', token: 'test-token', fetchImpl })
  };
}

function reg(id, eventId, extra = {}) {
  return { id, 'Event ID': eventId, 'Name': `Person ${id}`, 'Email': `p${id}@example.test`, ...extra };
}

// Three events: one long past, one two months ago, one upcoming.
const EVENTS = {
  oldEvent: { title: 'Old talk', date: '2026-05-12T19:00+02:00', endTime: '2026-05-12T21:00+02:00' },
  recentEvent: { title: 'Recent talk', date: '2026-09-10T19:00+02:00' },
  upcomingEvent: { title: 'Upcoming talk', date: '2026-12-01T19:00+01:00' }
};

function standardRegistrations() {
  return [
    reg(1, 'oldEvent'), reg(2, 'oldEvent'), reg(3, 'oldEvent'),
    reg(4, 'recentEvent'),
    reg(5, 'upcomingEvent'), reg(6, 'upcomingEvent')
  ];
}

// ---------------------------------------------------------------------------

test('groupByEvent groups rows, flags kept events and sets aside rows without an Event ID', () => {
  const { groups, withoutEventId } = groupByEvent([
    reg(1, 'a'), reg(2, 'a', { 'Keep for funder': true }), reg(3, 'b'), reg(4, ''), { id: 5 }
  ]);
  assert.deepEqual(groups.get('a'), { rowIds: [1, 2], keepForFunder: true });
  assert.deepEqual(groups.get('b'), { rowIds: [3], keepForFunder: false });
  assert.deepEqual(withoutEventId, [4, 5]);
});

test('retentionCutoff is 3 calendar months before now', () => {
  assert.equal(retentionCutoff(NOW).toISOString(), '2026-08-04T10:00:00.000Z');
});

test('planCleanup uses the end time and the 3-month cutoff', () => {
  const groups = new Map([
    ['endedBefore', { rowIds: [1], keepForFunder: false }],
    ['endsAfter', { rowIds: [2], keepForFunder: false }],
    ['missing', { rowIds: [3], keepForFunder: false }],
    ['noDate', { rowIds: [4], keepForFunder: false }]
  ]);
  const events = new Map([
    // Starts before the cutoff (2026-08-04T10:00Z) …
    ['endedBefore', { title: 'A', date: '2026-08-03T20:00Z', endTime: '2026-08-03T22:00Z' }],
    // … and this one too, but only ends after it.
    ['endsAfter', { title: 'B', date: '2026-08-04T08:00Z', endTime: '2026-08-04T12:00Z' }],
    ['noDate', { title: 'D' }]
  ]);
  const { due, skipped } = planCleanup({ groups, events, countedEventIds: new Set(), now: NOW });
  assert.deepEqual(due.map(d => d.eventId), ['endedBefore']);
  assert.deepEqual(skipped, [
    { eventId: 'endsAfter', reason: 'not-due' },
    { eventId: 'missing', reason: 'not-in-contentful' },
    { eventId: 'noDate', reason: 'no-date' }
  ]);
});

test('counts and deletes only events that ended more than 3 months ago', async () => {
  const backend = createFakeBackend({ registrations: standardRegistrations(), events: EVENTS });
  const summary = await runCleanup({ ...clients(backend.fetch), now: NOW, log: silentLog });

  assert.deepEqual(backend.state.counts.map(({ id, ...row }) => row), [{
    'Event ID': 'oldEvent',
    'Event title': 'Old talk',
    'Event date': '2026-05-12',
    'Registrations': 3
  }]);
  assert.deepEqual(backend.state.registrations.map(r => r.id), [4, 5, 6]);
  assert.deepEqual(backend.state.batchDeleteCalls, [[1, 2, 3]]);
  assert.deepEqual(summary.counted, [{ eventId: 'oldEvent', registrations: 3 }]);
  assert.deepEqual(summary.deleted, [{ eventId: 'oldEvent', rows: 3 }]);
  assert.deepEqual(summary.failed, []);
});

test('never asks Baserow for names or emails', async () => {
  const backend = createFakeBackend({ registrations: standardRegistrations(), events: EVENTS });
  const { baserow } = clients(backend.fetch);
  const rows = await baserow.listRegistrations();
  rows.forEach(row => {
    assert.equal(row.Name, undefined);
    assert.equal(row.Email, undefined);
  });
  assert.equal(rows.length, 6, 'all pages are read');
});

test('leaves an event alone if any of its registrations is ticked "Keep for funder"', async () => {
  const registrations = standardRegistrations();
  registrations[1]['Keep for funder'] = true; // one of the three oldEvent rows
  const backend = createFakeBackend({ registrations, events: EVENTS });
  const summary = await runCleanup({ ...clients(backend.fetch), now: NOW, log: silentLog });

  assert.deepEqual(backend.state.counts, []);
  assert.equal(backend.state.registrations.length, 6);
  assert.deepEqual(backend.state.batchDeleteCalls, []);
  assert.ok(summary.skipped.some(s => s.eventId === 'oldEvent' && s.reason === 'keep-for-funder'));
  // Kept events need no Contentful lookup.
  assert.ok(backend.state.requests.filter(r => r.url.includes('contentful')).every(r => !r.url.includes('oldEvent')));
});

test('counts and deletes a kept event once the box is unticked', async () => {
  const registrations = standardRegistrations();
  registrations[0]['Keep for funder'] = true;
  const backend = createFakeBackend({ registrations, events: EVENTS });
  await runCleanup({ ...clients(backend.fetch), now: NOW, log: silentLog });
  assert.equal(backend.state.counts.length, 0);

  backend.state.registrations.find(r => r.id === 1)['Keep for funder'] = false;
  await runCleanup({ ...clients(backend.fetch), now: NOW, log: silentLog });
  assert.equal(backend.state.counts.length, 1);
  assert.equal(backend.state.counts[0].Registrations, 3);
  assert.deepEqual(backend.state.registrations.map(r => r.id), [4, 5, 6]);
});

test('running twice changes nothing the second time', async () => {
  const backend = createFakeBackend({ registrations: standardRegistrations(), events: EVENTS });
  await runCleanup({ ...clients(backend.fetch), now: NOW, log: silentLog });
  const countsAfterFirst = structuredClone(backend.state.counts);
  const registrationsAfterFirst = structuredClone(backend.state.registrations);

  const second = await runCleanup({ ...clients(backend.fetch), now: NOW, log: silentLog });
  assert.deepEqual(backend.state.counts, countsAfterFirst);
  assert.deepEqual(backend.state.registrations, registrationsAfterFirst);
  assert.deepEqual(second.counted, []);
  assert.deepEqual(second.deleted, []);
  assert.equal(backend.state.batchDeleteCalls.length, 1);
});

test('after a failed delete, the next run only deletes and does not count twice', async () => {
  const backend = createFakeBackend({ registrations: standardRegistrations(), events: EVENTS });
  backend.state.failDelete = true;
  const first = await runCleanup({ ...clients(backend.fetch), now: NOW, log: silentLog });

  assert.equal(backend.state.counts.length, 1, 'count was written');
  assert.equal(backend.state.registrations.length, 6, 'nothing deleted');
  assert.deepEqual(first.failed.map(f => [f.eventId, f.step]), [['oldEvent', 'delete']]);

  backend.state.failDelete = false;
  const second = await runCleanup({ ...clients(backend.fetch), now: NOW, log: silentLog });

  assert.equal(backend.state.counts.length, 1, 'still one count row');
  assert.equal(backend.state.counts[0].Registrations, 3);
  assert.deepEqual(backend.state.registrations.map(r => r.id), [4, 5, 6]);
  assert.deepEqual(second.counted, []);
  assert.deepEqual(second.deleted, [{ eventId: 'oldEvent', rows: 3 }]);
  assert.deepEqual(second.failed, []);
});

test('does not delete when writing the count fails', async () => {
  const backend = createFakeBackend({ registrations: standardRegistrations(), events: EVENTS });
  backend.state.failCreateCount = true;
  const summary = await runCleanup({ ...clients(backend.fetch), now: NOW, log: silentLog });

  assert.equal(backend.state.counts.length, 0);
  assert.equal(backend.state.registrations.length, 6);
  assert.deepEqual(backend.state.batchDeleteCalls, []);
  assert.deepEqual(summary.failed.map(f => [f.eventId, f.step]), [['oldEvent', 'count']]);
});

test('does not delete when "RSVP counts" has misnamed columns', async () => {
  const backend = createFakeBackend({ registrations: standardRegistrations(), events: EVENTS });
  backend.state.countColumns = ['Event id', 'Event title', 'Event date', 'Registrations'];
  const summary = await runCleanup({ ...clients(backend.fetch), now: NOW, log: silentLog });

  assert.equal(backend.state.registrations.length, 6);
  assert.deepEqual(backend.state.batchDeleteCalls, []);
  assert.deepEqual(summary.failed.map(f => [f.eventId, f.step]), [['oldEvent', 'count']]);
});

test('a failure for one event does not stop the others', async () => {
  const backend = createFakeBackend({
    registrations: [reg(1, 'oldEvent'), reg(2, 'otherOld')],
    events: { ...EVENTS, otherOld: { title: 'Other', date: '2026-03-01T19:00+01:00' } }
  });
  const { baserow, contentful } = clients(backend.fetch);
  const flakyBaserow = {
    ...baserow,
    deleteRows: ids => (ids.includes(1) ? Promise.reject(new Error('boom')) : baserow.deleteRows(ids))
  };
  const summary = await runCleanup({ baserow: flakyBaserow, contentful, now: NOW, log: silentLog });

  assert.deepEqual(summary.failed.map(f => f.eventId), ['oldEvent']);
  assert.deepEqual(summary.deleted, [{ eventId: 'otherOld', rows: 1 }]);
  assert.equal(backend.state.counts.length, 2);
});

test('leaves registrations of events Contentful does not return', async () => {
  const backend = createFakeBackend({ registrations: [reg(1, 'deletedEvent')], events: EVENTS });
  const summary = await runCleanup({ ...clients(backend.fetch), now: NOW, log: silentLog });
  assert.equal(backend.state.registrations.length, 1);
  assert.deepEqual(summary.skipped, [{ eventId: 'deletedEvent', reason: 'not-in-contentful' }]);
});

test('splits deletes into batches of at most 200 rows', async () => {
  const registrations = Array.from({ length: 450 }, (_, i) => reg(i + 1, 'oldEvent'));
  const backend = createFakeBackend({ registrations, events: EVENTS, pageSize: 200 });
  await runCleanup({ ...clients(backend.fetch), now: NOW, log: silentLog });

  assert.deepEqual(backend.state.batchDeleteCalls.map(items => items.length), [200, 200, 50]);
  assert.equal(backend.state.registrations.length, 0);
  assert.equal(backend.state.counts[0].Registrations, 450);
});

test('a dry run writes and deletes nothing', async () => {
  const backend = createFakeBackend({ registrations: standardRegistrations(), events: EVENTS });
  const summary = await runCleanup({ ...clients(backend.fetch), now: NOW, dryRun: true, log: silentLog });

  assert.deepEqual(backend.state.counts, []);
  assert.equal(backend.state.registrations.length, 6);
  assert.ok(backend.state.requests.every(r => r.method === 'GET'));
  assert.deepEqual(summary.counted, [{ eventId: 'oldEvent', registrations: 3 }]);
  assert.deepEqual(summary.deleted, [{ eventId: 'oldEvent', rows: 3 }]);
});

test('the handler does nothing without its configuration', async () => {
  const saved = { ...process.env };
  ['BASEROW_TOKEN', 'BASEROW_URL', 'BASEROW_RSVP_TABLE_ID', 'BASEROW_RSVP_COUNTS_TABLE_ID',
    'CONTENTFUL_SPACE_ID', 'CONTENTFUL_DELIVERY_TOKEN'].forEach(name => { delete process.env[name]; });
  const originalError = console.error;
  console.error = () => {};
  try {
    const response = await handler({});
    assert.equal(response.statusCode, 500);
  } finally {
    console.error = originalError;
    process.env = saved;
  }
});
