import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Auth.module.css';

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
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
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    // Registration specific validations
    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = 'Le prénom est requis';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Le nom est requis';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmez votre mot de passe';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isLogin) {
        // Simulate login success
        console.log('Login successful', formData.email);
        router.push('/');
      } else {
        // Simulate registration success
        console.log('Registration successful', formData);
        router.push('/');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' });
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
        <title>{isLogin ? 'Connexion' : 'Inscription'} - Kamba Lhains</title>
        <meta name="description" content={`${isLogin ? 'Connectez-vous' : 'Inscrivez-vous'} à votre compte Kamba Lhains`} />
      </Head>

      <Header />

      <main className={styles.authPage}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <h1 className={styles.authTitle}>
                {isLogin ? 'Connexion' : 'Créer un compte'}
              </h1>
              <p className={styles.authSubtitle}>
                {isLogin 
                  ? 'Accédez à votre espace personnel KAMBA LHAINS' 
                  : 'Rejoignez la communauté KAMBA LHAINS'
                }
              </p>
            </div>

            <form className={styles.authForm} onSubmit={handleSubmit}>
              {!isLogin && (
                <div className={styles.nameFields}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Prénom</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                      placeholder="Votre prénom"
                    />
                    {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Nom</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                      placeholder="Votre nom"
                    />
                    {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                  </div>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder="votre@email.com"
                />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  placeholder="••••••••"
                />
                {errors.password && <span className={styles.error}>{errors.password}</span>}
              </div>

              {!isLogin && (
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Confirmer le mot de passe</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                    placeholder="••••••••"
                  />
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
                {isLoading ? 'Traitement...' : (isLogin ? 'Se connecter' : 'Créer mon compte')}
              </button>
            </form>

            {isLogin && (
              <div className={styles.forgotPassword}>
                <Link href="/mot-de-passe-oublie">Mot de passe oublié ?</Link>
              </div>
            )}

            <div className={styles.authToggle}>
              <span>
                {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
              </span>
              <button 
                type="button"
                className={styles.toggleButton}
                onClick={toggleMode}
              >
                {isLogin ? 'Créer un compte' : 'Se connecter'}
              </button>
            </div>

            <div className={styles.divider}>
              <span>ou</span>
            </div>

            <div className={styles.socialLogin}>
              <button 
                className={styles.socialButton}
                onClick={() => signIn('google', { callbackUrl: '/' })}
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continuer avec Google</span>
              </button>
              
              <button 
                className={styles.socialButton}
                onClick={() => signIn('facebook', { callbackUrl: '/' })}
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Continuer avec Facebook</span>
              </button>
              
              <button 
                className={styles.socialButton}
                onClick={() => signIn('apple', { callbackUrl: '/' })}
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span>Continuer avec Apple</span>
              </button>
            </div>

            <div className={styles.authFooter}>
              <p>
                En continuant, vous acceptez nos{' '}
                <Link href="/conditions">Conditions d'utilisation</Link> et notre{' '}
                <Link href="/confidentialite">Politique de confidentialité</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}