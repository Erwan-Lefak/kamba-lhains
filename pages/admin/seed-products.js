import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/AdminLogin.module.css';

export default function SeedProducts() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const importProducts = async () => {
    const confirmed = confirm(
      'Êtes-vous sûr de vouloir importer tous les produits du site (sauf les sacs) dans la base de données Prisma ? ' +
      'Cette opération peut prendre quelques minutes.'
    );

    if (!confirmed) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/seed-products', {
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
        setError(data.message || 'Erreur lors de l\'importation des produits');
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
        <title>Importer les produits - Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={styles.loginPage}>
        <div className={styles.loginContainer}>
          <div className={styles.loginHeader}>
            <h1 className={styles.title}>Importer les produits</h1>
            <p className={styles.subtitle}>Importer tous les produits du site dans Prisma</p>
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
                  <div><strong>Importés :</strong> {result.imported}</div>
                  <div><strong>Ignorés :</strong> {result.skipped}</div>
                </div>
                {result.details && result.details.imported && (
                  <div style={{ marginTop: '15px' }}>
                    <strong>Produits importés :</strong>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '5px' }}>
                      {result.details.imported.map((name, i) => (
                        <div key={i} style={{ fontSize: '11px', marginTop: '3px' }}>
                          • {name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {result.details && result.details.skipped && result.details.skipped.length > 0 && (
                  <div style={{ marginTop: '15px', color: '#b91c1c' }}>
                    <strong>Produits ignorés/erreurs :</strong>
                    <div style={{ maxHeight: '100px', overflowY: 'auto', marginTop: '5px' }}>
                      {result.details.skipped.map((item, i) => (
                        <div key={i} style={{ fontSize: '11px', marginTop: '3px' }}>
                          • {item.name}: {item.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={importProducts}
              className={styles.submitButton}
              disabled={isLoading}
              style={{ marginBottom: '15px' }}
            >
              {isLoading ? 'Import en cours...' : 'Importer tous les produits'}
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
              <h3 style={{ fontSize: '13px', marginBottom: '10px' }}>ℹ️ Informations :</h3>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                <li>Importe tous les produits du fichier data/products.ts</li>
                <li>Exclut automatiquement les sacs comme demandé</li>
                <li>Crée les variantes (couleurs × tailles) pour chaque produit</li>
                <li>Stock par défaut : 10 unités par variante (0 si rupture)</li>
                <li>Les produits existants ne seront PAS dupliqués (erreur si déjà présent)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
