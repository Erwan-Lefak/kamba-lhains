import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import PaymentForm from './PaymentForm'
import apiClient from '../../lib/api-client'
import styles from './Checkout.module.css'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const CheckoutForm = () => {
  const router = useRouter()
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [orderData, setOrderData] = useState({
    shippingAddress: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      address2: '',
      city: '',
      postalCode: '',
      country: 'FR',
    },
    billingAddress: null,
    useSameAddress: true,
    paymentMethod: 'stripe',
    shippingMethod: 'standard',
    notes: '',
  })

  useEffect(() => {
    loadCartItems()
  }, [])

  const loadCartItems = async () => {
    try {
      const response = await apiClient.getCart()
      if (response.success) {
        setCartItems(response.data.items)
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      alert('Erreur lors du chargement du panier')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (section, field, value) => {
    setOrderData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleShippingMethodChange = (method) => {
    setOrderData(prev => ({
      ...prev,
      shippingMethod: method
    }))
  }

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + (parseFloat(item.product.price) * item.quantity)
    }, 0)
    
    const shippingCost = orderData.shippingMethod === 'express' ? 15 : 0
    const taxAmount = (subtotal + shippingCost) * 0.20
    const total = subtotal + shippingCost + taxAmount

    return { subtotal, shippingCost, taxAmount, total }
  }

  const validateStep = (step) => {
    if (step === 1) {
      const { firstName, lastName, email, phone, address, city, postalCode } = orderData.shippingAddress
      return firstName && lastName && email && phone && address && city && postalCode
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    } else {
      alert('Veuillez remplir tous les champs obligatoires')
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  if (isLoading) {
    return <div className={styles.loading}>Chargement...</div>
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCheckout}>
        <h2>Votre panier est vide</h2>
        <button onClick={() => router.push('/boutique')} className={styles.shopButton}>
          Continuer mes achats
        </button>
      </div>
    )
  }

  const { subtotal, shippingCost, taxAmount, total } = calculateTotals()

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutForm}>
        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>
            <span>1</span> Livraison
          </div>
          <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>
            <span>2</span> Paiement
          </div>
          <div className={`${styles.step} ${currentStep >= 3 ? styles.active : ''}`}>
            <span>3</span> Confirmation
          </div>
        </div>

        {currentStep === 1 && (
          <div className={styles.shippingForm}>
            <h2>Informations de livraison</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Prénom *</label>
                <input
                  type="text"
                  value={orderData.shippingAddress.firstName}
                  onChange={(e) => handleInputChange('shippingAddress', 'firstName', e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Nom *</label>
                <input
                  type="text"
                  value={orderData.shippingAddress.lastName}
                  onChange={(e) => handleInputChange('shippingAddress', 'lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Email *</label>
              <input
                type="email"
                value={orderData.shippingAddress.email}
                onChange={(e) => handleInputChange('shippingAddress', 'email', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Téléphone *</label>
              <input
                type="tel"
                value={orderData.shippingAddress.phone}
                onChange={(e) => handleInputChange('shippingAddress', 'phone', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Adresse *</label>
              <input
                type="text"
                value={orderData.shippingAddress.address}
                onChange={(e) => handleInputChange('shippingAddress', 'address', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Complément d'adresse</label>
              <input
                type="text"
                value={orderData.shippingAddress.address2}
                onChange={(e) => handleInputChange('shippingAddress', 'address2', e.target.value)}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Ville *</label>
                <input
                  type="text"
                  value={orderData.shippingAddress.city}
                  onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Code postal *</label>
                <input
                  type="text"
                  value={orderData.shippingAddress.postalCode}
                  onChange={(e) => handleInputChange('shippingAddress', 'postalCode', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.shippingMethods}>
              <h3>Mode de livraison</h3>
              <div className={styles.shippingOption}>
                <input
                  type="radio"
                  id="standard"
                  name="shipping"
                  value="standard"
                  checked={orderData.shippingMethod === 'standard'}
                  onChange={(e) => handleShippingMethodChange(e.target.value)}
                />
                <label htmlFor="standard">
                  <div>
                    <strong>Livraison standard</strong>
                    <p>3-5 jours ouvrables - Gratuite</p>
                  </div>
                  <span>0,00 EUR</span>
                </label>
              </div>
              
              <div className={styles.shippingOption}>
                <input
                  type="radio"
                  id="express"
                  name="shipping"
                  value="express"
                  checked={orderData.shippingMethod === 'express'}
                  onChange={(e) => handleShippingMethodChange(e.target.value)}
                />
                <label htmlFor="express">
                  <div>
                    <strong>Livraison express</strong>
                    <p>1-2 jours ouvrables</p>
                  </div>
                  <span>15,00 EUR</span>
                </label>
              </div>
            </div>

            <button onClick={nextStep} className={styles.nextButton}>
              Continuer vers le paiement
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <Elements stripe={stripePromise}>
            <PaymentForm
              orderData={orderData}
              totals={{ subtotal, shippingCost, taxAmount, total }}
              onBack={prevStep}
              onSuccess={() => setCurrentStep(3)}
            />
          </Elements>
        )}

        {currentStep === 3 && (
          <div className={styles.confirmation}>
            <h2>Commande confirmée !</h2>
            <p>Merci pour votre commande. Vous recevrez un email de confirmation sous peu.</p>
            <button 
              onClick={() => router.push('/')}
              className={styles.homeButton}
            >
              Retour à l'accueil
            </button>
          </div>
        )}
      </div>

      <div className={styles.orderSummary}>
        <h2>Récapitulatif</h2>
        
        <div className={styles.summaryItems}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.summaryItem}>
              <Image width={600} height={750} src={item.product.image} alt={item.product.name} />
              <div>
                <h4>{item.product.name}</h4>
                {item.size && <p>Taille: {item.size}</p>}
                {item.color && <p>Couleur: {item.color}</p>}
                <p>Quantité: {item.quantity}</p>
              </div>
              <span>{(parseFloat(item.product.price) * item.quantity).toFixed(2)} EUR</span>
            </div>
          ))}
        </div>

        <div className={styles.summaryTotals}>
          <div className={styles.summaryLine}>
            <span>Sous-total</span>
            <span>{subtotal.toFixed(2)} EUR</span>
          </div>
          <div className={styles.summaryLine}>
            <span>Livraison</span>
            <span>{shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)} EUR`}</span>
          </div>
          <div className={styles.summaryLine}>
            <span>TVA (20%)</span>
            <span>{taxAmount.toFixed(2)} EUR</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>{total.toFixed(2)} EUR</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutForm