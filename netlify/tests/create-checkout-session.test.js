// Tests for the edition checkout (#114). Run with `npm run test:functions`.
// Stripe and Contentful are mocked: nothing is sent to either.

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createCheckoutSession,
  createContentfulClient,
  choosePrice,
  isTestKey
} = require('../functions/create-checkout-session');

const LIVE_KEY = 'rk_live_example';
const TEST_KEY = 'rk_test_example';
const SITE = 'https://www.panke.gallery';

const silent = { info() {}, error() {} };

/** A Stripe mock that records the sessions it is asked to create. */
function mockStripe() {
  const created = [];
  return {
    created,
    checkout: {
      sessions: {
        async create(params) {
          created.push(params);
          return { url: 'https://checkout.stripe.com/c/pay/cs_test_example' };
        }
      }
    }
  };
}

/** A Contentful mock with the price IDs of the given slugs. */
function mockContentful(prices) {
  return { async getPriceId(slug) { return prices[slug] || null; } };
}

function postEvent(body, origin = SITE) {
  return {
    httpMethod: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
    rawUrl: `${origin}/.netlify/functions/create-checkout-session`
  };
}

const editions = { 'edition-002-alexiety': 'price_live_alexiety' };

test('creates a session with the edition price from Contentful', async () => {
  const stripe = mockStripe();
  const response = await createCheckoutSession({
    event: postEvent({ slug: 'edition-002-alexiety' }),
    stripe,
    contentful: mockContentful(editions),
    secretKey: LIVE_KEY,
    log: silent
  });

  assert.equal(response.statusCode, 200);
  assert.equal(JSON.parse(response.body).url, 'https://checkout.stripe.com/c/pay/cs_test_example');
  assert.equal(stripe.created.length, 1);
  const params = stripe.created[0];
  assert.equal(params.mode, 'payment');
  assert.deepEqual(params.line_items, [{ price: 'price_live_alexiety', quantity: 1 }]);
  assert.ok(params.shipping_address_collection.allowed_countries.includes('DE'));
  assert.equal(params.success_url, `${SITE}/edition/edition-002-alexiety/?checkout=success`);
  assert.equal(params.cancel_url, `${SITE}/edition/edition-002-alexiety/?checkout=cancel`);
});

test('returns to the deploy that called it, e.g. netlify dev', async () => {
  const stripe = mockStripe();
  await createCheckoutSession({
    event: postEvent({ slug: 'edition-002-alexiety' }, 'http://localhost:8888'),
    stripe,
    contentful: mockContentful(editions),
    secretKey: TEST_KEY,
    log: silent
  });
  assert.equal(stripe.created[0].success_url, 'http://localhost:8888/edition/edition-002-alexiety/?checkout=success');
});

test('ignores a price sent by the browser', async () => {
  const stripe = mockStripe();
  await createCheckoutSession({
    event: postEvent({ slug: 'edition-002-alexiety', price: 'price_cheap', priceID: 'price_cheap' }),
    stripe,
    contentful: mockContentful(editions),
    secretKey: LIVE_KEY,
    log: silent
  });
  assert.equal(stripe.created[0].line_items[0].price, 'price_live_alexiety');
});

test('rejects an edition that is not for sale or does not exist', async () => {
  const stripe = mockStripe();
  const response = await createCheckoutSession({
    event: postEvent({ slug: 'edition-999-unknown' }),
    stripe,
    contentful: mockContentful(editions),
    secretKey: LIVE_KEY,
    log: silent
  });
  assert.equal(response.statusCode, 404);
  assert.equal(stripe.created.length, 0);
});

test('rejects invalid requests without asking Contentful or Stripe', async () => {
  const stripe = mockStripe();
  let lookups = 0;
  const contentful = { async getPriceId() { lookups += 1; return 'price_x'; } };

  const cases = [
    [{ httpMethod: 'GET', rawUrl: `${SITE}/x` }, 405],
    [postEvent('not json'), 400],
    [postEvent({}), 400],
    [postEvent({ slug: 42 }), 400],
    [postEvent({ slug: '../edition-002-alexiety' }), 400],
    [postEvent({ slug: 'edition-002-alexiety&content_type=event' }), 400],
    [postEvent({ slug: 'Edition-002' }), 400]
  ];
  for (const [event, status] of cases) {
    const response = await createCheckoutSession({ event, stripe, contentful, secretKey: LIVE_KEY, log: silent });
    assert.equal(response.statusCode, status, JSON.stringify(event.body));
  }
  assert.equal(lookups, 0);
  assert.equal(stripe.created.length, 0);
});

test('choosePrice: the test price only replaces a price with a test key', () => {
  const args = { contentfulPriceId: 'price_live', testPriceId: 'price_test' };
  assert.equal(choosePrice({ ...args, secretKey: TEST_KEY }), 'price_test');
  assert.equal(choosePrice({ ...args, secretKey: 'sk_test_example' }), 'price_test');
  // A test price left set in production must not change the live price.
  assert.equal(choosePrice({ ...args, secretKey: LIVE_KEY }), 'price_live');
  assert.equal(choosePrice({ ...args, secretKey: 'sk_live_example' }), 'price_live');
  assert.equal(choosePrice({ contentfulPriceId: 'price_live', secretKey: TEST_KEY }), 'price_live');
  // Not for sale stays not for sale in test mode.
  assert.equal(choosePrice({ ...args, contentfulPriceId: null, secretKey: TEST_KEY }), null);
});

test('isTestKey', () => {
  assert.equal(isTestKey('sk_test_abc'), true);
  assert.equal(isTestKey('rk_test_abc'), true);
  assert.equal(isTestKey('sk_live_abc'), false);
  assert.equal(isTestKey('rk_live_abc'), false);
  assert.equal(isTestKey(undefined), false);
});

test('Contentful client: asks for one edition by slug and reads its price', async () => {
  const requests = [];
  const fetchImpl = async (url, options) => {
    requests.push({ url, options });
    return { ok: true, async json() { return { items: [{ fields: { stripePriceId: ' price_live_alexiety ' } }] }; } };
  };
  const client = createContentfulClient({ spaceId: 'space', token: 'token', fetchImpl });

  assert.equal(await client.getPriceId('edition-002-alexiety'), 'price_live_alexiety');
  const url = new URL(requests[0].url);
  assert.equal(url.pathname, '/spaces/space/environments/master/entries');
  assert.equal(url.searchParams.get('content_type'), 'edition');
  assert.equal(url.searchParams.get('fields.slug'), 'edition-002-alexiety');
  assert.equal(requests[0].options.headers.Authorization, 'Bearer token');
});

test('Contentful client: no edition or no price gives null, errors throw', async () => {
  const reply = (body, ok = true, status = 200) => async () => ({ ok, status, async json() { return body; } });

  assert.equal(await createContentfulClient({ spaceId: 's', token: 't', fetchImpl: reply({ items: [] }) }).getPriceId('x'), null);
  assert.equal(await createContentfulClient({ spaceId: 's', token: 't', fetchImpl: reply({ items: [{ fields: {} }] }) }).getPriceId('x'), null);
  await assert.rejects(
    createContentfulClient({ spaceId: 's', token: 't', fetchImpl: reply({}, false, 401) }).getPriceId('x'),
    /401/
  );
});
