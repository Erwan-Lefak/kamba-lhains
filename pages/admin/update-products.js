import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/AdminLogin.module.css';

export default function UpdateProducts() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const updateProducts = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/update-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminKey: prompt('Entrez le mot de passe admin:')
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || 'Erreur lors de la mise à jour des produits');
      }
    } catch (err) {
      setError('Erreur de connexion: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Activer les produits - Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={styles.loginPage}>
        <div className={styles.loginContainer}>
          <div className={styles.loginHeader}>
            <h1 className={styles.title}>Activer tous les produits</h1>
            <p className={styles.subtitle}>Active tous les produits et met leur stock à 10</p>
          </div>

          <div className={styles.loginForm}>
            {error && (
              <div style={{
                padding: '15px',
                background: '#fee2e2',
                color: '#991b1b',
                borderRadius: '4px',
                marginBottom: '20px',
                fontSize: '12px'
              }}>
                {error}
              </div>
            )}

            {result && (
              <div style={{
                padding: '15px',
                background: '#d1fae5',
                color: '#065f46',
                borderRadius: '4px',
                marginBottom: '20px',
                fontSize: '12px',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <strong>Succès !</strong> {result.message}
                <div style={{ marginTop: '10px' }}>
                  <div><strong>Produits mis à jour :</strong> {result.updated}</div>
                </div>
                {result.details && result.details.length > 0 && (
                  <div style={{ marginTop: '15px' }}>
                    <strong>Détails :</strong>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '5px' }}>
                      {result.details.map((item, i) => (
                        <div key={i} style={{ fontSize: '11px', marginTop: '3px' }}>
                          • {item.name} - Stock variantes mis à jour : {item.variantsUpdated}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={updateProducts}
              className={styles.submitButton}
              disabled={isLoading}
              style={{ marginBottom: '15px' }}
            >
              {isLoading ? 'Mise à jour en cours...' : 'Activer tous les produits'}
            </button>

            <Link
              href="/admin/dashboard"
              className={styles.submitButton}
              style={{
                display: 'block',
                textAlign: 'center',
                textDecoration: 'none',
                background: '#6b7280',
                marginTop: '10px'
              }}
            >
              Retour au Dashboard
            </Link>

            <div style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
              <h3 style={{ fontSize: '13px', marginBottom: '10px' }}>ℹ️ Ce que fait cette action :</h3>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                <li>Active TOUS les produits (isActive = true)</li>
                <li>Met le stock de toutes les variantes à 0 → 10 unités</li>
                <li>Rend la veste et la jupe visibles dans le dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
