import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/ProductPage.module.css';

export default function GuideTailles() {
  const [selectedSize, setSelectedSize] = useState('');

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  return (
    <>
      <Head>
        <title>Guide des tailles - Kamba Lhains</title>
        <meta name="description" content="Guide des tailles Kamba Lhains - Trouvez la taille parfaite avec nos tableaux de mesures et conseils." />
      </Head>

      <Header />

      <main style={{ paddingTop: 'calc(var(--header-height) + 40px)', paddingBottom: '60px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '11px', fontWeight: '400', textAlign: 'center', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Guide des tailles
          </h1>

          <div className={styles.sizeGuideContent}>
            <div className={styles.sizeTable}>
              <table>
                <thead>
                  <tr>
                    <th>Taille (EU)</th>
                    <th>Poitrine (cm)</th>
                    <th>Taille (cm)</th>
                    <th>Hanches (cm)</th>
                    <th>Taille équivalente (US)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: 'XS', bust: '84 - 88', waist: '66 - 70', hips: '88 - 92', us: '0 - 2' },
                    { size: 'S', bust: '88 - 92', waist: '70 - 75', hips: '92 - 96', us: '4 - 6' },
                    { size: 'M', bust: '92 - 96', waist: '75 - 80', hips: '96 - 100', us: '8 - 10' },
                    { size: 'L', bust: '96 - 100', waist: '80 - 85', hips: '100 - 104', us: '12 - 14' },
                    { size: 'XL', bust: '100 - 104', waist: '85 - 90', hips: '104 - 108', us: '16 - 18' },
                    { size: 'XXL', bust: '104 - 108', waist: '90 - 95', hips: '108 - 112', us: '20 - 22' }
                  ].map((sizeData, index) => (
                    <tr
                      key={index}
                      className={styles.sizeRow}
                      onClick={() => handleSizeSelect(sizeData.size)}
                    >
                      <td>{sizeData.size}</td>
                      <td>{sizeData.bust}</td>
                      <td>{sizeData.waist}</td>
                      <td>{sizeData.hips}</td>
                      <td>{sizeData.us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          <section className="measurement-guide">
            <h2>Comment prendre les mesures ?</h2>
            <div className="measurement-content">
              <div className="measurement-item">
                <h3>Poitrine</h3>
                <p>Passer le ruban dans le dos, sous les bras et sur la partie la plus large de la poitrine.</p>
              </div>

              <div className="measurement-item">
                <h3>Taille</h3>
                <p>Mesurer autour de la partie la plus étroite de la taille. Le ruban doit être ajusté sans être trop serré.</p>
              </div>

              <div className="measurement-item">
                <h3>Hanches</h3>
                <p>Mesurer autour de la partie la plus forte des hanches.</p>
              </div>
            </div>

            <div className="measurement-note">
              <p><strong>Important :</strong> Selon les coupes, de légères différences de mesures pourraient se vérifier.</p>
            </div>
          </section>

          <section className="tips-section">
            <h2>Conseils pour bien choisir</h2>
            <div className="tips-content">
              <div className="tip-item">
                <h3>Prenez vos mesures correctement</h3>
                <ul>
                  <li>Utilisez un mètre ruban souple</li>
                  <li>Portez des sous-vêtements ajustés</li>
                  <li>Tenez-vous droit, les bras le long du corps</li>
                  <li>Ne serrez pas trop le mètre</li>
                </ul>
              </div>

              <div className="tip-item">
                <h3>En cas de doute</h3>
                <ul>
                  <li>Si vous êtes entre deux tailles, choisissez la plus grande</li>
                  <li>Référez-vous aux mesures plutôt qu'aux tailles habituelles</li>
                  <li>Consultez les détails produit pour les spécificités</li>
                </ul>
              </div>

              <div className="tip-item">
                <h3>Coupe et style</h3>
                <ul>
                  <li>Les coupes oversize sont conçues pour être amples</li>
                  <li>Les coupes slim sont ajustées au corps</li>
                  <li>Consultez les descriptions pour chaque produit</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="return-section">
            <h2>Échanges et retours</h2>
            <div className="return-content">
              <p>Si la taille ne convient pas, vous disposez de 14 jours pour échanger ou retourner votre article.</p>
              <p>Les frais de retour sont gratuits en cas d'erreur de notre part, sinon ils restent à votre charge.</p>
              <a href="/retour" className="return-link">Faire une demande de retour</a>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        h2 {
          font-size: 10px;
          font-weight: 600;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 25px;
        }

        h3 {
          font-size: 9px;
          font-weight: 600;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 15px;
        }

        .measurement-guide,
        .tips-section,
        .return-section {
          margin-bottom: 50px;
          padding: 40px;
          background: white;
          border: 1px solid #eee;
        }

        .measurement-content,
        .tips-content {
          display: grid;
          gap: 30px;
        }

        .measurement-item,
        .tip-item {
          border-left: 2px solid #f0f0f0;
          padding-left: 20px;
        }

        .measurement-item p,
        .tip-item p,
        .return-content p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .tip-item ul {
          margin: 15px 0;
          padding-left: 20px;
        }

        .tip-item li {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 8px;
        }

        .measurement-note {
          margin-top: 30px;
          padding: 20px;
          background: white;
          border-left: 3px solid #333;
        }

        .measurement-note p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        .measurement-note strong {
          color: #333;
          font-weight: 500;
        }

        .return-link {
          display: inline-block;
          background: black;
          color: white;
          padding: 8px 16px;
          font-size: 9px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-decoration: none;
          transition: background-color 0.3s;
          margin-top: 20px;
          border: none;
          cursor: pointer;
        }

        .return-link:hover {
          background: #333;
        }

        @media (max-width: 768px) {
          .measurement-guide,
          .tips-section,
          .return-section {
            padding: 25px 20px;
            margin-bottom: 30px;
          }

          .measurement-content,
          .tips-content {
            gap: 20px;
          }

          h2 {
            font-size: 9px;
          }

          h3 {
            font-size: 8px;
          }

          .measurement-item p,
          .tip-item p,
          .return-content p,
          .tip-item li,
          .measurement-note p {
            font-size: 10px;
          }
        }
      `}</style>
    </>
  );
}
