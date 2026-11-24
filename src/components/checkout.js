import React, { useEffect, useState } from 'react'
import { Link } from 'gatsby'
import { theme } from '../theme/theme'
import { CheckoutError } from './checkout/Checkout.styles'

// Creates the Stripe Checkout Session on the server (#114). The browser
// loads nothing from Stripe until it is sent to Stripe's Checkout page (#60).
const CHECKOUT_ENDPOINT = '/.netlify/functions/create-checkout-session'

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

/**
 * The "Buy the edition" button. A click asks our Netlify function for a
 * Stripe Checkout Session and sends the buyer to Stripe's hosted Checkout,
 * which returns them to the edition page with `?checkout=success` or
 * `?checkout=cancel`. The function looks up the price in Contentful, so the
 * page only sends the slug. If the checkout can't be started, the button
 * turns active again and a short message says so.
 *
 * @param {Object} props
 * @param {string} props.slug - The edition's slug.
 */
const Checkout = ({ slug }) => {
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  // Going back from Stripe with the browser's Back button can restore this
  // page from the back/forward cache, still disabled from the click.
  useEffect(() => {
    const onPageShow = event => {
      if (event.persisted) setLoading(false)
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

  const startCheckout = async event => {
    event.preventDefault()
    setLoading(true)
    setFailed(false)

    try {
      const response = await fetch(CHECKOUT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug })
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.url) {
        throw new Error(data.error || `Checkout responded ${response.status}`)
      }
      // The button stays disabled while the browser leaves for Stripe.
      window.location.assign(data.url)
    } catch (error) {
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
        onClick={startCheckout}
      >
        Buy the edition
      </button>
      <div role="status">
        {failed && (
          <CheckoutError>
            The checkout couldn't be opened. Please try again, or <Link to="/contact/">contact us</Link> to order the edition.
          </CheckoutError>
        )}
      </div>
    </>
  )
}

export default Checkout
