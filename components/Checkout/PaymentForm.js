import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import apiClient from '../../lib/api-client'
import styles from './Checkout.module.css'

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
  },
}

const PaymentForm = ({ orderData, totals, onBack, onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Create order first
      const orderResponse = await apiClient.request('/orders', {
        method: 'POST',
        body: orderData,
      })

      if (!orderResponse.success) {
        throw new Error(orderResponse.message)
      }

      const { order, paymentIntent } = orderResponse.data

      if (orderData.paymentMethod === 'stripe' && paymentIntent) {
        // Confirm payment with Stripe
        const cardElement = elements.getElement(CardElement)
        
        const { error: stripeError, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
          paymentIntent.clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`,
                email: orderData.shippingAddress.email,
                phone: orderData.shippingAddress.phone,
                address: {
                  line1: orderData.shippingAddress.address,
                  line2: orderData.shippingAddress.address2 || null,
                  city: orderData.shippingAddress.city,
                  postal_code: orderData.shippingAddress.postalCode,
                  country: orderData.shippingAddress.country.toLowerCase(),
                },
              },
            },
          }
        )

        if (stripeError) {
          throw new Error(stripeError.message)
        }

        if (confirmedPayment.status === 'succeeded') {
          // Confirm payment on backend
          await apiClient.request('/payments/confirm', {
            method: 'POST',
            body: {
              paymentIntentId: confirmedPayment.id,
            },
          })

          onSuccess()
        }
      } else {
        // For other payment methods or if no payment required
        onSuccess()
      }
    } catch (err) {
      console.error('Payment error:', err)
      setError(err.message || 'Une erreur est survenue lors du paiement')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className={styles.paymentForm}>
      <h2>Paiement</h2>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.paymentMethods}>
          <div className={styles.paymentOption}>
            <input
              type="radio"
              id="stripe"
              name="payment"
              value="stripe"
              checked={orderData.paymentMethod === 'stripe'}
              readOnly
            />
            <label htmlFor="stripe">
              <strong>Carte bancaire</strong>
              <p>Paiement sécurisé par Stripe</p>
            </label>
          </div>
        </div>

        {orderData.paymentMethod === 'stripe' && (
          <div className={styles.cardElement}>
            <label>Informations de carte</label>
            <div className={styles.cardElementContainer}>
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>
        )}

        <div className={styles.orderTotal}>
          <h3>Total à payer: {totals.total.toFixed(2)} EUR</h3>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.paymentActions}>
          <button 
            type="button" 
            onClick={onBack}
            className={styles.backButton}
            disabled={isProcessing}
          >
            Retour
          </button>
          
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className={styles.payButton}
          >
            {isProcessing ? 'Traitement...' : `Payer ${totals.total.toFixed(2)} EUR`}
          </button>
        </div>
      </form>

      <div className={styles.securityNote}>
        <p>🔒 Vos informations sont sécurisées et chiffrées</p>
      </div>
    </div>
  )
}

export default PaymentForm