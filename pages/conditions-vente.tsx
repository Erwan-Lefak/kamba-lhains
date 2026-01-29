import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ConditionsVente() {
  return (
    <>
      <Head>
        <title>Conditions de vente - Kamba Lhains</title>
        <meta name="description" content="Conditions générales de vente de Kamba Lhains - Livraison, paiement, retours." />
      </Head>

      <Header />

      <main className="conditions-vente">
        <div className="container">
          <h1>CONDITIONS GÉNÉRALES DE VENTE</h1>

          <section className="section">
            <h2>ARTICLE 1 - OBJET</h2>
            <div className="content">
              <p>Les présentes conditions générales de vente régissent les relations contractuelles entre Kamba Lhains et ses clients dans le cadre de la vente en ligne de vêtements et accessoires de mode sur le site kamba-lhains.com.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 2 - PRIX</h2>
            <div className="content">
              <p>Les prix sont affichés en euros toutes taxes comprises (TTC), TVA française de 20% incluse.</p>
              <p>Aucun frais supplémentaire ne sera ajouté au prix affiché, à l'exception des frais de livraison qui sont calculés automatiquement lors de la validation de votre commande.</p>
              <p>Les prix peuvent être modifiés à tout moment, mais seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 3 - COMMANDE</h2>
            <div className="content">
              <p>La commande n'est définitive qu'après acceptation du paiement par notre prestataire de paiement.</p>
              <p>Toute commande vaut acceptation des prix et descriptions des produits disponibles à la vente.</p>
              <p>Un e-mail de confirmation vous sera envoyé après validation de votre commande.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 4 - PAIEMENT</h2>
            <div className="content">
              <p>Le paiement est exigible intégralement à la commande.</p>
              <p>Nous acceptons les moyens de paiement suivants via notre prestataire Stripe :</p>
              <ul>
                <li>Cartes bancaires (Visa, Mastercard, American Express)</li>
                <li>PayPal</li>
                <li>Apple Pay</li>
                <li>Google Pay</li>
                <li>Bancontact, iDEAL, Klarna (selon votre pays)</li>
              </ul>
              <p>Le paiement est sécurisé et encaissé immédiatement à la validation de la commande.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 5 - LIVRAISON</h2>
            <div className="content">
              <p>Nous livrons dans le monde entier avec des options de livraison standard et express.</p>
              
              <h3>France Métropolitaine</h3>
              <ul>
                <li><strong>Livraison standard :</strong> Colissimo, délai moyen de 2 à 4 jours ouvrés, remise contre signature</li>
                <li><strong>Livraison express :</strong> DHL Express, délai moyen de 1 à 2 jours ouvrés</li>
              </ul>

              <h3>International</h3>
              <ul>
                <li><strong>Europe :</strong> DHL Express, délai moyen de 2 à 3 jours ouvrés</li>
                <li><strong>Reste du monde :</strong> DHL Express, délai moyen de 3 à 6 jours ouvrés (avec exceptions)</li>
              </ul>

              <p>Les délais de livraison peuvent être prolongés en période de forte activité commerciale ou en cas de conditions météorologiques exceptionnelles.</p>
              
              <h3>Suivi de commande</h3>
              <p>Vous recevrez un e-mail avec votre numéro de suivi dès que votre colis sera expédié. En cas d'absence lors de la livraison, un avis de passage sera déposé dans votre boîte aux lettres.</p>
              
              <h3>Tarifs de livraison</h3>
              <p>Les frais de livraison sont calculés automatiquement lors de la validation de votre commande, en fonction de votre pays de livraison et du mode de livraison choisi.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 6 - DROIT DE RÉTRACTATION</h2>
            <div className="content">
              <p>Conformément à l'article L221-18 du Code de la consommation, vous disposez de 14 jours à compter de la réception de votre commande pour nous retourner un article qui ne vous conviendrait pas.</p>
              
              <h3>Processus de retour</h3>
              <ol>
                <li>Enregistrez votre demande de retour via notre formulaire en ligne ou en vous connectant à votre compte client</li>
                <li>Recevez l'étiquette de retour prépayée par e-mail, avec les instructions pour le retour</li>
                <li>Préparez votre colis : les articles doivent être dans leur état d'origine, non portés, non lavés, avec toutes les étiquettes attachées</li>
                <li>Retournez le colis : déposez-le dans un bureau de poste ou un point de collecte selon les instructions fournies</li>
              </ol>

              <h3>Conditions de retour</h3>
              <ul>
                <li><strong>Articles acceptés :</strong> vêtements, chaussures et accessoires dans leur état d'origine</li>
                <li><strong>Articles non acceptés :</strong> produits personnalisés ou modifiés</li>
                <li><strong>Frais de retour :</strong> à la charge du client, sauf en cas d'erreur de notre part</li>
              </ul>

              <h3>Remboursement</h3>
              <p>Une fois le retour reçu et validé, le remboursement sera effectué sur le mode de paiement utilisé lors de la commande, dans un délai de 14 jours.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 7 - GARANTIE</h2>
            <div className="content">
              <p>Tous nos produits bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés, conformément aux articles L217-4 et suivants du Code de la consommation.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 8 - RESPONSABILITÉ</h2>
            <div className="content">
              <p>Kamba Lhains ne saurait être tenu responsable de l'inexécution du contrat conclu en cas de rupture de stock ou indisponibilité du produit, de cas fortuit ou de force majeure.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 9 - DONNÉES PERSONNELLES</h2>
            <div className="content">
              <p>Les données personnelles collectées sont nécessaires au traitement de votre commande. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour plus d'informations, consultez notre politique de confidentialité.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 10 - SERVICE CLIENT</h2>
            <div className="content">
              <p>Pour toute question relative à nos produits ou services, vous pouvez nous contacter :</p>
              <ul>
                <li><strong>Formulaire de contact :</strong> <a href="/contact" style={{ color: '#333', textDecoration: 'underline' }}>Contactez-nous</a></li>
              </ul>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 11 - DROIT APPLICABLE</h2>
            <div className="content">
              <p>Les présentes conditions générales de vente sont soumises à la loi française. En cas de litige, les tribunaux français seront seuls compétents.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .conditions-vente {
          min-height: 100vh;
          padding: calc(var(--header-height) + 20px) 0 50px;
          background: white;
          font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px 80px;
        }

        h1 {
          font-size: 11px;
          font-weight: 400;
          color: #000;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 50px;
          text-align: center;
          font-family: 'Manrope', sans-serif;
        }

        .section {
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 1px solid #eee;
        }

        .section:last-child {
          border-bottom: none;
        }

        h2 {
          font-size: 10px;
          font-weight: 600;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
        }

        h3 {
          font-size: 9px;
          font-weight: 600;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 20px 0 15px 0;
        }

        .content p {
          font-size: 11px;
          font-weight: 400;
          color: #666;
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .content p:last-child {
          margin-bottom: 0;
        }

        .content ul,
        .content ol {
          margin: 12px 0;
          padding-left: 20px;
        }

        .content li {
          font-size: 11px;
          font-weight: 400;
          color: #666;
          line-height: 1.6;
          margin-bottom: 8px;
        }

        .content strong {
          font-weight: 500;
          color: #333;
        }

        @media (max-width: 768px) {
          .conditions-vente {
            padding-top: 100px;
          }

          .container {
            padding: 20px 15px 60px;
          }

          h1 {
            font-size: 10px;
            margin-bottom: 40px;
          }

          h2 {
            font-size: 9px;
          }

          h3 {
            font-size: 8px;
          }

          .content p,
          .content li {
            font-size: 10px;
          }

          .section {
            margin-bottom: 30px;
            padding-bottom: 20px;
          }
        }
      `}</style>
    </>
  );
}