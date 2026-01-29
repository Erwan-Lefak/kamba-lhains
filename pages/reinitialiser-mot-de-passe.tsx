import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/Auth.module.css';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const { t } = useLanguage();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  // Vérifier le token au chargement
  useEffect(() => {
    if (token && typeof token === 'string') {
      verifyToken(token);
    } else if (router.isReady && !token) {
      setIsVerifying(false);
      setErrors({ token: 'Token manquant' });
    }
  }, [token, router.isReady]);

  const verifyToken = async (tokenValue: string) => {
    try {
      const response = await fetch(`/api/auth/reset-password?token=${tokenValue}`);
      const result = await response.json();

      if (result.valid) {
        setTokenValid(true);
      } else {
        setErrors({ token: result.error || 'Le lien de réinitialisation est invalide ou a expiré' });
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      setErrors({ token: 'Une erreur est survenue lors de la vérification du lien' });
    } finally {
      setIsVerifying(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setErrors({ submit: result.message || 'Une erreur est survenue' });
        return;
      }

      // Succès
      setSuccess(true);

      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        router.push('/connexion');
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  // État de chargement
  if (isVerifying) {
    return (
      <>
        <Head>
          <title>Réinitialisation du mot de passe - Kamba Lhains</title>
        </Head>

        <Header />

        <main className={styles.authPage}>
          <div className={styles.authContainer}>
            <div className={styles.authCard}>
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
                <p style={{ color: '#666' }}>Vérification du lien...</p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // Token invalide
  if (errors.token) {
    return (
      <>
        <Head>
          <title>Lien invalide - Kamba Lhains</title>
        </Head>

        <Header />

        <main className={styles.authPage}>
          <div className={styles.authContainer}>
            <div className={styles.authCard}>
              <div className={styles.authHeader}>
                <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '48px' }}>
                  ⚠️
                </div>
                <h1 className={styles.authTitle}>Lien invalide ou expiré</h1>
                <p className={styles.authSubtitle}>
                  {errors.token}
                </p>
              </div>

              <div style={{ padding: '0 20px' }}>
                <p style={{ color: '#666', marginBottom: '25px', lineHeight: '1.6' }}>
                  Le lien de réinitialisation est peut-être expiré (valable 1 heure) ou a déjà été utilisé.
                </p>

                <Link href="/mot-de-passe-oublie">
                  <button
                    type="button"
                    className={styles.submitButton}
                  >
                    Demander un nouveau lien
                  </button>
                </Link>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Link href="/connexion">
                    <span style={{ color: '#666', fontSize: '14px', cursor: 'pointer' }}>
                      Retour à la connexion
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // Succès
  if (success) {
    return (
      <>
        <Head>
          <title>Mot de passe réinitialisé - Kamba Lhains</title>
        </Head>

        <Header />

        <main className={styles.authPage}>
          <div className={styles.authContainer}>
            <div className={styles.authCard}>
              <div className={styles.authHeader}>
                <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '48px' }}>
                  ✅
                </div>
                <h1 className={styles.authTitle}>Mot de passe réinitialisé !</h1>
                <p className={styles.authSubtitle}>
                  Votre mot de passe a été modifié avec succès
                </p>
              </div>

              <div style={{ padding: '0 20px' }}>
                <p style={{ color: '#666', marginBottom: '25px', lineHeight: '1.6', textAlign: 'center' }}>
                  Vous allez être redirigé vers la page de connexion dans quelques instants...
                </p>

                <Link href="/connexion">
                  <button
                    type="button"
                    className={styles.submitButton}
                  >
                    Se connecter maintenant
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

  // Formulaire de réinitialisation
  return (
    <>
      <Head>
        <title>Nouveau mot de passe - Kamba Lhains</title>
        <meta name="description" content="Créez votre nouveau mot de passe" />
      </Head>

      <Header />

      <main className={styles.authPage}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <h1 className={styles.authTitle}>Nouveau mot de passe</h1>
              <p className={styles.authSubtitle}>
                Créez un mot de passe sécurisé pour votre compte
              </p>
            </div>

            <form className={styles.authForm} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Nouveau mot de passe</label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors(prev => ({ ...prev, password: '' }));
                      }
                    }}
                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                    placeholder="Minimum 6 caractères"
                    autoComplete="new-password"
                    autoFocus
                  />
                  <button
                    type="button"
                    className={styles.togglePasswordButton}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <span className={styles.error}>{errors.password}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Confirmer le mot de passe</label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) {
                        setErrors(prev => ({ ...prev, confirmPassword: '' }));
                      }
                    }}
                    className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                    placeholder="Confirmez votre mot de passe"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={styles.togglePasswordButton}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
              </div>

              {errors.submit && (
                <div className={styles.submitError}>{errors.submit}</div>
              )}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link href="/connexion">
                <span style={{ color: '#666', fontSize: '14px', cursor: 'pointer' }}>
                  Retour à la connexion
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
