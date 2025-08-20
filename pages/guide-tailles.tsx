import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function GuideTailles() {
  const [unit, setUnit] = useState('cm');

  const sizeData = [
    { size: 'XS', celine: '44', poitrine: '88', taille: '72', hanches: '88' },
    { size: 'S', celine: '46', poitrine: '92', taille: '76', hanches: '92' },
    { size: 'M', celine: '48-50', poitrine: '96', taille: '80', hanches: '96' },
    { size: 'L', celine: '52', poitrine: '100', taille: '84', hanches: '100' },
    { size: 'XL', celine: '54', poitrine: '104', taille: '88', hanches: '104' },
    { size: 'XXL', celine: '56', poitrine: '108', taille: '92', hanches: '108' }
  ];

  return (
    <>
      <Head>
        <title>Guide des tailles - Kamba Lhains</title>
        <meta name="description" content="Guide des tailles Kamba Lhains - Trouvez la taille parfaite avec nos tableaux de mesures et conseils." />
      </Head>

      <Header />

      <main className="guide-tailles">
        <div className="container">
          <h1>GUIDE DES TAILLES</h1>

          <section className="size-table-section">
            <div className="unit-selector">
              <label className={unit === 'cm' ? 'active' : ''}>
                <input 
                  type="radio" 
                  name="unit" 
                  value="cm" 
                  checked={unit === 'cm'} 
                  onChange={(e) => setUnit(e.target.value)} 
                />
                CM
              </label>
              <label className={unit === 'in' ? 'active' : ''}>
                <input 
                  type="radio" 
                  name="unit" 
                  value="in" 
                  checked={unit === 'in'} 
                  onChange={(e) => setUnit(e.target.value)} 
                />
                IN
              </label>
            </div>

            <div className="table-container">
              <table className="size-table">
                <thead>
                  <tr>
                    <th>CÉLINE<br />TAILLES</th>
                    <th>FR/EU</th>
                    <th>POITRINE</th>
                    <th>TAILLE</th>
                    <th>HANCHES</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                      <td><strong>{row.size}</strong></td>
                      <td>{row.celine}</td>
                      <td>{row.poitrine}</td>
                      <td>{row.taille}</td>
                      <td>{row.hanches}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="measurement-guide">
            <h2>COMMENT PRENDRE LES MESURES ?</h2>
            <div className="measurement-content">
              <div className="measurement-item">
                <h3>POITRINE</h3>
                <p>Passer le ruban dans le dos, sous les bras et sur la partie la plus large de la poitrine.</p>
              </div>
              
              <div className="measurement-item">
                <h3>TAILLE</h3>
                <p>Mesurer autour de la partie la plus étroite de la taille. Le ruban doit être ajusté sans être trop serré.</p>
              </div>
              
              <div className="measurement-item">
                <h3>HANCHES</h3>
                <p>Mesurer autour de la partie la plus forte des hanches.</p>
              </div>
            </div>

            <div className="measurement-note">
              <p><strong>Important :</strong> Selon les coupes, de légères différences de mesures pourraient se vérifier.</p>
            </div>
          </section>

          <section className="tips-section">
            <h2>CONSEILS POUR BIEN CHOISIR</h2>
            <div className="tips-content">
              <div className="tip-item">
                <h3>PRENEZ VOS MESURES CORRECTEMENT</h3>
                <ul>
                  <li>Utilisez un mètre ruban souple</li>
                  <li>Portez des sous-vêtements ajustés</li>
                  <li>Tenez-vous droit, les bras le long du corps</li>
                  <li>Ne serrez pas trop le mètre</li>
                </ul>
              </div>

              <div className="tip-item">
                <h3>EN CAS DE DOUTE</h3>
                <ul>
                  <li>Si vous êtes entre deux tailles, choisissez la plus grande</li>
                  <li>Référez-vous aux mesures plutôt qu'aux tailles habituelles</li>
                  <li>Consultez les détails produit pour les spécificités</li>
                </ul>
              </div>

              <div className="tip-item">
                <h3>COUPE ET STYLE</h3>
                <ul>
                  <li>Les coupes oversize sont conçues pour être amples</li>
                  <li>Les coupes slim sont ajustées au corps</li>
                  <li>Consultez les descriptions pour chaque produit</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="size-specific">
            <h2>GUIDES SPÉCIFIQUES</h2>
            <div className="specific-content">
              <div className="specific-item">
                <h3>VÊTEMENTS HOMME</h3>
                <p>Nos tailles homme suivent le barème FR/EU standard. Pour les chemises, référez-vous au tour de cou et à la longueur des manches.</p>
              </div>

              <div className="specific-item">
                <h3>ACCESSOIRES</h3>
                <p>Les ceintures sont indiquées en longueur totale. Les bonnets et casquettes sont en taille unique ajustable.</p>
              </div>

              <div className="specific-item">
                <h3>CHAUSSURES</h3>
                <p>Nos chaussures suivent la pointure française. En cas de doute, référez-vous à la longueur de votre pied en centimètres.</p>
              </div>
            </div>
          </section>

          <section className="contact-section">
            <h2>BESOIN DE CONSEIL ?</h2>
            <div className="contact-content">
              <p>Le service client est ouvert du lundi au samedi, de 10h à 19h, heure de Paris. Notre équipe de conseillers est joignable au numéro suivant pour vous assister :</p>
              <div className="contact-info">
                <p><strong>+33 (0) 1 70 38 92 92</strong></p>
                <p><strong>info@kambalahains.net</strong></p>
              </div>
              <p>Du lundi au vendredi : 10h-13h et 14h-21h<br />
                 Samedi : 10h-13h et 14h-18h</p>
            </div>
          </section>

          <section className="return-section">
            <h2>ÉCHANGES ET RETOURS</h2>
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
        .guide-tailles {
          padding-top: 120px;
          min-height: 100vh;
          background: #fafafa;
          font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px 80px;
        }

        h1 {
          font-size: 11px;
          font-weight: 600;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 40px;
          text-align: center;
        }

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

        .size-table-section {
          margin-bottom: 50px;
          background: white;
          padding: 40px;
          border: 1px solid #eee;
        }

        .unit-selector {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }

        .unit-selector label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .unit-selector label.active {
          color: #333;
        }

        .unit-selector input[type="radio"] {
          width: 12px;
          height: 12px;
        }

        .table-container {
          overflow-x: auto;
        }

        .size-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }

        .size-table th {
          background: #f8f8f8;
          padding: 15px 10px;
          text-align: center;
          font-size: 9px;
          font-weight: 600;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #ddd;
          line-height: 1.2;
        }

        .size-table td {
          padding: 12px 10px;
          text-align: center;
          font-size: 11px;
          color: #666;
          border-bottom: 1px solid #f0f0f0;
        }

        .size-table tr.even {
          background: #fafafa;
        }

        .size-table td strong {
          color: #333;
          font-weight: 500;
        }

        .measurement-guide,
        .tips-section,
        .size-specific,
        .contact-section,
        .return-section {
          margin-bottom: 50px;
          padding: 40px;
          background: white;
          border: 1px solid #eee;
        }

        .measurement-content,
        .tips-content,
        .specific-content {
          display: grid;
          gap: 30px;
        }

        .measurement-item,
        .tip-item,
        .specific-item {
          border-left: 2px solid #f0f0f0;
          padding-left: 20px;
        }

        .measurement-item p,
        .tip-item p,
        .specific-item p,
        .contact-content p,
        .return-content p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .tip-item ul,
        .specific-content ul {
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
          background: #f8f8f8;
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

        .contact-info {
          margin: 20px 0;
          text-align: center;
        }

        .contact-info p {
          font-size: 11px;
          font-weight: 500;
          color: #333;
          margin-bottom: 5px;
        }

        .return-link {
          display: inline-block;
          background: #333;
          color: white;
          padding: 12px 25px;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-decoration: none;
          transition: background 0.3s ease;
          margin-top: 20px;
        }

        .return-link:hover {
          background: #555;
        }

        @media (max-width: 768px) {
          .guide-tailles {
            padding-top: 100px;
          }

          .container {
            padding: 20px 15px 60px;
          }

          .size-table-section,
          .measurement-guide,
          .tips-section,
          .size-specific,
          .contact-section,
          .return-section {
            padding: 25px 20px;
            margin-bottom: 30px;
          }

          .measurement-content,
          .tips-content,
          .specific-content {
            gap: 20px;
          }

          .size-table {
            font-size: 10px;
          }

          .size-table th {
            padding: 10px 6px;
            font-size: 8px;
          }

          .size-table td {
            padding: 10px 6px;
            font-size: 10px;
          }

          h1 {
            font-size: 10px;
            margin-bottom: 30px;
          }

          h2 {
            font-size: 9px;
          }

          h3 {
            font-size: 8px;
          }

          .measurement-item p,
          .tip-item p,
          .specific-item p,
          .contact-content p,
          .return-content p,
          .tip-item li,
          .measurement-note p {
            font-size: 10px;
          }
        }

        @media (max-width: 480px) {
          .size-table th,
          .size-table td {
            padding: 8px 4px;
            font-size: 9px;
          }

          .size-table th {
            font-size: 7px;
          }
        }
      `}</style>
    </>
  );
}