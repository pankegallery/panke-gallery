// Server-side password check for the /codes print sheets.
// The real password only ever lives here, in the CODES_PASSWORD env var —
// never in the repo, never in the client JS bundle. The client just POSTs
// what the visitor typed and gets back { ok: true/false }.
exports.handler = async event => {
  const headers = { 'Content-Type': 'application/json' };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const expected = process.env.CODES_PASSWORD;
  if (!expected) {
    console.error('CODES_PASSWORD is not configured');
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server configuration error' }) };
  }

  let password;
  try {
    ({ password } = JSON.parse(event.body || '{}'));
  } catch (err) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request' }) };
  }

  const ok = typeof password === 'string' && password === expected;

  return { statusCode: 200, headers, body: JSON.stringify({ ok }) };
};
