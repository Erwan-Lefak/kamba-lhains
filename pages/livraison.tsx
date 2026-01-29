import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Livraison() {
  return (
    <>
      <Head>
        <title>Livraison - Kamba Lhains</title>
        <meta name="description" content="Informations de livraison Kamba Lhains - Délais, tarifs et options de livraison dans le monde entier." />
      </Head>

      <Header />

      <main className="livraison">
        <div className="container">
          <h1>LIVRAISON</h1>

          <section className="intro-section">
            <div className="intro-content">
              <p>Tous nos produits sont fabriqués à la commande avec soin et attention. Nous livrons dans le monde entier.</p>
            </div>
          </section>

          <section className="delivery-options">
            <h2>DÉLAIS DE FABRICATION ET LIVRAISON</h2>

            <div className="delivery-grid">
              <div className="delivery-card">
                <div className="delivery-header">
                  <h3>FABRICATION</h3>
                  <div className="delivery-badge">Sur mesure</div>
                </div>
                <div className="delivery-content">
                  <div className="delivery-option">
                    <div className="delivery-details">
                      <p><strong>Délai de fabrication :</strong> 15 jours à compter de la validation de votre commande</p>
                      <p>Chaque pièce est confectionnée avec soin selon les standards de qualité Kamba Lhains.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="delivery-card">
                <div className="delivery-header">
                  <h3>LIVRAISON MONDIALE</h3>
                  <div className="delivery-badge">International</div>
                </div>
                <div className="delivery-content">
                  <div className="delivery-option">
                    <div className="delivery-details">
                      <p><strong>Expédition :</strong> Après fabrication</p>
                      <p><strong>Suivi :</strong> Inclus pour toutes les commandes</p>
                      <p><strong>Remise :</strong> Contre signature</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="pricing-section">
            <h2>TARIFS DE LIVRAISON</h2>
            <div className="pricing-content">
              <p>Les frais de livraison sont calculés automatiquement lors de la validation de votre commande, en fonction de :</p>
              <ul>
                <li>Votre pays de livraison</li>
                <li>Le mode de livraison choisi (standard ou express)</li>
                <li>Le poids et les dimensions de votre commande</li>
              </ul>
              <p>Vous visualiserez le montant exact des frais de port avant de finaliser votre achat.</p>
            </div>
          </section>

          <section className="tracking-section">
            <h2>SUIVI DE COMMANDE</h2>
            <div className="tracking-content">
              <div className="tracking-steps">
                <div className="tracking-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Confirmation de commande</h4>
                    <p>Vous recevez un email de confirmation avec votre numéro de commande.</p>
                  </div>
                </div>

                <div className="tracking-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Fabrication</h4>
                    <p>Votre pièce est confectionnée avec soin (15 jours).</p>
                  </div>
                </div>

                <div className="tracking-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Expédition</h4>
                    <p>Vous recevez un email avec votre numéro de suivi dès l'expédition.</p>
                  </div>
                </div>

                <div className="tracking-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Livraison</h4>
                    <p>Votre colis arrive à l'adresse indiquée.</p>
                  </div>
                </div>
              </div>

              <div className="tracking-note">
                <p><strong>En cas d'absence :</strong> Un avis de passage sera déposé dans votre boîte aux lettres avec les instructions pour récupérer votre colis.</p>
              </div>
            </div>
          </section>

          <section className="important-section">
            <h2>INFORMATIONS IMPORTANTES</h2>
            <div className="important-content">
              <div className="important-item">
                <h4>Fabrication sur commande</h4>
                <p>Chaque pièce Kamba Lhains est fabriquée à la commande. Le délai de fabrication de 15 jours commence dès la validation de votre commande.</p>
              </div>

              <div className="important-item">
                <h4>Adresse de livraison</h4>
                <p>Vérifiez attentivement votre adresse de livraison. Nous ne pourrons être tenus responsables d'une erreur de saisie de votre part.</p>
              </div>

              <div className="important-item">
                <h4>Livraison internationale</h4>
                <p>Pour les livraisons hors Union Européenne, des frais de douane peuvent s'appliquer selon la législation locale. Ces frais restent à la charge du destinataire.</p>
              </div>
            </div>
          </section>

          <section className="delivery-countries">
            <h2>PAYS DE LIVRAISON</h2>
            <div className="countries-content">
              <div className="country-zone">
                <h4>France métropolitaine</h4>
                <p>Livraison standard et express disponible</p>
              </div>
              
              <div className="country-zone">
                <h4>Europe (Union Européenne)</h4>
                <p>Allemagne, Autriche, Belgique, Bulgarie, Chypre, Croatie, Danemark, Espagne, Estonie, Finlande, Grèce, Hongrie, Irlande, Italie, Lettonie, Lituanie, Luxembourg, Malte, Pays-Bas, Pologne, Portugal, République Tchèque, Roumanie, Slovaquie, Slovénie, Suède</p>
              </div>
              
              <div className="country-zone">
                <h4>Europe (Hors UE)</h4>
                <p>Suisse, Royaume-Uni, Norvège, Monaco</p>
              </div>
              
              <div className="country-zone">
                <h4>Amérique du Nord</h4>
                <p>États-Unis, Canada</p>
              </div>
              
              <div className="country-zone">
                <h4>Autres destinations</h4>
                <p>Nous livrons dans de nombreux autres pays. La liste complète est disponible lors du processus de commande.</p>
              </div>
            </div>
          </section>

          <section className="contact-section">
            <h2>QUESTIONS SUR LA LIVRAISON ?</h2>
            <div className="contact-content">
              <p>Notre service client est à votre disposition pour toute question concernant la livraison de votre commande.</p>
              <div className="contact-links">
                <a href="/suivi-commande" className="contact-link">Suivre ma commande</a>
                <a href="/contact" className="contact-link">Nous contacter</a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .livraison {
          min-height: 100vh;
          padding: calc(var(--header-height) + 20px) 0 50px;
          background: white;
          font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 20px 80px;
        }

        h1 {
          font-size: 11px;
          font-weight: 400;
          color: #000;
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

        h4 {
          font-size: 9px;
          font-weight: 500;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 10px;
        }

        .intro-section {
          text-align: center;
          margin-bottom: 50px;
          padding: 30px;
          background: white;
          border: 1px solid #eee;
        }

        .intro-content p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .delivery-options {
          margin-bottom: 50px;
        }

        .delivery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-top: 30px;
        }

        .delivery-card {
          background: white;
          border: 1px solid #eee;
          padding: 30px;
        }

        .delivery-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 1px solid #f0f0f0;
        }

        .delivery-badge {
          background: #333;
          color: white;
          padding: 4px 8px;
          font-size: 8px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .delivery-option {
          margin-bottom: 25px;
        }

        .delivery-option:last-child {
          margin-bottom: 0;
        }

        .delivery-details p {
          font-size: 11px;
          color: #666;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .delivery-details strong {
          color: #333;
          font-weight: 500;
        }

        .pricing-section,
        .tracking-section,
        .important-section,
        .delivery-countries,
        .contact-section {
          margin-bottom: 50px;
          padding: 40px;
          background: white;
          border: 1px solid #eee;
        }

        .pricing-content p,
        .countries-content p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .pricing-content ul {
          margin: 15px 0;
          padding-left: 20px;
        }

        .pricing-content li {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 8px;
        }

        .tracking-steps {
          display: grid;
          gap: 25px;
          margin-bottom: 30px;
        }

        .tracking-step {
          display: flex;
          align-items: flex-start;
          gap: 20px;
        }

        .step-number {
          background: #333;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 500;
          flex-shrink: 0;
        }

        .step-content p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 0;
        }

        .tracking-note {
          padding: 20px;
          background: white;
          border-left: 3px solid #333;
        }

        .tracking-note p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        .tracking-note strong {
          color: #333;
          font-weight: 500;
        }

        .important-content,
        .countries-content {
          display: grid;
          gap: 25px;
        }

        .important-item,
        .country-zone {
          padding: 20px;
          border: 1px solid #f0f0f0;
          background: white;
        }

        .important-item p,
        .country-zone p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin: 10px 0 0 0;
        }

        .contact-content {
          text-align: center;
        }

        .contact-content p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .contact-info {
          margin: 25px 0;
          padding: 20px;
          background: white;
        }

        .contact-info p {
          font-size: 11px;
          color: #333;
          margin-bottom: 8px;
        }

        .contact-info strong {
          font-weight: 500;
        }

        .contact-links {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-top: 25px;
        }

        .contact-link {
          background: transparent;
          color: #333;
          border: 1px solid #333;
          padding: 8px 16px;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .contact-link:hover {
          background: black;
          color: white;
        }

        @media (max-width: 768px) {
          .livraison {
            padding-top: 100px;
          }

          .container {
            padding: 20px 15px 60px;
          }

          .delivery-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .intro-section,
          .pricing-section,
          .tracking-section,
          .important-section,
          .delivery-countries,
          .contact-section {
            padding: 25px 20px;
            margin-bottom: 30px;
          }

          .delivery-card {
            padding: 20px;
          }

          .delivery-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .contact-links {
            flex-direction: column;
            align-items: center;
          }

          .contact-link {
            width: 200px;
            text-align: center;
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

          h4 {
            font-size: 8px;
          }

          .intro-content p,
          .pricing-content p,
          .countries-content p,
          .pricing-content li,
          .delivery-details p,
          .step-content p,
          .tracking-note p,
          .important-item p,
          .country-zone p,
          .contact-content p,
          .contact-info p {
            font-size: 10px;
          }
        }
      `}</style>
    </>
  );
}