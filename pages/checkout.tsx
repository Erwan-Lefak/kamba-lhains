import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { trackCheckoutInitiated } from '../utils/sessionManager';
import { sendCAPIInitiateCheckout } from '../lib/meta/capiHelper';
import { trackMetaInitiateCheckout } from '../components/MetaPixel';
import styles from '../styles/Checkout.module.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// Checkout Form Component
function CheckoutForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { items, getFormattedTotal, getTotalPrice, clearCart } = useCart();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aamInitialized, setAamInitialized] = useState(false);

  // Envoie les données utilisateur au Meta Pixel pour l'Automatic Advanced Matching
  const initMetaPixelWithUserData = () => {
    if (typeof window !== 'undefined' && (window as any).fbq && !aamInitialized) {
      (window as any).fbq('init', '1495398438682010', {
        em: formData.email,          // Email
        fn: formData.firstName,      // First Name
        ln: formData.lastName,       // Last Name
        ph: formData.phone,          // Phone
        ct: formData.city,           // City
        st: '',                      // State (pas utilisé en France)
        zp: formData.postalCode,     // ZIP Code
        country: formData.country,   // Country
      });
      setAamInitialized(true);
    }
  };

  const getShippingCost = () => {
    return getTotalPrice() >= 150 ? 0 : 9.90;
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getShippingCost();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = t('checkout.firstNameRequired');
    if (!formData.lastName) newErrors.lastName = t('checkout.lastNameRequired');
    if (!formData.email) newErrors.email = t('checkout.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('checkout.emailInvalid');
    }
    if (!formData.phone) newErrors.phone = t('checkout.phoneRequired');
    if (!formData.address) newErrors.address = t('checkout.addressRequired');
    if (!formData.city) newErrors.city = t('checkout.cityRequired');
    if (!formData.postalCode) newErrors.postalCode = t('checkout.postalCodeRequired');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !stripe || !elements) return;

    setIsProcessing(true);

    // Initialiser le Meta Pixel avec les données utilisateur (AAM)
    initMetaPixelWithUserData();

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/commande-confirmee?email=${encodeURIComponent(formData.email)}&firstName=${encodeURIComponent(formData.firstName)}&lastName=${encodeURIComponent(formData.lastName)}&phone=${encodeURIComponent(formData.phone)}&city=${encodeURIComponent(formData.city)}&postalCode=${encodeURIComponent(formData.postalCode)}&country=${encodeURIComponent(formData.country)}`,
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
        setErrors({ submit: error.message || t('checkout.paymentError') });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrors({ submit: t('checkout.paymentError') });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className={styles.checkoutPage}>
        <div className={styles.emptyCheckout}>
          <h1 className={styles.emptyTitle}>{t('checkout.emptyCart')}</h1>
          <p className={styles.emptyDescription}>{t('checkout.emptyDescription')}</p>
          <button onClick={() => router.push('/')} className={styles.continueButton}>
            {t('checkout.continueButton')}
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
            <span className={styles.itemCount}>
              {items.length} {items.length > 1 ? t('checkout.items') : t('checkout.item')}
            </span>
            <span className={styles.totalAmount}>
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(getFinalTotal())}
            </span>
          </div>
        </div>

        {/* Customer Information - Full width */}
        <div className={styles.checkoutSection}>
          <h2 className={styles.sectionTitle}>{t('checkout.information')}</h2>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                placeholder={t('checkout.firstName')}
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
                placeholder={t('checkout.lastName')}
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
                placeholder={t('checkout.email')}
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
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                placeholder={t('checkout.phone')}
                required
              />
              {errors.phone && <span className={styles.error}>{errors.phone}</span>}
            </div>
          </div>
        </div>

        {/* Shipping Address - Full width */}
        <div className={styles.checkoutSection}>
          <h2 className={styles.sectionTitle}>{t('checkout.shipping')}</h2>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup} style={{gridColumn: '1 / -1'}}>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
                placeholder={t('checkout.address')}
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
                placeholder={t('checkout.address2Optional')}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                placeholder={t('checkout.city')}
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
                placeholder={t('checkout.postalCode')}
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
        <div className={styles.checkoutSection}>
          <h2 className={styles.sectionTitle}>{t('checkout.payment')}</h2>
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
            {isProcessing
              ? t('checkout.processing')
              : `${t('checkout.order')} ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(getFinalTotal())}`
            }
          </button>
          <div className={styles.securityInfo}>
            {t('checkout.securePayment')}
          </div>
          <div className={styles.paymentMethods}>
            <Image width={600} height={750} src="/pay.png" alt="Payment methods" className={styles.paymentMethodsImage} />
          </div>
        </div>
      </div>
    </main>
  );
}

// Main Checkout Component with Stripe wrapper
export default function Checkout() {
  const { items, getTotalPrice } = useCart();
  const { t } = useLanguage();
  const [clientSecret, setClientSecret] = useState('');

  // Create payment intent on component mount
  useEffect(() => {
    if (items.length > 0) {
      createPaymentIntent();
      // Track checkout initiated
      trackCheckoutInitiated(null); // userId will be null for now, can be added later

      // Track Meta Pixel InitiateCheckout (client-side) avec déduplication eventId
      const totalValue = getTotalPrice();
      const numItems = items.length;

      // Utiliser le helper avec eventId pour déduplication Pixel/CAPI
      const eventId = trackMetaInitiateCheckout(totalValue, numItems);

      // Track Conversions API InitiateCheckout (server-side) avec MÊME eventId
      // Note: Email non disponible encore à ce stade (utilisateur pas encore rempli le formulaire)
      sendCAPIInitiateCheckout({
        totalValue: totalValue,
        numItems: numItems,
        currency: 'EUR',
        eventId: eventId, // CRITIQUE: même eventId pour déduplication
      });
    }
  }, [items]);

  const createPaymentIntent = async () => {
    try {
      const shippingCost = getTotalPrice() >= 150 ? 0 : 9.90;
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items,
          shippingCost: shippingCost
        })
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Head>
          <title>{t('checkout.title')} - Kamba Lhains</title>
        </Head>
        <Header />
        <CheckoutForm />
        <Footer />
      </>
    );
  }

  const options = clientSecret ? {
    clientSecret,
  } : undefined;

  return (
    <>
      <Head>
        <title>{t('checkout.title')} - Kamba Lhains</title>
        <meta name="description" content="Finaliser votre commande Kamba Lhains" />
      </Head>

      <Header />
      {options ? (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          {t('checkout.loading') || 'Chargement...'}
        </div>
      )}
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
