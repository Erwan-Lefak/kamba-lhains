import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Paiements() {
  return (
    <>
      <Head>
        <title>Paiements - Kamba Lhains</title>
        <meta name="description" content="Moyens de paiement sécurisés Kamba Lhains - Carte bancaire, Apple Pay, Google Pay. Transactions protégées par Stripe." />
      </Head>
      <Header />
      <main style={{ minHeight: '100vh', padding: 'calc(var(--header-height) + 20px) 0 50px', fontFamily: 'Manrope, sans-serif' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontSize: '11px', fontWeight: '400', color: '#000', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Manrope, sans-serif' }}>
              MOYENS DE PAIEMENT
            </h1>
            <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
              Payez en toute sécurité avec nos solutions de paiement modernes et sécurisées. 
              Toutes vos transactions sont protégées par la technologie Stripe.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '50px' }}>
            <div style={{ backgroundColor: 'white', padding: '30px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                CARTE BANCAIRE
              </h2>
              <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                Visa, Mastercard, American Express. Paiement sécurisé avec authentification 3D Secure.
              </p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '30px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                APPLE PAY
              </h2>
              <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                Paiement rapide et sécurisé avec Touch ID, Face ID ou votre code d'accès.
              </p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '30px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                GOOGLE PAY
              </h2>
              <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                Payez facilement avec votre compte Google en un clic sur tous vos appareils.
              </p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '30px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                KLARNA
              </h2>
              <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                Payez en 3 ou 4 fois sans frais. Solution de paiement flexible et sécurisée.
              </p>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '40px', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '25px', textAlign: 'center' }}>
              SÉCURITÉ & PROTECTION
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              <div>
                <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                  CHIFFREMENT SSL
                </h3>
                <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                  <p style={{ marginBottom: '10px' }}>• Connexion sécurisée HTTPS pour tous les paiements</p>
                  <p style={{ marginBottom: '10px' }}>• Chiffrement des données bancaires</p>
                  <p>• Certificat SSL vérifié et à jour</p>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                  STRIPE SECURE
                </h3>
                <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                  <p style={{ marginBottom: '10px' }}>• Plateforme de paiement certifiée PCI DSS</p>
                  <p style={{ marginBottom: '10px' }}>• Détection automatique des fraudes</p>
                  <p>• Conformité aux normes bancaires européennes</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '30px', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '20px', textAlign: 'center' }}>
              INFORMATIONS IMPORTANTES
            </h2>
            
            <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.8' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '10px' }}>
                  DEVISE ET PRIX
                </h3>
                <p>Tous nos prix sont affichés en euros (EUR) toutes taxes comprises. Aucun frais supplémentaire ne sera ajouté lors du paiement.</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '10px' }}>
                  ENCAISSEMENT
                </h3>
                <p>Votre carte sera débitée immédiatement après validation de votre commande. Vous recevrez une confirmation par email avec tous les détails de votre achat.</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '10px' }}>
                  AUTHENTIFICATION 3D SECURE
                </h3>
                <p>Pour votre sécurité, votre banque peut vous demander de confirmer votre identité lors du paiement (SMS, application bancaire, ou code secret).</p>
              </div>

              <div>
                <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '10px' }}>
                  VOS DONNÉES
                </h3>
                <p>Kamba Lhains ne stocke aucune information bancaire. Toutes les données de paiement sont sécurisées et traitées directement par Stripe.</p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '40px', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '25px', textAlign: 'center' }}>
              PROCESSUS DE PAIEMENT
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{ 
                  backgroundColor: '#333', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '20px', 
                  height: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '10px',
                  fontWeight: '500',
                  flexShrink: 0
                }}>
                  1
                </div>
                <div>
                  <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '5px' }}>
                    AJOUTEZ VOS PRODUITS AU PANIER
                  </h3>
                  <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6', margin: 0 }}>
                    Sélectionnez vos articles, tailles et quantités. Vérifiez votre commande avant de procéder au paiement.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{ 
                  backgroundColor: '#333', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '20px', 
                  height: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '10px',
                  fontWeight: '500',
                  flexShrink: 0
                }}>
                  2
                </div>
                <div>
                  <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '5px' }}>
                    RENSEIGNEZ VOS INFORMATIONS
                  </h3>
                  <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6', margin: 0 }}>
                    Saisissez vos coordonnées de livraison et de facturation. Toutes les informations sont sécurisées.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{ 
                  backgroundColor: '#333', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '20px', 
                  height: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '10px',
                  fontWeight: '500',
                  flexShrink: 0
                }}>
                  3
                </div>
                <div>
                  <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '5px' }}>
                    CHOISISSEZ VOTRE MOYEN DE PAIEMENT
                  </h3>
                  <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6', margin: 0 }}>
                    Sélectionnez carte bancaire, Apple Pay ou Google Pay selon votre préférence.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <div style={{ 
                  backgroundColor: '#333', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '20px', 
                  height: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '10px',
                  fontWeight: '500',
                  flexShrink: 0
                }}>
                  4
                </div>
                <div>
                  <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '5px' }}>
                    CONFIRMEZ VOTRE COMMANDE
                  </h3>
                  <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6', margin: 0 }}>
                    Validez votre paiement. Vous recevrez immédiatement une confirmation par email avec votre numéro de commande.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '30px', textAlign: 'center' }}>
            <button
              onClick={() => window.location.href = '/contact'}
              className="contact-button"
              style={{
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                fontSize: '9px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                fontFamily: 'Manrope, sans-serif',
                marginTop: '20px',
                transition: 'all 0.3s ease'
              }}
            >
              NOUS CONTACTER
            </button>
          </div>

          <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #eee', fontSize: '10px', color: '#666', lineHeight: '1.6', textAlign: 'center' }}>
            <p style={{ marginBottom: '10px' }}>
              <strong>Powered by Stripe</strong> - Leader mondial des solutions de paiement sécurisées
            </p>
            <p>
              Vos informations bancaires sont protégées par le plus haut niveau de sécurité. 
              Aucune donnée de paiement n'est stockée sur nos serveurs.
            </p>
          </div>
        </div>
      </main>

      <style jsx>{`
        .contact-button:hover {
          background: #333 !important;
        }

        @media (max-width: 768px) {
          main {
            padding: 40px 15px !important;
          }

          .grid {
            grid-template-columns: 1fr !important;
          }

          .flex {
            flex-direction: column !important;
            gap: 10px !important;
          }
        }
      `}</style>
      <Footer />
    </>
  );
}