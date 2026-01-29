import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Commandes() {
  return (
    <>
      <Head>
        <title>Commandes - Kamba Lhains</title>
        <meta name="description" content="Informations sur les commandes Kamba Lhains - Comment commander, modes de paiement et gestion de vos commandes." />
      </Head>

      <Header />

      <main className="commandes">
        <div className="container">
          <h1>COMMANDES</h1>

          <section className="intro-section">
            <div className="intro-content">
              <p>Toutes les informations pour passer commande, gérer vos achats et profiter d'une expérience d'achat optimale sur notre boutique en ligne.</p>
            </div>
          </section>

          <section className="how-to-order">
            <h2>COMMENT PASSER COMMANDE</h2>

            <div className="order-steps">
              <div className="order-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Sélection des produits</h4>
                  <p>Parcourez nos collections et ajoutez les articles de votre choix au panier. Vous pouvez sélectionner la taille et la couleur pour chaque produit.</p>
                </div>
              </div>

              <div className="order-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Vérification du panier</h4>
                  <p>Consultez votre panier pour vérifier les articles, quantités et prix. Vous pouvez modifier ou supprimer des produits à tout moment.</p>
                </div>
              </div>

              <div className="order-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Identification</h4>
                  <p>Connectez-vous à votre compte ou créez-en un nouveau. Vous pouvez également commander en tant qu'invité.</p>
                </div>
              </div>

              <div className="order-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Adresse de livraison</h4>
                  <p>Renseignez votre adresse de livraison. Assurez-vous que toutes les informations sont correctes pour éviter tout retard.</p>
                </div>
              </div>

              <div className="order-step">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h4>Mode de livraison</h4>
                  <p>Choisissez votre mode de livraison parmi les options disponibles (standard ou express selon votre pays).</p>
                </div>
              </div>

              <div className="order-step">
                <div className="step-number">6</div>
                <div className="step-content">
                  <h4>Paiement</h4>
                  <p>Sélectionnez votre mode de paiement et validez votre commande de manière sécurisée.</p>
                </div>
              </div>

              <div className="order-step">
                <div className="step-number">7</div>
                <div className="step-content">
                  <h4>Confirmation</h4>
                  <p>Vous recevez immédiatement un email de confirmation avec le récapitulatif de votre commande et votre numéro de commande.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="payment-section">
            <h2>MODES DE PAIEMENT</h2>

            <div className="payment-grid">
              <div className="payment-card">
                <div className="payment-header">
                  <h3>CARTES BANCAIRES</h3>
                  <div className="payment-badge">Sécurisé</div>
                </div>
                <div className="payment-content">
                  <p>Nous acceptons les principales cartes bancaires :</p>
                  <ul>
                    <li>Visa</li>
                    <li>Mastercard</li>
                    <li>American Express</li>
                    <li>Cartes bancaires françaises (CB)</li>
                  </ul>
                  <p>Tous les paiements sont sécurisés via un système de cryptage SSL et validés par 3D Secure.</p>
                </div>
              </div>

              <div className="payment-card">
                <div className="payment-header">
                  <h3>PAYPAL</h3>
                  <div className="payment-badge">Rapide</div>
                </div>
                <div className="payment-content">
                  <p>Payez en toute sécurité avec votre compte PayPal ou par carte bancaire via PayPal sans créer de compte.</p>
                  <p>Protection des achats PayPal incluse pour une tranquillité d'esprit totale.</p>
                </div>
              </div>

            </div>

            <div className="payment-note">
              <p><strong>Sécurité :</strong> Vos informations de paiement ne sont jamais stockées sur nos serveurs. Tous les paiements sont traités par des prestataires certifiés PCI-DSS.</p>
            </div>
          </section>

          <section className="order-management">
            <h2>GESTION DE VOS COMMANDES</h2>

            <div className="management-content">
              <div className="management-item">
                <h4>Suivi de commande</h4>
                <p>Une fois votre commande expédiée, vous recevez un email avec un numéro de suivi vous permettant de suivre votre colis en temps réel. Vous pouvez également consulter l'état de vos commandes depuis votre compte client.</p>
              </div>

              <div className="management-item">
                <h4>Modification de commande</h4>
                <p>Vous souhaitez modifier votre commande ? Contactez-nous dans les plus brefs délais via notre service client. Attention : une fois la commande expédiée, aucune modification ne sera possible.</p>
              </div>

              <div className="management-item">
                <h4>Annulation de commande</h4>
                <p>Vous pouvez annuler votre commande tant qu'elle n'a pas été expédiée. Connectez-vous à votre compte ou contactez notre service client avec votre numéro de commande.</p>
              </div>

              <div className="management-item">
                <h4>Facture</h4>
                <p>Votre facture est disponible dans votre espace client dès la confirmation de votre commande. Vous la recevez également par email.</p>
              </div>
            </div>
          </section>

          <section className="important-section">
            <h2>INFORMATIONS IMPORTANTES</h2>

            <div className="important-content">
              <div className="important-item">
                <h4>Disponibilité des produits</h4>
                <p>Tous les produits sont soumis à disponibilité. En cas d'indisponibilité d'un article après validation de votre commande, nous vous en informerons dans les plus brefs délais et vous proposerons un remboursement ou un avoir.</p>
              </div>

              <div className="important-item">
                <h4>Prix et promotions</h4>
                <p>Les prix affichés sont en euros TTC (toutes taxes comprises) pour la France métropolitaine. Les prix peuvent varier selon votre pays de livraison. Les promotions en cours sont appliquées automatiquement lors de la validation de votre panier.</p>
              </div>

              <div className="important-item">
                <h4>Confirmation de commande</h4>
                <p>Votre commande n'est considérée comme définitive qu'après validation du paiement et réception de l'email de confirmation. Conservez ce numéro de commande pour toute correspondance avec notre service client.</p>
              </div>

              <div className="important-item">
                <h4>Protection des données</h4>
                <p>Vos données personnelles sont protégées et utilisées uniquement dans le cadre de la gestion de vos commandes. Consultez notre politique de confidentialité pour plus d'informations.</p>
              </div>
            </div>
          </section>

          <section className="faq-section">
            <h2>QUESTIONS FRÉQUENTES</h2>

            <div className="faq-content">
              <div className="faq-item">
                <h4>Puis-je modifier mon adresse de livraison après validation ?</h4>
                <p>Oui, si votre commande n'a pas encore été expédiée. Contactez rapidement notre service client avec votre numéro de commande.</p>
              </div>

              <div className="faq-item">
                <h4>Comment utiliser un code promo ?</h4>
                <p>Entrez votre code promo dans le champ prévu à cet effet lors de la validation de votre panier, avant le paiement. La réduction s'appliquera automatiquement.</p>
              </div>

              <div className="faq-item">
                <h4>Puis-je commander sans créer de compte ?</h4>
                <p>Oui, vous pouvez passer commande en tant qu'invité. Cependant, créer un compte vous permet de suivre vos commandes et de bénéficier d'avantages exclusifs.</p>
              </div>

              <div className="faq-item">
                <h4>Que faire si je n'ai pas reçu l'email de confirmation ?</h4>
                <p>Vérifiez votre dossier spam. Si vous ne trouvez pas l'email, contactez notre service client avec les détails de votre commande.</p>
              </div>

              <div className="faq-item">
                <h4>Les frais de livraison sont-ils inclus dans le prix ?</h4>
                <p>Non, les frais de livraison sont calculés en fonction de votre adresse et du mode de livraison choisi. Le montant total vous est indiqué avant validation du paiement.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .commandes {
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
          max-width: 700px;
          margin: 0 auto;
        }

        .how-to-order,
        .payment-section,
        .order-management,
        .important-section,
        .faq-section,
        .contact-section {
          margin-bottom: 50px;
          padding: 40px;
          background: white;
          border: 1px solid #eee;
        }

        .order-steps {
          display: grid;
          gap: 25px;
        }

        .order-step {
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
          margin-bottom: 0;
        }

        .payment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
          margin-bottom: 30px;
        }

        .payment-card {
          background: white;
          border: 1px solid #eee;
          padding: 25px;
        }

        .payment-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #f0f0f0;
        }

        .payment-badge {
          background: #333;
          color: white;
          padding: 4px 8px;
          font-size: 8px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .payment-content p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .payment-content ul {
          margin: 12px 0;
          padding-left: 20px;
        }

        .payment-content li {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 6px;
        }

        .payment-note {
          padding: 20px;
          background: white;
          border-left: 3px solid #333;
          border: 1px solid #eee;
        }

        .payment-note p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        .payment-note strong {
          color: #333;
          font-weight: 500;
        }

        .management-content,
        .important-content,
        .faq-content {
          display: grid;
          gap: 20px;
        }

        .management-item,
        .important-item,
        .faq-item {
          padding: 20px;
          background: white;
          border: 1px solid #eee;
        }

        .management-item p,
        .important-item p,
        .faq-item p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin: 10px 0 0 0;
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
          padding: 12px 25px;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .contact-link:hover {
          background: #333;
          color: white;
        }

        @media (max-width: 768px) {
          .commandes {
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

          h3 {
            font-size: 8px;
          }

          h4 {
            font-size: 8px;
          }

          .intro-section,
          .how-to-order,
          .payment-section,
          .order-management,
          .important-section,
          .faq-section,
          .contact-section {
            padding: 25px 20px;
            margin-bottom: 30px;
          }

          .payment-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .payment-card,
          .order-step,
          .management-item,
          .important-item,
          .faq-item {
            padding: 18px;
          }

          .payment-header {
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

          .intro-content p,
          .step-content p,
          .payment-content p,
          .payment-content li,
          .payment-note p,
          .management-item p,
          .important-item p,
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
        }
      `}</style>
    </>
  );
}
