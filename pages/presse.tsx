import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Presse() {
  return (
    <>
      <Head>
        <title>Presse - Kamba Lhains</title>
        <meta name="description" content="Espace presse Kamba Lhains - Communiqués, visuels haute définition et contact presse pour journalistes et influenceurs." />
      </Head>
      <Header />
      <main style={{ minHeight: '100vh', padding: 'calc(var(--header-height) + 20px) 0 50px', fontFamily: 'Manrope, sans-serif' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontSize: '11px', fontWeight: '400', color: '#000', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Manrope, sans-serif' }}>
              ESPACE PRESSE
            </h1>
            <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
              Découvrez l'univers Kamba Lhains à travers nos communiqués de presse, 
              visuels haute définition et informations dédiées aux professionnels des médias.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '50px' }}>
            <div style={{ backgroundColor: 'white', padding: '30px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '20px' }}>
                CONTACT PRESSE
              </h2>
              <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ fontWeight: '500', color: '#333' }}>Responsable :</span><br />
                  Service Communication
                </div>
                <div>
                  <span style={{ fontWeight: '500', color: '#333' }}>Contact :</span><br />
                  Utilisez notre formulaire de contact
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '30px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '20px' }}>
                SERVICES PRESSE
              </h2>
              <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '10px' }}>• Dossiers de presse personnalisés</div>
                <div style={{ marginBottom: '10px' }}>• Visuels haute définition</div>
                <div style={{ marginBottom: '10px' }}>• Échantillons pour tests produits</div>
                <div style={{ marginBottom: '10px' }}>• Entretiens avec les créateurs</div>
                <div style={{ marginBottom: '10px' }}>• Accès aux événements privés</div>
                <div>• Communiqués en avant-première</div>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '30px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '20px' }}>
                RESSOURCES DISPONIBLES
              </h2>
              <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '10px' }}>• Logo et charte graphique</div>
                <div style={{ marginBottom: '10px' }}>• Photos collections HD</div>
                <div style={{ marginBottom: '10px' }}>• Biographies des créateurs</div>
                <div style={{ marginBottom: '10px' }}>• Histoire de la marque</div>
                <div style={{ marginBottom: '10px' }}>• Données RSE et durabilité</div>
                <div>• Communiqués archivés</div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '40px', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '30px', textAlign: 'center' }}>
              DERNIÈRES ACTUALITÉS PRESSE
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', margin: 0 }}>
                    KAMBA LHAINS LANCE SA NOUVELLE COLLECTION "AUBE"
                  </h3>
                  <span style={{ fontSize: '10px', color: '#999', whiteSpace: 'nowrap', marginLeft: '20px' }}>
                    20 Août 2025
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6', margin: '0 0 15px 0' }}>
                  La marque française dévoile sa nouvelle collection automne-hiver, mettant l'accent sur 
                  la durabilité et l'artisanat traditionnel. Une approche innovante qui réinvente les codes 
                  de la mode éthique...
                </p>
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="press-button"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#333',
                    border: '1px solid #333',
                    padding: '8px 16px',
                    fontSize: '9px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    fontFamily: 'Manrope, sans-serif',
                    transition: 'all 0.3s ease'
                  }}
                >
                  DEMANDER LE DOSSIER COMPLET
                </button>
              </div>

              <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', margin: 0 }}>
                    ENGAGEMENT RSE : KAMBA LHAINS CERTIFIÉE B-CORP
                  </h3>
                  <span style={{ fontSize: '10px', color: '#999', whiteSpace: 'nowrap', marginLeft: '20px' }}>
                    15 Juillet 2025
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6', margin: '0 0 15px 0' }}>
                  La marque française obtient la certification B-Corp, reconnaissant son engagement 
                  environnemental et social. Un pas de plus vers une mode plus responsable et transparente...
                </p>
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="press-button"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#333',
                    border: '1px solid #333',
                    padding: '8px 16px',
                    fontSize: '9px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    fontFamily: 'Manrope, sans-serif',
                    transition: 'all 0.3s ease'
                  }}
                >
                  DEMANDER LE DOSSIER COMPLET
                </button>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', margin: 0 }}>
                    OUVERTURE DE LA PREMIÈRE BOUTIQUE PHYSIQUE
                  </h3>
                  <span style={{ fontSize: '10px', color: '#999', whiteSpace: 'nowrap', marginLeft: '20px' }}>
                    01 Juin 2025
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6', margin: '0 0 15px 0' }}>
                  Kamba Lhains ouvre ses portes rue Saint-Honoré à Paris, dans un espace pensé comme 
                  une extension de l'univers digital de la marque. Un concept store unique mêlant 
                  mode et engagement...
                </p>
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="press-button"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#333',
                    border: '1px solid #333',
                    padding: '8px 16px',
                    fontSize: '9px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    fontFamily: 'Manrope, sans-serif',
                    transition: 'all 0.3s ease'
                  }}
                >
                  DEMANDER LE DOSSIER COMPLET
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '40px' }}>
            <div style={{ backgroundColor: 'white', padding: '30px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '20px' }}>
                DEMANDE D'ACCRÉDITATION
              </h2>
              <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
                Journalistes, blogueurs et influenceurs mode, demandez votre accréditation pour accéder 
                à nos événements exclusifs et recevoir nos communiqués en avant-première.
              </p>
              <button
                onClick={() => window.location.href = '/contact'}
                className="press-button-solid"
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
                  width: '100%',
                  transition: 'all 0.3s ease'
                }}
              >
                DEMANDER UNE ACCRÉDITATION
              </button>
            </div>

            <div style={{ backgroundColor: 'white', padding: '30px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '20px' }}>
                KIT PRESSE DIGITAL
              </h2>
              <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
                Téléchargez notre kit presse complet incluant logos, visuels HD, fiches techniques 
                et communiqués. Idéal pour vos articles et publications.
              </p>
              <button
                onClick={() => window.location.href = '/contact'}
                className="press-button"
                style={{
                  backgroundColor: 'transparent',
                  color: '#333',
                  border: '1px solid #333',
                  padding: '8px 16px',
                  fontSize: '9px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  fontFamily: 'Manrope, sans-serif',
                  width: '100%',
                  transition: 'all 0.3s ease'
                }}
              >
                TÉLÉCHARGER LE KIT
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '40px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '25px', textAlign: 'center' }}>
              À PROPOS DE KAMBA LHAINS
            </h2>
            
            <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.8', textAlign: 'justify' }}>
              <p style={{ marginBottom: '20px' }}>
                Fondée en 2024, Kamba Lhains est une marque de mode française qui révolutionne l'industrie 
                textile en plaçant l'éthique et la durabilité au cœur de sa démarche créative. Dirigée par 
                Obel Franck, la marque propose des vêtements et accessoires pensés pour les consommateurs 
                conscients des enjeux environnementaux et sociaux.
              </p>
              
              <p style={{ marginBottom: '20px' }}>
                Chaque pièce Kamba Lhains est conçue dans le respect de l'humain, des animaux et de 
                l'environnement. La marque collabore exclusivement avec des partenaires certifiés et 
                s'engage dans une démarche de transparence totale sur ses pratiques de production.
              </p>
              
              <p style={{ marginBottom: '20px' }}>
                Basée à Paris avec un atelier de création rue Saint-Honoré, Kamba Lhains distribue
                ses créations principalement en ligne sur kamba-lhains.com, touchant une clientèle
                internationale soucieuse de mode responsable.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginTop: '30px', padding: '20px', backgroundColor: 'white' }}>
                <div>
                  <span style={{ fontWeight: '500', color: '#333' }}>Fondation :</span><br />
                  Mars 2024
                </div>
                <div>
                  <span style={{ fontWeight: '500', color: '#333' }}>Siège social :</span><br />
                  Paris, France
                </div>
                <div>
                  <span style={{ fontWeight: '500', color: '#333' }}>Secteur :</span><br />
                  Mode éthique
                </div>
                <div>
                  <span style={{ fontWeight: '500', color: '#333' }}>Site web :</span><br />
                  kamba-lhains.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .press-button:hover {
          background: black !important;
          color: white !important;
        }

        .press-button-solid:hover {
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
          }
        }
      `}</style>
      <Footer />
    </>
  );
}