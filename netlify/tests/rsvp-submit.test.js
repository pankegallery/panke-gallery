// Tests for the event date in the RSVP confirmation email (#128). Run with
// `npm run test:functions`. Only the formatter is tested: no email is sent.
//
// Netlify Functions run in UTC, while the maintainer's machine runs in
// Berlin time, so every case runs under several server time zones. Node
// picks up a changed `process.env.TZ` at runtime.

const test = require('node:test');
const assert = require('node:assert/strict');

const { formatEventDate } = require('../functions/rsvp-submit');

const SERVER_TIME_ZONES = ['UTC', 'Europe/Berlin', 'America/New_York', 'Asia/Tokyo'];

/** Runs `fn` once per server time zone, restoring the original zone afterwards. */
function inEachServerTimeZone(fn) {
  const original = process.env.TZ;
  try {
    for (const tz of SERVER_TIME_ZONES) {
      process.env.TZ = tz;
      fn(tz);
    }
  } finally {
    if (original === undefined) delete process.env.TZ;
    else process.env.TZ = original;
  }
}

const cases = [
  // As stored in Contentful for the event on 20 November 2026: no offset.
  ['winter, no offset', '2026-11-20T16:00', 'Friday, 20 November 2026 at 16:00'],
  ['summer, no offset', '2026-07-20T16:00', 'Monday, 20 July 2026 at 16:00'],
  ['winter, with seconds', '2026-11-20T16:00:00', 'Friday, 20 November 2026 at 16:00'],
  ['winter, +01:00', '2026-11-20T16:00+01:00', 'Friday, 20 November 2026 at 16:00'],
  ['summer, +02:00', '2026-07-20T16:00+02:00', 'Monday, 20 July 2026 at 16:00'],
  ['winter, UTC', '2026-11-20T15:00:00.000Z', 'Friday, 20 November 2026 at 16:00'],
  ['summer, UTC', '2026-07-20T14:00:00.000Z', 'Monday, 20 July 2026 at 16:00'],
  // Late evening: the Berlin date, not the UTC one.
  ['winter, after midnight UTC', '2026-11-20T23:30+01:00', 'Friday, 20 November 2026 at 23:30'],
  // Last Sunday of March / October: clock change days.
  ['day of spring change', '2026-03-29T16:00', 'Sunday, 29 March 2026 at 16:00'],
  ['day of autumn change', '2026-10-25T16:00', 'Sunday, 25 October 2026 at 16:00'],
  ['date only', '2026-11-20', 'Friday, 20 November 2026']
];

for (const [name, input, expected] of cases) {
  test(`formatEventDate: ${name}`, () => {
    inEachServerTimeZone((tz) => {
      assert.equal(formatEventDate(input), expected, `server time zone ${tz}`);
    });
  });
}

test('formatEventDate: no or unreadable date gives no date line', () => {
  for (const input of [undefined, null, '', 'tomorrow', 42]) {
    assert.equal(formatEventDate(input), '');
  }
});
