import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/AdminLogin.module.css';

export default function TestDataGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const generateTestData = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/seed-test-data', {
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
        setError(data.message || 'Erreur lors de la génération des données');
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
        <title>Générateur de données de test - Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={styles.loginPage}>
        <div className={styles.loginContainer}>
          <div className={styles.loginHeader}>
            <h1 className={styles.title}>Générateur de données de test</h1>
            <p className={styles.subtitle}>Créer des commandes de test pour le dashboard</p>
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
                fontSize: '12px'
              }}>
                <strong>Succès !</strong> {result.message}
                <div style={{ marginTop: '10px' }}>
                  <div><strong>Utilisateurs créés :</strong> {result.users || 0}</div>
                  <div><strong>Commandes créées :</strong> {result.orders?.length || 0}</div>
                </div>
                {result.orders && (
                  <div style={{ marginTop: '15px', maxHeight: '200px', overflowY: 'auto' }}>
                    <strong>Commandes :</strong>
                    {result.orders.map((order, i) => (
                      <div key={i} style={{ fontSize: '11px', marginTop: '5px' }}>
                        • {order.orderNumber} - {order.status} - {order.totalAmount}€
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={generateTestData}
              className={styles.submitButton}
              disabled={isLoading}
              style={{ marginBottom: '15px' }}
            >
              {isLoading ? 'Génération en cours...' : 'Générer 10 commandes de test'}
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
              <h3 style={{ fontSize: '13px', marginBottom: '10px' }}>ℹ️ Ce qui sera créé :</h3>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                <li><strong>10 utilisateurs</strong> avec profils (Jean Dupont, Marie Martin, etc.)</li>
                <li><strong>10 commandes</strong> liées à ces utilisateurs</li>
                <li>Statuts variés : En attente, Payé, En traitement, Expédié, Livré</li>
                <li>Les profils clients seront mis à jour avec le nombre de commandes et lifetime value</li>
                <li>Les clients apparaîtront dans l'onglet "Clients" du dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
