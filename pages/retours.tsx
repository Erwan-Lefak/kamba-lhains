import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Retours() {
  return (
    <>
      <Head>
        <title>Retours et Échanges - Kamba Lhains</title>
        <meta name="description" content="Politique de retours et échanges Kamba Lhains - Conditions, procédure et délais pour retourner ou échanger vos articles." />
      </Head>

      <Header />

      <main className="retours">
        <div className="container">
          <h1>RETOURS ET ÉCHANGES</h1>

          <section className="intro-section">
            <div className="intro-content">
              <p>Vous disposez de 30 jours pour retourner ou échanger tout article qui ne vous conviendrait pas. Nous nous engageons à rendre ce processus aussi simple que possible.</p>
            </div>
          </section>

          <section className="policy-section">
            <h2>NOTRE POLITIQUE DE RETOUR</h2>

            <div className="policy-grid">
              <div className="policy-card">
                <div className="policy-icon">30</div>
                <h4>Jours pour retourner</h4>
                <p>Vous avez 30 jours à compter de la réception de votre commande pour nous retourner vos articles.</p>
              </div>

              <div className="policy-card">
                <div className="policy-icon">✓</div>
                <h4>Retours gratuits</h4>
                <p>Les retours sont gratuits pour la France métropolitaine. Frais de retour à votre charge pour l'international.</p>
              </div>

              <div className="policy-card">
                <div className="policy-icon">↻</div>
                <h4>Remboursement rapide</h4>
                <p>Nous procédons au remboursement sous 5 à 7 jours ouvrés après réception et contrôle de votre retour.</p>
              </div>
            </div>
          </section>

          <section className="conditions-section">
            <h2>CONDITIONS DE RETOUR</h2>

            <div className="conditions-content">
              <p>Pour que votre retour soit accepté, les articles doivent respecter les conditions suivantes :</p>

              <div className="condition-item">
                <div className="condition-icon">✓</div>
                <div className="condition-text">
                  <h4>État neuf</h4>
                  <p>Les articles doivent être dans leur état d'origine, non portés, non lavés et sans trace d'utilisation.</p>
                </div>
              </div>

              <div className="condition-item">
                <div className="condition-icon">✓</div>
                <div className="condition-text">
                  <h4>Étiquettes attachées</h4>
                  <p>Toutes les étiquettes d'origine doivent être présentes et attachées aux articles.</p>
                </div>
              </div>

              <div className="condition-item">
                <div className="condition-icon">✓</div>
                <div className="condition-text">
                  <h4>Emballage d'origine</h4>
                  <p>Les articles doivent être retournés dans leur emballage d'origine ou dans un emballage approprié.</p>
                </div>
              </div>

              <div className="condition-item">
                <div className="condition-icon">✓</div>
                <div className="condition-text">
                  <h4>Délai respecté</h4>
                  <p>La demande de retour doit être effectuée dans les 30 jours suivant la réception de votre commande.</p>
                </div>
              </div>
            </div>

            <div className="warning-note">
              <p><strong>Articles non retournables :</strong> Pour des raisons d'hygiène, les sous-vêtements et articles de bonneterie ne peuvent être ni repris ni échangés, sauf en cas de défaut de fabrication.</p>
            </div>
          </section>

          <section className="how-to-return">
            <h2>COMMENT RETOURNER UN ARTICLE</h2>

            <div className="return-steps">
              <div className="return-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Demande de retour</h4>
                  <p>Connectez-vous à votre compte client et accédez à la section "Mes commandes". Sélectionnez la commande concernée et cliquez sur "Demander un retour". Vous pouvez aussi nous contacter via notre formulaire de contact avec votre numéro de commande.</p>
                </div>
              </div>

              <div className="return-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Réception de l'étiquette de retour</h4>
                  <p>Vous recevrez par email une étiquette de retour prépayée (France métropolitaine uniquement) ainsi que les instructions détaillées pour le retour.</p>
                </div>
              </div>

              <div className="return-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Préparation du colis</h4>
                  <p>Emballez soigneusement vos articles en veillant à ce qu'ils soient bien protégés. Incluez le bordereau de retour que vous trouverez dans votre colis d'origine ou que nous vous enverrons par email.</p>
                </div>
              </div>

              <div className="return-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Envoi du colis</h4>
                  <p>Déposez votre colis dans un point relais ou bureau de poste selon les instructions reçues. Conservez votre preuve de dépôt.</p>
                </div>
              </div>

              <div className="return-step">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h4>Traitement du retour</h4>
                  <p>Dès réception de votre colis, nous procédons au contrôle des articles. Vous recevez une confirmation par email une fois le contrôle effectué.</p>
                </div>
              </div>

              <div className="return-step">
                <div className="step-number">6</div>
                <div className="step-content">
                  <h4>Remboursement</h4>
                  <p>Le remboursement est effectué sur votre moyen de paiement d'origine sous 5 à 7 jours ouvrés après validation du retour. Les frais de livraison initiaux ne sont pas remboursés sauf en cas d'erreur de notre part.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="exchange-section">
            <h2>ÉCHANGES</h2>

            <div className="exchange-content">
              <div className="exchange-intro">
                <p>Vous souhaitez échanger un article contre une autre taille ou couleur ? Nous facilitons les échanges pour votre confort.</p>
              </div>

              <div className="exchange-process">
                <h4>Procédure d'échange</h4>
                <div className="exchange-steps">
                  <div className="exchange-item">
                    <strong>1. Demande d'échange</strong>
                    <p>Contactez notre service client en précisant l'article que vous souhaitez échanger et la taille/couleur désirée.</p>
                  </div>
                  <div className="exchange-item">
                    <strong>2. Vérification de disponibilité</strong>
                    <p>Nous vérifions la disponibilité de l'article souhaité et vous confirmons la possibilité d'échange.</p>
                  </div>
                  <div className="exchange-item">
                    <strong>3. Retour de l'article</strong>
                    <p>Suivez la procédure de retour standard. Une fois l'article original reçu et contrôlé, nous expédions le nouvel article.</p>
                  </div>
                  <div className="exchange-item">
                    <strong>4. Expédition du nouvel article</strong>
                    <p>L'envoi du nouvel article est gratuit. Vous recevez un email de confirmation avec le numéro de suivi.</p>
                  </div>
                </div>
              </div>

              <div className="exchange-note">
                <p><strong>Important :</strong> Les échanges sont soumis à disponibilité des stocks. Si l'article souhaité n'est plus disponible, nous procéderons au remboursement et vous pourrez passer une nouvelle commande.</p>
              </div>
            </div>
          </section>

          <section className="international-section">
            <h2>RETOURS INTERNATIONAUX</h2>

            <div className="international-content">
              <div className="international-item">
                <h4>Europe</h4>
                <p>Les retours depuis l'Europe sont acceptés dans les mêmes conditions. Les frais de retour sont à votre charge. Nous vous recommandons d'utiliser un service de livraison avec suivi.</p>
              </div>

              <div className="international-item">
                <h4>Reste du monde</h4>
                <p>Les retours depuis le reste du monde sont acceptés. Les frais de retour et éventuels frais de douane sont à votre charge. Contactez notre service client avant d'effectuer votre retour.</p>
              </div>

              <div className="international-item">
                <h4>Adresse de retour</h4>
                <p>
                  Kamba Lhains - Service Retours<br />
                  229 rue Saint-Honoré<br />
                  75001 Paris<br />
                  France
                </p>
              </div>
            </div>
          </section>

          <section className="defect-section">
            <h2>ARTICLE DÉFECTUEUX OU ERREUR DE LIVRAISON</h2>

            <div className="defect-content">
              <div className="defect-intro">
                <p>Si vous avez reçu un article défectueux ou si une erreur s'est produite lors de la préparation de votre commande, nous nous engageons à résoudre le problème rapidement.</p>
              </div>

              <div className="defect-process">
                <h4>Que faire ?</h4>
                <ol>
                  <li>Contactez notre service client dans les 48 heures suivant la réception de votre commande</li>
                  <li>Envoyez-nous des photos de l'article défectueux ou de l'erreur constatée</li>
                  <li>Nous vous proposerons un échange gratuit ou un remboursement intégral selon votre préférence</li>
                  <li>Les frais de retour seront intégralement pris en charge par nos soins</li>
                </ol>
              </div>

              <div className="defect-note">
                <p><strong>Garantie qualité :</strong> Tous nos produits sont soigneusement contrôlés avant expédition. En cas de défaut avéré, nous prenons en charge l'intégralité des frais (retour et renvoi) et vous garantissons un traitement prioritaire.</p>
              </div>
            </div>
          </section>

          <section className="faq-section">
            <h2>QUESTIONS FRÉQUENTES</h2>

            <div className="faq-content">
              <div className="faq-item">
                <h4>Puis-je retourner un article soldé ?</h4>
                <p>Oui, les articles soldés peuvent être retournés dans les mêmes conditions que les articles à plein tarif, dans les 30 jours suivant la réception.</p>
              </div>

              <div className="faq-item">
                <h4>Comment suivre mon retour ?</h4>
                <p>Conservez le numéro de suivi fourni lors de l'envoi de votre colis. Vous pouvez également suivre l'état de votre retour depuis votre compte client.</p>
              </div>

              <div className="faq-item">
                <h4>Que faire si j'ai perdu le bordereau de retour ?</h4>
                <p>Pas de panique ! Contactez notre service client qui vous en enverra un nouveau par email, ou incluez simplement une note avec votre nom, numéro de commande et raison du retour.</p>
              </div>

              <div className="faq-item">
                <h4>Les frais de livraison sont-ils remboursés ?</h4>
                <p>Les frais de livraison initiaux ne sont pas remboursés, sauf en cas d'erreur de notre part (article défectueux ou erreur de commande).</p>
              </div>

              <div className="faq-item">
                <h4>Combien de temps prend le remboursement ?</h4>
                <p>Le remboursement est effectué sous 5 à 7 jours ouvrés après réception et contrôle de votre retour. Le délai de crédit sur votre compte bancaire dépend de votre établissement bancaire (généralement 3 à 5 jours supplémentaires).</p>
              </div>

              <div className="faq-item">
                <h4>Puis-je échanger contre un article plus cher ?</h4>
                <p>Oui, contactez notre service client. Vous devrez régler la différence de prix avant l'expédition du nouvel article.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .retours {
          min-height: 100vh;
          padding: calc(var(--header-height) + 20px) 0 50px;
          background: #ffffff;
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
          font-family: 'Manrope', sans-serif;
        }

        h2 {
          font-size: 10px;
          font-weight: 600;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 25px;
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
          max-width: 700px;
          margin: 0 auto;
        }

        .policy-section,
        .conditions-section,
        .how-to-return,
        .exchange-section,
        .international-section,
        .defect-section,
        .faq-section,
        .contact-section {
          margin-bottom: 50px;
          padding: 40px;
          background: white;
          border: 1px solid #eee;
        }

        .policy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
        }

        .policy-card {
          background: white;
          border: 1px solid #eee;
          padding: 30px;
          text-align: center;
        }

        .policy-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 20px;
          background: #333;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 600;
        }

        .policy-card h4 {
          margin-bottom: 12px;
        }

        .policy-card p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        .conditions-content {
          margin-bottom: 25px;
        }

        .conditions-content > p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 25px;
        }

        .condition-item {
          display: flex;
          gap: 15px;
          padding: 20px;
          background: white;
          border: 1px solid #eee;
          margin-bottom: 15px;
        }

        .condition-item:last-child {
          margin-bottom: 0;
        }

        .condition-icon {
          width: 24px;
          height: 24px;
          background: #333;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
        }

        .condition-text h4 {
          margin-bottom: 8px;
        }

        .condition-text p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        .warning-note,
        .exchange-note,
        .defect-note {
          padding: 20px;
          background: white;
          border-left: 3px solid #333;
          border: 1px solid #eee;
          margin-top: 25px;
        }

        .warning-note p,
        .exchange-note p,
        .defect-note p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        .warning-note strong,
        .exchange-note strong,
        .defect-note strong {
          color: #333;
          font-weight: 500;
        }

        .return-steps {
          display: grid;
          gap: 20px;
        }

        .return-step {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 20px;
          background: white;
          border: 1px solid #eee;
        }

        .step-number {
          background: #333;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 500;
          flex-shrink: 0;
        }

        .step-content p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        .exchange-intro {
          margin-bottom: 30px;
        }

        .exchange-intro p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
        }

        .exchange-process {
          background: white;
          border: 1px solid #eee;
          padding: 25px;
          margin-bottom: 25px;
        }

        .exchange-process h4 {
          margin-bottom: 20px;
        }

        .exchange-steps {
          display: grid;
          gap: 15px;
        }

        .exchange-item {
          padding: 15px;
          background: white;
          border: 1px solid #eee;
        }

        .exchange-item strong {
          display: block;
          font-size: 9px;
          font-weight: 500;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 8px;
        }

        .exchange-item p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        .international-content {
          display: grid;
          gap: 20px;
        }

        .international-item {
          padding: 20px;
          background: white;
          border: 1px solid #eee;
        }

        .international-item h4 {
          margin-bottom: 12px;
        }

        .international-item p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        .defect-intro {
          margin-bottom: 25px;
        }

        .defect-intro p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
        }

        .defect-process {
          background: white;
          border: 1px solid #eee;
          padding: 25px;
          margin-bottom: 25px;
        }

        .defect-process h4 {
          margin-bottom: 15px;
        }

        .defect-process ol {
          margin: 0;
          padding-left: 20px;
        }

        .defect-process li {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .defect-process li:last-child {
          margin-bottom: 0;
        }

        .faq-content {
          display: grid;
          gap: 20px;
        }

        .faq-item {
          padding: 20px;
          background: white;
          border: 1px solid #eee;
        }

        .faq-item h4 {
          margin-bottom: 10px;
        }

        .faq-item p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        .contact-content {
          text-align: center;
        }

        .contact-content > p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 25px;
        }

        .contact-info {
          margin: 25px 0;
          padding: 25px;
          background: white;
          border: 1px solid #eee;
        }

        .contact-info p {
          font-size: 11px;
          color: #333;
          margin-bottom: 10px;
        }

        .contact-info p:last-child {
          margin-bottom: 0;
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
          font-size: 9px;
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
          .retours {
            padding-top: 100px;
          }

          .container {
            padding: 20px 15px 60px;
          }

          h1 {
            font-size: 10px;
            margin-bottom: 30px;
          }

          h2 {
            font-size: 9px;
          }

          h4 {
            font-size: 8px;
          }

          .intro-section,
          .policy-section,
          .conditions-section,
          .how-to-return,
          .exchange-section,
          .international-section,
          .defect-section,
          .faq-section,
          .contact-section {
            padding: 25px 20px;
            margin-bottom: 30px;
          }

          .policy-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .policy-card,
          .return-step,
          .condition-item,
          .international-item,
          .faq-item,
          .exchange-process,
          .defect-process {
            padding: 18px;
          }

          .contact-links {
            flex-direction: column;
            align-items: center;
          }

          .contact-link {
            width: 200px;
            text-align: center;
          }

          .intro-content p,
          .policy-card p,
          .condition-text p,
          .warning-note p,
          .step-content p,
          .exchange-intro p,
          .exchange-item p,
          .exchange-note p,
          .international-item p,
          .defect-intro p,
          .defect-process li,
          .defect-note p,
          .faq-item p,
          .contact-content > p,
          .contact-info p {
            font-size: 10px;
          }

          .step-number {
            width: 26px;
            height: 26px;
            font-size: 10px;
          }

          .policy-icon {
            width: 50px;
            height: 50px;
            font-size: 18px;
          }

          .exchange-item strong {
            font-size: 8px;
          }
        }
      `}</style>
    </>
  );
}
