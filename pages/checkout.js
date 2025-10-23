import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import styles from '../styles/Checkout.module.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Checkout Form Component
function CheckoutForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { items, getFormattedTotal, getTotalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    postalCode: '',
    country: 'FR',
    saveInfo: false
  });
  const [errors, setErrors] = useState({});

  // Create payment intent on component mount
  useEffect(() => {
    if (items.length > 0) {
      createPaymentIntent();
    }
  }, [items]);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items,
          shippingCost: getShippingCost()
        })
      });
      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  const getShippingCost = () => {
    return getTotalPrice() >= 150 ? 0 : 9.90;
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getShippingCost();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName) newErrors.firstName = 'Prénom requis';
    if (!formData.lastName) newErrors.lastName = 'Nom requis';
    if (!formData.email) newErrors.email = 'Email requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email invalide';
    }
    if (!formData.address) newErrors.address = 'Adresse requise';
    if (!formData.city) newErrors.city = 'Ville requise';
    if (!formData.postalCode) newErrors.postalCode = 'Code postal requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || !stripe || !elements) return;

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/commande-confirmee`,
          payment_method_data: {
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.address,
                line2: formData.address2,
                city: formData.city,
                postal_code: formData.postalCode,
                country: formData.country
              }
            }
          },
          shipping: {
            name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            address: {
              line1: formData.address,
              line2: formData.address2,
              city: formData.city,
              postal_code: formData.postalCode,
              country: formData.country
            }
          }
        }
      });

      if (error) {
        setErrors({ submit: error.message });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrors({ submit: 'Erreur de paiement. Veuillez réessayer.' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className={styles.checkoutPage}>
        <div className={styles.emptyCheckout}>
          <h1 className={styles.emptyTitle}>Votre panier est vide</h1>
          <p className={styles.emptyDescription}>Découvrez notre collection</p>
          <button onClick={() => router.push('/')} className={styles.continueButton}>
            Continuer
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.checkoutPage}>
      <div className={styles.checkoutContainer}>
        {/* Order Summary - Compact top section */}
        <div className={styles.orderSummary}>
          <div className={styles.summaryHeader}>
            <span className={styles.itemCount}>{items.length} article{items.length > 1 ? 's' : ''}</span>
            <span className={styles.totalAmount}>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(getFinalTotal())}</span>
          </div>
        </div>

        {/* Customer Information - Full width */}
        <div className={styles.checkoutSection}>
          <h2 className={styles.sectionTitle}>Informations</h2>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                placeholder="Prénom"
                required
              />
              {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                placeholder="Nom"
                required
              />
              {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
            </div>
            <div className={styles.inputGroup}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="Email"
                required
              />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>
            <div className={styles.inputGroup}>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Téléphone (optionnel)"
              />
            </div>
          </div>
        </div>

        {/* Shipping Address - Full width */}
        <div className={styles.checkoutSection}>
          <h2 className={styles.sectionTitle}>Livraison</h2>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup} style={{gridColumn: '1 / -1'}}>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
                placeholder="Adresse"
                required
              />
              {errors.address && <span className={styles.error}>{errors.address}</span>}
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Complément d'adresse (optionnel)"
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                placeholder="Ville"
                required
              />
              {errors.city && <span className={styles.error}>{errors.city}</span>}
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.postalCode ? styles.inputError : ''}`}
                placeholder="Code postal"
                required
              />
              {errors.postalCode && <span className={styles.error}>{errors.postalCode}</span>}
            </div>
            <div className={styles.inputGroup}>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={styles.input}
              >
                <option value="FR">France</option>
                <option value="BE">Belgique</option>
                <option value="CH">Suisse</option>
                <option value="LU">Luxembourg</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment - Full width */}
        {clientSecret && (
          <div className={styles.checkoutSection}>
            <h2 className={styles.sectionTitle}>Paiement</h2>
            <div className={styles.paymentSection}>
              <PaymentElement 
                options={{
                  layout: {
                    type: 'tabs',
                    defaultCollapsed: false,
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className={styles.checkoutActions}>
          {errors.submit && (
            <div className={styles.submitError}>{errors.submit}</div>
          )}
          <button
            onClick={handleSubmit}
            className={styles.submitButton}
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? 'Traitement...' : `Commander ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(getFinalTotal())}`}
          </button>
          <div className={styles.securityInfo}>
            Paiement sécurisé
          </div>
        </div>
      </div>
    </main>
  );
}

// Main Checkout Component with Stripe wrapper
export default function Checkout() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Head>
          <title>Checkout - Kamba Lhains</title>
        </Head>
        <Header />
        <CheckoutForm />
        <Footer />
      </>
    );
  }

  const options = {
    mode: 'payment',
    currency: 'eur',
    amount: Math.round((items.reduce((total, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^\d.]/g, '')) 
        : item.price;
      return total + (price * item.quantity);
    }, 0) + (items.reduce((total, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^\d.]/g, '')) 
        : item.price;
      return total + (price * item.quantity);
    }, 0) >= 150 ? 0 : 9.90)) * 100),
    automatic_payment_methods: {
      enabled: true,
    },
  };

  return (
    <>
      <Head>
        <title>Checkout - Kamba Lhains</title>
        <meta name="description" content="Finaliser votre commande Kamba Lhains" />
      </Head>
      <Header />
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
      <Footer />
    </>
  );
}

// Force server-side rendering (no static generation)
export async function getServerSideProps() {
  return {
    props: {},
  };
}