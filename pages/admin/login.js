import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../../styles/AdminLogin.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminAuth', 'true');
        router.push('/admin/dashboard');
      } else {
        setError('Identifiants invalides');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Connexion Admin - Kamba Lhains</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={styles.loginPage}>
        <div className={styles.loginContainer}>
          <div className={styles.loginHeader}>
            <h1 className={styles.title}>Administration</h1>
            <p className={styles.subtitle}>Accès réservé aux administrateurs</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <div className={styles.inputGroup}>
              <input
                type="email"
                name="email"
                placeholder="Email administrateur"
                value={credentials.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={credentials.password}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className={styles.loginFooter}>
            <p className={styles.securityNote}>
              Connexion sécurisée - Tous les accès sont enregistrés
            </p>
          </div>
        </div>
      </div>
    </>
  );
}