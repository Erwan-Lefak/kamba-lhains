import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CarteCadeau() {
  return (
    <>
      <Head>
        <title>Carte cadeau - Kamba Lhains</title>
        <meta name="description" content="Offrez une carte cadeau Kamba Lhains - Le cadeau parfait pour les amateurs de mode." />
      </Head>
      <Header />
      <main style={{ padding: '60px 20px', fontFamily: 'Manrope, sans-serif' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontSize: '11px', fontWeight: '400', color: '#333', marginBottom: '20px' }}>
              CARTE CADEAU KAMBA LHAINS
            </h1>
            <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto' }}>
              Offrez le plaisir du choix avec nos cartes cadeaux. Le cadeau parfait pour faire plaisir 
              à vos proches en leur permettant de découvrir nos collections.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '50px' }}>
            <div style={{ backgroundColor: '#f8f8f8', padding: '30px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '20px' }}>
                COMMENT ÇA MARCHE
              </h2>
              <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: '500', marginRight: '10px', color: '#333' }}>1.</span>
                  <span>Contactez notre service client pour commander votre carte cadeau</span>
                </div>
                <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: '500', marginRight: '10px', color: '#333' }}>2.</span>
                  <span>Choisissez le montant et personnalisez votre message</span>
                </div>
                <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: '500', marginRight: '10px', color: '#333' }}>3.</span>
                  <span>Recevez votre code cadeau par email ou par courrier</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: '500', marginRight: '10px', color: '#333' }}>4.</span>
                  <span>Le bénéficiaire utilise le code lors de sa commande</span>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#f8f8f8', padding: '30px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '20px' }}>
                INFORMATIONS PRATIQUES
              </h2>
              <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontWeight: '500', color: '#333' }}>Validité :</span> 12 mois à compter de la date d'achat
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontWeight: '500', color: '#333' }}>Montant :</span> Libre à partir de 25€
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontWeight: '500', color: '#333' }}>Utilisation :</span> En une ou plusieurs fois
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontWeight: '500', color: '#333' }}>Cumul :</span> Cumulable avec les promotions
                </div>
                <div>
                  <span style={{ fontWeight: '500', color: '#333' }}>Livraison :</span> Gratuite par email, 5€ par courrier
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '40px', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '25px', textAlign: 'center' }}>
              CONDITIONS D'UTILISATION
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
              <div>
                <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                  VALIDITÉ ET UTILISATION
                </h3>
                <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                  <p style={{ marginBottom: '10px' }}>• Valable 12 mois à compter de la date d'émission</p>
                  <p style={{ marginBottom: '10px' }}>• Utilisable uniquement sur kambalhains.com</p>
                  <p style={{ marginBottom: '10px' }}>• Non remboursable et non échangeable contre des espèces</p>
                  <p>• En cas de perte, la carte ne peut être remplacée</p>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                  FONCTIONNEMENT
                </h3>
                <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                  <p style={{ marginBottom: '10px' }}>• Le montant peut être utilisé en plusieurs fois</p>
                  <p style={{ marginBottom: '10px' }}>• Si la commande dépasse le montant, le solde reste à payer</p>
                  <p style={{ marginBottom: '10px' }}>• Si la commande est inférieure, le solde reste disponible</p>
                  <p>• Consultation du solde disponible sur demande</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#f8f8f8', padding: '30px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '20px' }}>
              COMMANDER UNE CARTE CADEAU
            </h2>
            <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6', marginBottom: '25px' }}>
              Pour commander une carte cadeau, contactez notre service client. Nous vous accompagnerons 
              dans votre choix et personnaliserons votre cadeau.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div>
                <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '10px' }}>
                  PAR TÉLÉPHONE
                </h3>
                <p style={{ fontSize: '11px', color: '#666' }}>+33 (0) 1 58 30 03 84</p>
                <p style={{ fontSize: '10px', color: '#999' }}>
                  Lun-Ven 10h-13h et 14h-21h<br />
                  Samedi 10h-13h et 14h-18h CET
                </p>
              </div>
              
              <div>
                <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '10px' }}>
                  PAR EMAIL
                </h3>
                <p style={{ fontSize: '11px', color: '#666' }}>info@kambalahains.net</p>
                <p style={{ fontSize: '10px', color: '#999' }}>
                  Réponse sous 24h<br />
                  du lundi au samedi
                </p>
              </div>
            </div>

            <button 
              onClick={() => window.location.href = '/contact'}
              style={{
                backgroundColor: '#333',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                fontSize: '11px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                fontFamily: 'Manrope, sans-serif',
                transition: 'background-color 0.3s ease'
              }}
            >
              NOUS CONTACTER
            </button>
          </div>

          <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
              QUESTIONS FRÉQUENTES
            </h3>
            
            <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontWeight: '500', color: '#333', marginBottom: '5px' }}>
                  Puis-je utiliser plusieurs cartes cadeaux pour une même commande ?
                </p>
                <p>Oui, vous pouvez cumuler plusieurs cartes cadeaux lors de votre commande.</p>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontWeight: '500', color: '#333', marginBottom: '5px' }}>
                  La carte cadeau est-elle cumulable avec les promotions ?
                </p>
                <p>Oui, les cartes cadeaux sont cumulables avec toutes nos offres promotionnelles.</p>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontWeight: '500', color: '#333', marginBottom: '5px' }}>
                  Que se passe-t-il si je retourne un article acheté avec une carte cadeau ?
                </p>
                <p>Le remboursement sera effectué sous forme de nouvelle carte cadeau du montant correspondant.</p>
              </div>
              
              <div>
                <p style={{ fontWeight: '500', color: '#333', marginBottom: '5px' }}>
                  Comment vérifier le solde de ma carte cadeau ?
                </p>
                <p>Contactez notre service client avec votre code de carte cadeau pour connaître le solde disponible.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @media (max-width: 768px) {
          main {
            padding: 40px 15px !important;
          }
          
          h1 {
            font-size: 11px !important;
          }
          
          .grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
      <Footer />
    </>
  );
}