import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_TEST_KEY;

const buttonStyles = {
  fontSize: '.9em',
  textAlign: 'center',
  color: '#000',
  padding: '8px 12px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  border: '#000 2px solid',
  borderRadius: '5px',
  background: 'transparent'
}

const buttonDisabledStyles = {
  opacity: '0.5',
  cursor: 'not-allowed',
}

const shippingCountries = [
  'AT', 'BE', 'HR', 'BG', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE',
'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'US', 'CA'
]

let stripePromise
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

const Checkout = ({ slug, priceID }) => {

  const url = `${window.location.origin}/edition/${slug}`

  const [loading, setLoading] = useState(false)

  const redirectToCheckout = async event => {
    event.preventDefault()
    setLoading(true)

    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      mode: 'payment',
      lineItems: [{
        price: priceID,
        quantity: 1
      }],
      shippingAddressCollection: {
        allowedCountries: shippingCountries,
      },
      successUrl: `${url}?checkout=success`,
      cancelUrl: `${url}?checkout=cancel`,
    })

    if (error) {
      console.warn('Error:', error)
      setLoading(false)
    }
  }

  return (
    <button
      disabled={loading}
      style={
        loading ? { ...buttonStyles, ...buttonDisabledStyles } : buttonStyles
      }
      onClick={redirectToCheckout}
    >
      Buy the edition
    </button>
  )
}

export default Checkout
