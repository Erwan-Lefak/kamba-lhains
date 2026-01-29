import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/Auth.module.css';

export default function Auth() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = t('auth.emailRequired');
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t('auth.emailInvalid');
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired');
    } else if (!isLogin) {
      // Validation stricte pour l'inscription
      const hasUppercase = /[A-Z]/.test(formData.password);
      const hasLowercase = /[a-z]/.test(formData.password);
      const hasNumber = /[0-9]/.test(formData.password);
      const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

      if (formData.password.length < 8) {
        newErrors.password = t('auth.passwordMinLength8');
      } else if (!hasUppercase || !hasLowercase || !hasNumber || !hasSymbol) {
        newErrors.password = t('auth.passwordComplexity');
      }
    } else if (formData.password.length < 6) {
      // Validation simple pour la connexion
      newErrors.password = t('auth.passwordMinLength');
    }

    // Registration specific validations
    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = t('auth.firstNameRequired');
      }
      if (!formData.lastName) {
        newErrors.lastName = t('auth.lastNameRequired');
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = t('auth.confirmPasswordRequired');
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('auth.passwordsNotMatch');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        // LOGIN avec NextAuth
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setErrors({ submit: result.error });
          return;
        }

        if (result?.ok) {
          console.log('✅ Connexion réussie');
          router.push('/compte');
        }
      } else {
        // REGISTRATION
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          setErrors({ submit: result.message });
          return;
        }

        console.log('✅ Inscription réussie:', result);
        // L'email de bienvenue est envoyé automatiquement par l'API

        // Connecter automatiquement l'utilisateur après l'inscription
        const loginResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (loginResult?.ok) {
          router.push('/compte');
        } else {
          // En cas d'erreur de connexion après inscription, rediriger vers connexion
          setErrors({ submit: t('auth.registeredPleaseLogin') });
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error('❌ Auth error:', error);
      setErrors({ submit: t('auth.genericError') });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <>
      <Head>
        <title>{`${isLogin ? t('auth.login') : t('auth.register')} - Kamba Lhains`}</title>
        <meta name="description" content={`${isLogin ? t('auth.login') : t('auth.register')} Kamba Lhains`} />
      </Head>

      <Header />

      <main className={styles.authPage}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <h1 className={styles.authTitle}>
                {isLogin ? t('auth.login') : t('auth.createAccount')}
              </h1>
              <p className={styles.authSubtitle}>
                {isLogin
                  ? t('auth.loginSubtitle')
                  : t('auth.registerSubtitle')
                }
              </p>
            </div>

            <form className={styles.authForm} onSubmit={handleSubmit}>
              {!isLogin && (
                <div className={styles.nameFields}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>{t('auth.firstName')}</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                      placeholder={t('auth.firstNamePlaceholder')}
                    />
                    {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>{t('auth.lastName')}</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                      placeholder={t('auth.lastNamePlaceholder')}
                    />
                    {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                  </div>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.label}>{t('auth.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder={t('auth.emailPlaceholder')}
                />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>{t('auth.password')}</label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                    placeholder={t('auth.passwordPlaceholder')}
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

              {!isLogin && (
                <div className={styles.inputGroup}>
                  <label className={styles.label}>{t('auth.confirmPassword')}</label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                      placeholder={t('auth.confirmPasswordPlaceholder')}
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
              )}

              {errors.submit && (
                <div className={styles.submitError}>{errors.submit}</div>
              )}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? t('auth.processing') : (isLogin ? t('auth.loginButton') : t('auth.registerButton'))}
              </button>
            </form>

            {isLogin && (
              <div className={styles.forgotPassword}>
                <Link href="/mot-de-passe-oublie">{t('auth.forgotPassword')}</Link>
              </div>
            )}

            <div className={styles.authToggle}>
              <span>
                {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
              </span>
              <button
                type="button"
                className={styles.toggleButton}
                onClick={toggleMode}
              >
                {isLogin ? t('auth.createAccount') : t('auth.loginButton')}
              </button>
            </div>

            <div className={styles.divider}>
              <span>{t('auth.or')}</span>
            </div>

            <div className={styles.socialLogin}>
              <button
                className={styles.socialButton}
                onClick={() => signIn('google', { callbackUrl: '/compte' })}
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>{t('auth.continueWithGoogle')}</span>
              </button>

              <button
                className={styles.socialButton}
                onClick={() => signIn('facebook', { callbackUrl: '/compte' })}
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>{t('auth.continueWithFacebook')}</span>
              </button>

              <button
                className={styles.socialButton}
                onClick={() => signIn('apple', { callbackUrl: '/compte' })}
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span>{t('auth.continueWithApple')}</span>
              </button>
            </div>

            <div className={styles.authFooter}>
              <p>
                {t('auth.termsAcceptance')}{' '}
                <Link href="/conditions">{t('auth.termsOfUse')}</Link> {t('auth.and')}{' '}
                <Link href="/confidentialite">{t('auth.privacyPolicy')}</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
