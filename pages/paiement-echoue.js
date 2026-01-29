import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Auth.module.css';

export default function PaymentFailed() {
  const router = useRouter();
  const { payment_intent, error } = router.query;

  return (
    <>
      <Head>
        <title>Paiement échoué - Kamba Lhains</title>
        <meta name="description" content="Votre paiement a échoué" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Header />

      <main className={styles.authPage}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <h1 className={styles.authTitle}>
                Paiement échoué
              </h1>
              <div style={{ fontSize: '60px', color: '#ef4444', marginBottom: '20px', fontWeight: '300' }}>✕</div>
              <p className={styles.authSubtitle}>
                Nous n'avons pas pu traiter votre paiement. Veuillez réessayer.
              </p>
            </div>

            <div className={styles.authForm}>
              {error && (
                <div style={{
                  padding: '15px',
                  background: '#fee2e2',
                  borderRadius: '4px',
                  marginBottom: '25px'
                }}>
                  <p style={{ fontSize: '12px', color: '#991b1b', margin: 0 }}>
                    <strong>Erreur :</strong> {decodeURIComponent(error)}
                  </p>
                </div>
              )}

              <div style={{ marginTop: '20px', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '15px', color: '#000' }}>
                  Raisons possibles
                </h2>
                <ul style={{ fontSize: '12px', color: '#666', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
                  <li>Fonds insuffisants sur votre compte</li>
                  <li>Informations de carte incorrectes</li>
                  <li>Carte expirée ou bloquée</li>
                  <li>Limite de dépense atteinte</li>
                  <li>Problème technique temporaire</li>
                </ul>
              </div>

              <div style={{
                padding: '15px',
                background: '#f8f8f8',
                borderRadius: '4px',
                marginBottom: '25px'
              }}>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                  💡 <strong>Conseil :</strong> Vérifiez vos informations bancaires ou essayez un autre moyen de paiement.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link
                  href="/checkout"
                  className={styles.submitButton}
                  style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
                >
                  Réessayer avec un autre moyen de paiement
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
                  Modifier mon panier
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
                  Retour à l'accueil
                </Link>
              </div>
            </div>

            <div className={styles.authFooter}>
              <p>
                Problème persistant ?{' '}
                <Link href="/contact">Contactez notre support</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
