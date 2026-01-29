import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/Auth.module.css';

export default function ForgotPassword() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Veuillez entrer votre adresse email');
      setIsLoading(false);
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Format d\'email invalide');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.message || 'Une erreur est survenue');
        return;
      }

      // Afficher le message de succès
      setSuccess(true);
    } catch (error) {
      console.error('Error:', error);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Head>
          <title>Email envoyé - Kamba Lhains</title>
          <meta name="description" content="Email de réinitialisation envoyé" />
        </Head>

        <Header />

        <main className={styles.authPage}>
          <div className={styles.authContainer}>
            <div className={styles.authCard}>
              <div className={styles.authHeader}>
                <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '48px' }}>
                  ✅
                </div>
                <h1 className={styles.authTitle}>Email envoyé</h1>
                <p className={styles.authSubtitle}>
                  Consultez votre boîte de réception
                </p>
              </div>

              <div style={{ padding: '0 20px' }}>
                <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.6' }}>
                  Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un email contenant un lien pour réinitialiser votre mot de passe.
                </p>

                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
                  <p style={{ margin: '0', color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                    <strong>💡 Conseil :</strong> Vérifiez également votre dossier spam ou courrier indésirable.
                  </p>
                </div>

                <p style={{ color: '#666', fontSize: '14px', marginBottom: '25px' }}>
                  Le lien de réinitialisation est valable pendant 1 heure.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <Link href="/connexion">
                    <button
                      type="button"
                      className={styles.submitButton}
                    >
                      Retour à la connexion
                    </button>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    style={{
                      background: 'transparent',
                      border: '1px solid #e0e0e0',
                      color: '#666',
                      padding: '12px 24px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Renvoyer un email
                  </button>
                </div>
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
        <title>Mot de passe oublié - Kamba Lhains</title>
        <meta name="description" content="Réinitialisez votre mot de passe" />
      </Head>

      <Header />

      <main className={styles.authPage}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <h1 className={styles.authTitle}>Mot de passe oublié ?</h1>
              <p className={styles.authSubtitle}>
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
            </div>

            <form className={styles.authForm} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Adresse email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${styles.input} ${error ? styles.inputError : ''}`}
                  placeholder="votre@email.com"
                  autoComplete="email"
                  autoFocus
                />
                {error && <span className={styles.error}>{error}</span>}
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
              </button>
            </form>

            <div className={styles.authToggle}>
              <span>Vous vous souvenez de votre mot de passe ?</span>
              <Link href="/connexion">
                <button
                  type="button"
                  className={styles.toggleButton}
                >
                  Se connecter
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
