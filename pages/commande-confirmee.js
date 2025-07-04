import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/OrderConfirmation.module.css';

export default function OrderConfirmation() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    // Generate a random order number
    const randomOrderNumber = 'KL' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setOrderNumber(randomOrderNumber);
  }, []);

  return (
    <>
      <Head>
        <title>Commande confirmée - Kamba Lhains</title>
        <meta name="description" content="Votre commande Kamba Lhains a été confirmée" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Header />

      <main className={styles.confirmationPage}>
        <div className={styles.confirmationContainer}>
          <div className={styles.confirmationCard}>
            <div className={styles.successIcon}>✓</div>
            
            <h1 className={styles.confirmationTitle}>
              Commande confirmée
            </h1>
            
            <p className={styles.confirmationMessage}>
              Merci pour votre commande ! Vous recevrez un email de confirmation dans quelques minutes.
            </p>

            <div className={styles.orderDetails}>
              <div className={styles.orderNumber}>
                <span className={styles.orderLabel}>Numéro de commande :</span>
                <span className={styles.orderValue}>{orderNumber}</span>
              </div>
            </div>

            <div className={styles.nextSteps}>
              <h2 className={styles.nextStepsTitle}>Prochaines étapes</h2>
              <div className={styles.stepsList}>
                <div className={styles.step}>
                  <div className={styles.stepIcon}>📧</div>
                  <div className={styles.stepContent}>
                    <h3>Email de confirmation</h3>
                    <p>Vous recevrez un email avec les détails de votre commande</p>
                  </div>
                </div>
                
                <div className={styles.step}>
                  <div className={styles.stepIcon}>📦</div>
                  <div className={styles.stepContent}>
                    <h3>Préparation</h3>
                    <p>Votre commande sera préparée dans nos ateliers sous 2-3 jours ouvrés</p>
                  </div>
                </div>
                
                <div className={styles.step}>
                  <div className={styles.stepIcon}>🚚</div>
                  <div className={styles.stepContent}>
                    <h3>Expédition</h3>
                    <p>Livraison sous 5-7 jours ouvrés avec suivi de colis</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.supportInfo}>
              <h3 className={styles.supportTitle}>Besoin d'aide ?</h3>
              <p className={styles.supportText}>
                Notre équipe de service client est disponible du lundi au vendredi de 9h à 18h.
              </p>
              <div className={styles.supportContacts}>
                <a href="mailto:contact@kambalahins.com" className={styles.supportLink}>
                  contact@kambalahins.com
                </a>
                <a href="tel:+33123456789" className={styles.supportLink}>
                  +33 1 23 45 67 89
                </a>
              </div>
            </div>

            <div className={styles.actions}>
              <Link href="/" className={styles.continueButton}>
                Continuer mes achats
              </Link>
              
              <button 
                onClick={() => window.print()} 
                className={styles.printButton}
              >
                Imprimer cette page
              </button>
            </div>

            <div className={styles.socialShare}>
              <p className={styles.shareText}>Partagez votre style KAMBA LHAINS</p>
              <div className={styles.socialButtons}>
                <a 
                  href="https://www.instagram.com/kambalahins" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialButton}
                >
                  Instagram
                </a>
                <a 
                  href="https://www.facebook.com/kambalahins" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialButton}
                >
                  Facebook
                </a>
              </div>
              <p className={styles.hashtag}>#KAMBALAHINS</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}