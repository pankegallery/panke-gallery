import React, { useState } from 'react'
import { Link } from 'gatsby'
// The `pure` entry, not the package root: the root injects the Stripe.js
// script as a side effect of the import, so every edition page loaded Stripe
// (and its fraud-detection iframe) before anyone clicked "Buy" (#60). With
// `pure`, the script loads only when `loadStripe` runs in the click handler.
import { loadStripe } from '@stripe/stripe-js/pure'
import { theme } from '../theme/theme'
import { CheckoutError } from './checkout/Checkout.styles'

const STRIPE_PUBLISHABLE_KEY = process.env.GATSBY_STRIPE_PUBLISHABLE_LIVE_KEY;

const buttonStyles = {
  fontSize: theme.fontSizes.medium,
  textAlign: 'center',
  color: '#000',
  padding: '8px 12px',
  letterSpacing: theme.letterSpacing.uppercase,
  textTransform: 'uppercase',
  border: '#000 2px solid',
  borderRadius: '5px',
  background: 'transparent'
}

const buttonDisabledStyles = {
  opacity: '0.5',
  cursor: 'not-allowed',
}

//const EUCountries = ['AT', 'BE', 'HR', 'BG', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB']

const worldCountries = ['AC', 'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CV', 'CW', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MK', 'ML', 'MM', 'MN', 'MO', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SZ', 'TA', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VN', 'VU', 'WF', 'WS', 'XK', 'YE', 'YT', 'ZA', 'ZM', 'ZW', 'ZZ']

// The buyer goes on to Stripe's hosted Checkout page, which runs Stripe's
// fraud detection itself. Turned off here, the hidden fraud-detection iframe
// isn't added to our page in the moment between the click and the redirect.
loadStripe.setLoadParameters({ advancedFraudSignals: false })

let stripePromise
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

/**
 * The "Buy the edition" button. A click loads Stripe.js and sends the buyer
 * to Stripe's hosted Checkout, which returns them to the edition page with
 * `?checkout=success` or `?checkout=cancel`. If the checkout can't be opened
 * (Stripe.js blocked or unreachable, or Stripe rejects the request), the
 * button turns active again and a short message says so.
 *
 * @param {Object} props
 * @param {string} props.slug - The edition's slug, for the return URLs.
 * @param {string} props.priceID - The edition's Stripe price ID.
 */
const Checkout = ({ slug, priceID }) => {

  let url = typeof window !== 'undefined' ? window.location.origin : '';
  url = `${url}/edition/${slug}`

  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  const redirectToCheckout = async event => {
    event.preventDefault()
    setLoading(true)
    setFailed(false)

    // A successful redirect leaves the page, so we only get past the await
    // when it failed. Loading the script can fail too (e.g. a content
    // blocker), which rejects rather than returning `error`.
    let error
    try {
      const stripe = await getStripe()
      const result = await stripe.redirectToCheckout({
        mode: 'payment',
        lineItems: [{
          price: priceID,
          quantity: 1
        }],
        shippingAddressCollection: {
          allowedCountries: worldCountries,
        },
        successUrl: `${url}?checkout=success`,
        cancelUrl: `${url}?checkout=cancel`,
      })
      error = result.error
    } catch (loadError) {
      error = loadError
    }

    if (error) {
      console.warn('Checkout error:', error)
      setFailed(true)
      setLoading(false)
    }
  }

  return (
    <>
      <button
        disabled={loading}
        style={
          loading ? { ...buttonStyles, ...buttonDisabledStyles } : buttonStyles
        }
        onClick={redirectToCheckout}
      >
        Buy the edition
      </button>
      <div role="status">
        {failed && (
          <CheckoutError>
            The checkout couldn't be opened. Please reload the page and try again, or <Link to="/contact/">contact us</Link> to order the edition.
          </CheckoutError>
        )}
      </div>
    </>
  )
}

export default Checkout
