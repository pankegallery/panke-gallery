import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;

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

const buttonHoverStyles = {
  opacity: '0.8',
}

let stripePromise
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

const Checkout = ({ slug }) => {

  const url = `${window.location.origin}/edition/${slug}`

  const [loading, setLoading] = useState(false)

  const redirectToCheckout = async event => {
    event.preventDefault()
    setLoading(true)

    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      mode: 'payment',
      lineItems: [{
        price: 'price_1IXXQqJ1sNuO02XTuYiyaCo3',
        quantity: 1
      }],
      shippingAddressCollection: {
        allowedCountries: ['AT', 'BE', 'HR', 'BG', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE',
'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'US', 'CA'],
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
