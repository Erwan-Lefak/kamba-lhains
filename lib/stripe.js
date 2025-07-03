import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export const calculateShipping = (shippingMethod, totalAmount) => {
  const rates = {
    standard: 0, // Free shipping
    express: 15.00, // Express shipping
  }
  
  return rates[shippingMethod] || 0
}

export const calculateTax = (subtotal, country = 'FR') => {
  const taxRates = {
    FR: 0.20, // 20% VAT in France
    EU: 0.20, // Default EU rate
    US: 0.08, // Example US rate
    DEFAULT: 0.20
  }
  
  const rate = taxRates[country] || taxRates.DEFAULT
  return Math.round(subtotal * rate * 100) / 100
}

export async function createPaymentIntent({
  amount,
  currency = 'eur',
  orderId,
  customerEmail,
  shippingAddress,
}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        orderId,
        customerEmail,
      },
      shipping: {
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        address: {
          line1: shippingAddress.address,
          line2: shippingAddress.address2 || null,
          city: shippingAddress.city,
          postal_code: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return paymentIntent
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw new Error('Failed to create payment intent')
  }
}

export async function confirmPaymentIntent(paymentIntentId) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error('Error confirming payment intent:', error)
    throw new Error('Failed to confirm payment')
  }
}