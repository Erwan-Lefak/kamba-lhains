import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Auth.module.css';

export default function PaymentCancelled() {
  const router = useRouter();
  const { payment_intent } = router.query;

  return (
    <>
      <Head>
        <title>Paiement annulé - Kamba Lhains</title>
        <meta name="description" content="Votre paiement a été annulé" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Header />

      <main className={styles.authPage}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <h1 className={styles.authTitle}>
                Paiement annulé
              </h1>
              <div style={{ fontSize: '60px', color: '#f59e0b', marginBottom: '20px', fontWeight: '300' }}>⚠</div>
              <p className={styles.authSubtitle}>
                Votre paiement a été annulé. Votre panier a été conservé.
              </p>
            </div>

            <div className={styles.authForm}>
              <div style={{ marginTop: '20px', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '15px', color: '#000' }}>
                  Que s'est-il passé ?
                </h2>
                <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.6' }}>
                  Vous avez annulé le processus de paiement ou la transaction n'a pas pu être finalisée.
                  Vos articles sont toujours dans votre panier et vous pouvez réessayer à tout moment.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link
                  href="/checkout"
                  className={styles.submitButton}
                  style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
                >
                  Réessayer le paiement
                </Link>

                <Link
                  href="/panier"
                  style={{
                    textDecoration: 'none',
                    display: 'block',
                    textAlign: 'center',
                    padding: '12px 24px',
                    border: '1px solid #000',
                    color: '#000',
                    fontSize: '12px',
                    fontWeight: '500',
                    borderRadius: '2px',
                    transition: 'all 0.2s'
                  }}
                >
                  Voir mon panier
                </Link>

                <Link
                  href="/"
                  style={{
                    textDecoration: 'none',
                    display: 'block',
                    textAlign: 'center',
                    padding: '12px 24px',
                    color: '#666',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  Continuer mes achats
                </Link>
              </div>
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
