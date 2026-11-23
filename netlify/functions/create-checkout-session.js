// Starts a Stripe Checkout for an edition (#114). The "Buy the edition"
// button posts the edition's slug here, and the function returns the URL of
// Stripe's hosted Checkout page to send the buyer to.
//
// Replaces the client-only `stripe.redirectToCheckout`, which Stripe treats
// as legacy. The browser no longer loads Stripe.js at all (#60).
//
// Environment variables (see netlify.toml):
// - STRIPE_SECRET_KEY: restricted key with write access to Checkout Sessions
// - CONTENTFUL_SPACE_ID, CONTENTFUL_DELIVERY_TOKEN: to look up the edition
// - STRIPE_TEST_PRICE_ID (optional): price for every edition when the key is
//   a test key, since the prices in Contentful only exist in live mode

const Stripe = require('stripe');

// Every country Stripe Checkout ships to, except Sudan ('SD'), as in the
// former client-side checkout.
const SHIPPING_COUNTRIES = ['AC', 'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CV', 'CW', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MK', 'ML', 'MM', 'MN', 'MO', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SZ', 'TA', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VN', 'VU', 'WF', 'WS', 'XK', 'YE', 'YT', 'ZA', 'ZM', 'ZW', 'ZZ'];

// Edition slugs as in Contentful, e.g. "edition-002-alexiety".
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const HEADERS = { 'Content-Type': 'application/json' };

/** A JSON response in the shape Netlify Functions expect. */
function respond(statusCode, body) {
  return { statusCode, headers: HEADERS, body: JSON.stringify(body) };
}

/**
 * Whether a Stripe key is a test-mode key: secret (`sk_test_`) or
 * restricted (`rk_test_`).
 *
 * @param {string} key
 * @returns {boolean}
 */
function isTestKey(key) {
  return /^(sk|rk)_test_/.test(key || '');
}

/**
 * The price to charge for an edition. In live mode it is always the edition's
 * price in Contentful. Only with a test key may STRIPE_TEST_PRICE_ID stand in
 * for it, so a stray override can never change what a live buyer pays.
 *
 * @param {Object} args
 * @param {string|null} args.contentfulPriceId - `stripePriceId` of the edition.
 * @param {string} args.secretKey - STRIPE_SECRET_KEY.
 * @param {string} [args.testPriceId] - STRIPE_TEST_PRICE_ID.
 * @returns {string|null} The price ID, or null if the edition isn't for sale.
 */
function choosePrice({ contentfulPriceId, secretKey, testPriceId }) {
  // An edition without a price in Contentful has no buy button, so it isn't
  // for sale in test mode either.
  if (!contentfulPriceId) return null;
  if (testPriceId && isTestKey(secretKey)) return testPriceId;
  return contentfulPriceId;
}

/**
 * Looks up an edition's Stripe price in Contentful, so only editions that
 * are for sale can be bought and the browser can't pass in another price.
 *
 * @param {Object} args
 * @param {string} args.spaceId
 * @param {string} args.token - Contentful delivery token.
 * @param {Function} [args.fetchImpl] - `fetch`, or a mock in tests.
 * @returns {{ getPriceId: (slug: string) => Promise<string|null> }}
 */
function createContentfulClient({ spaceId, token, fetchImpl = fetch }) {
  return {
    async getPriceId(slug) {
      // The site uses the default "master" environment (gatsby-config.js).
      const requestUrl = `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries`
        + `?content_type=edition&fields.slug=${encodeURIComponent(slug)}`
        + '&select=fields.stripePriceId&limit=1&include=0';
      const response = await fetchImpl(requestUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error(`Contentful responded ${response.status}`);
      }
      const data = await response.json();
      const priceId = data.items?.[0]?.fields?.stripePriceId;
      return typeof priceId === 'string' && priceId.trim() ? priceId.trim() : null;
    }
  };
}

/**
 * Creates the Checkout Session for one edition.
 *
 * @param {Object} args
 * @param {Object} args.event - The Netlify Functions event.
 * @param {Object} args.stripe - A Stripe client, or a mock in tests.
 * @param {Object} args.contentful - From `createContentfulClient`, or a mock.
 * @param {string} args.secretKey - STRIPE_SECRET_KEY, to tell test from live.
 * @param {string} [args.testPriceId] - STRIPE_TEST_PRICE_ID.
 * @param {Object} [args.log] - console-like logger.
 * @returns {Promise<Object>} The Netlify Functions response.
 */
async function createCheckoutSession({ event, stripe, contentful, secretKey, testPriceId, log = console }) {
  if (event.httpMethod !== 'POST') {
    return respond(405, { error: 'Method not allowed' });
  }

  let slug;
  try {
    ({ slug } = JSON.parse(event.body || '{}'));
  } catch (error) {
    return respond(400, { error: 'Invalid request' });
  }
  if (typeof slug !== 'string' || !SLUG_PATTERN.test(slug)) {
    return respond(400, { error: 'Invalid request' });
  }

  const contentfulPriceId = await contentful.getPriceId(slug);
  const price = choosePrice({ contentfulPriceId, secretKey, testPriceId });
  if (!price) {
    return respond(404, { error: 'This edition is not for sale' });
  }

  // Return to the deploy that served the button: the live site, a deploy
  // preview or `netlify dev`. `rawUrl` is this function's own URL on that
  // deploy, so the browser can't point the return URLs at another site.
  const editionUrl = `${new URL(event.rawUrl).origin}/edition/${slug}/`;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price, quantity: 1 }],
    shipping_address_collection: { allowed_countries: SHIPPING_COUNTRIES },
    success_url: `${editionUrl}?checkout=success`,
    cancel_url: `${editionUrl}?checkout=cancel`
  });

  log.info(`Checkout session created for ${slug}`);
  return respond(200, { url: session.url });
}

exports.handler = async event => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const token = process.env.CONTENTFUL_DELIVERY_TOKEN;
  if (!secretKey || !spaceId || !token) {
    console.error('create-checkout-session: STRIPE_SECRET_KEY or the Contentful variables are not configured');
    return respond(500, { error: 'Server configuration error' });
  }

  try {
    return await createCheckoutSession({
      event,
      stripe: new Stripe(secretKey),
      contentful: createContentfulClient({ spaceId, token }),
      secretKey,
      testPriceId: process.env.STRIPE_TEST_PRICE_ID
    });
  } catch (error) {
    // Stripe and Contentful errors carry no buyer data at this point: the
    // buyer only enters details on Stripe's page.
    console.error('create-checkout-session:', error.message);
    return respond(502, { error: 'The checkout could not be started' });
  }
};

exports.createCheckoutSession = createCheckoutSession;
exports.createContentfulClient = createContentfulClient;
exports.choosePrice = choosePrice;
exports.isTestKey = isTestKey;
exports.SHIPPING_COUNTRIES = SHIPPING_COUNTRIES;
