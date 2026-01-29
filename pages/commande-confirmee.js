import { useEffect, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStripe } from '@stripe/react-stripe-js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import styles from '../styles/Auth.module.css';

export default function OrderConfirmation() {
  const router = useRouter();
  const { payment_intent, payment_intent_client_secret, redirect_status, email, firstName, lastName, phone, city, postalCode, country } = router.query;
  const [orderNumber, setOrderNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { clearCart } = useCart();
  const [aamInitialized, setAamInitialized] = useState(false);

  // Envoie l'email au Meta Pixel pour l'Automatic Advanced Matching
  const initMetaPixelWithEmail = () => {
    if (typeof window !== 'undefined' && window.fbq && !aamInitialized && email) {
      window.fbq('init', '1495398438682010', {
        em: email,  // Email
      });
      setAamInitialized(true);
    }
  };

  useEffect(() => {
    if (payment_intent) {
      // Vérifier le statut du paiement
      verifyPaymentStatus(payment_intent, redirect_status);
    } else {
      // Pas de payment intent - rediriger vers le panier
      router.push('/panier');
    }
  }, [payment_intent, redirect_status]);

  const verifyPaymentStatus = async (paymentIntentId, status) => {
    try {
      // Vérifier le statut via l'API
      // Générer l'orderNum AVANT d'appeler l'API pour que le serveur puisse l'utiliser pour le CAPI
      const orderNum = `KL-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

      // Générer l'eventId pour déduplication Pixel/CAPI (SANS envoyer d'événement Pixel encore)
      const eventId = `Purchase_${orderNum}_${Date.now()}`;

      const response = await fetch(
        `/api/payments/verify?payment_intent=${paymentIntentId}&email=${encodeURIComponent(email || '')}&order_id=${orderNum}&event_id=${eventId}&firstName=${encodeURIComponent(firstName || '')}&lastName=${encodeURIComponent(lastName || '')}&phone=${encodeURIComponent(phone || '')}&city=${encodeURIComponent(city || '')}&postalCode=${encodeURIComponent(postalCode || '')}&country=${encodeURIComponent(country || '')}`
      );
      const data = await response.json();

      if (data.status === 'succeeded') {
        // Paiement réussi - vider le panier et afficher la confirmation
        setOrderNumber(orderNum);
        clearCart();
        setIsLoading(false);

        // Initialiser le Meta Pixel avec l'email (AAM)
        initMetaPixelWithEmail();

        // Track Meta Pixel Purchase event (client-side) avec le MÊME eventId et les BONS paramètres
        const totalValue = data.amount / 100;
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'Purchase', {
            value: totalValue,
            currency: 'EUR',
            content_type: 'product',
            order_id: orderNum
          }, { eventID: eventId }); // CRITIQUE: utiliser le MÊME eventId
        }

        // NOTE: Le CAPI est envoyé depuis le serveur (API payments/verify) avec le MÊME eventId - fonctionne même avec AdBlock !
      } else if (data.status === 'processing') {
        // Paiement en cours (Klarna, virement, etc.)
        // Utiliser le même orderNum que celui passé à l'API
        setOrderNumber(orderNum);
        clearCart();
        setIsLoading(false);

        // Initialiser le Meta Pixel avec l'email (AAM)
        initMetaPixelWithEmail();

        // Track Meta Pixel Purchase event for processing payments (client-side) avec le MÊME eventId
        const totalValue = data.amount / 100;
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'Purchase', {
            value: totalValue,
            currency: 'EUR',
            content_type: 'product',
            order_id: orderNum
          }, { eventID: eventId });
        }

        // NOTE: Le CAPI est envoyé depuis le serveur (API payments/verify) avec le MÊME eventId - fonctionne même avec AdBlock !
      } else if (data.status === 'requires_payment_method' || data.status === 'canceled') {
        // Paiement échoué ou annulé
        router.push('/paiement-annule?payment_intent=' + paymentIntentId);
      } else {
        // Autre statut d'erreur
        router.push('/paiement-echoue?payment_intent=' + paymentIntentId);
      }
    } catch (error) {
      console.error('Erreur de vérification du paiement:', error);
      // En cas d'erreur, rediriger vers la page d'échec
      router.push('/paiement-echoue?payment_intent=' + paymentIntentId + '&error=' + encodeURIComponent('Erreur de vérification du paiement'));
    }
  };

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Vérification du paiement - Kamba Lhains</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        <Header />

        <main className={styles.authPage}>
          <div className={styles.authContainer}>
            <div className={styles.authCard}>
              <div className={styles.authHeader}>
                <h1 className={styles.authTitle}>Vérification de votre paiement...</h1>
                <div style={{ fontSize: '60px', marginBottom: '20px', fontWeight: '300' }}>⏳</div>
                <p className={styles.authSubtitle}>
                  Veuillez patienter pendant que nous vérifions votre paiement.
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Commande confirmée - Kamba Lhains</title>
        <meta name="description" content="Votre commande Kamba Lhains a été confirmée" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Header />

      <main className={styles.authPage}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <h1 className={styles.authTitle}>
                Commande confirmée
              </h1>
              <div style={{ fontSize: '60px', color: '#22c55e', marginBottom: '20px', fontWeight: '300' }}>✓</div>
              <p className={styles.authSubtitle}>
                Merci pour votre commande ! Vous recevrez un email de confirmation dans quelques minutes.
              </p>
            </div>

            <div className={styles.authForm}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Numéro de commande</label>
                <div style={{
                  padding: '15px',
                  background: '#f8f8f8',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  textAlign: 'center',
                  letterSpacing: '1px'
                }}>
                  {orderNumber}
                </div>
              </div>

              <div style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '20px', color: '#000' }}>
                  Prochaines étapes
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ minWidth: '30px', width: '30px', height: '30px' }}>
                      <Image width={600} height={750} src="/em.png" alt="Email" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '12px', fontWeight: '500', marginBottom: '5px' }}>Email de confirmation</h3>
                      <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>
                        Vous recevrez un email avec les détails de votre commande
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ minWidth: '30px', width: '30px', height: '30px' }}>
                      <Image width={600} height={750} src="/coli.png" alt="Préparation" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '12px', fontWeight: '500', marginBottom: '5px' }}>Préparation</h3>
                      <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>
                        Votre commande sera préparée dans nos ateliers sous 2-3 jours ouvrés
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ minWidth: '30px', width: '30px', height: '30px' }}>
                      <Image width={600} height={750} src="/cami.png" alt="Expédition" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '12px', fontWeight: '500', marginBottom: '5px' }}>Expédition</h3>
                      <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>
                        Livraison sous 5-7 jours ouvrés avec suivi de colis
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/" className={styles.submitButton} style={{ marginTop: '40px', textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                Continuer mes achats
              </Link>
            </div>

            <div className={styles.authFooter}>
              <p>
                Besoin d'aide ?{' '}
                <Link href="/contact">Contactez-nous</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}