import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PolitiqueConfidentialite() {
  return (
    <>
      <Head>
        <title>Politique de confidentialité - Kamba Lhains</title>
        <meta name="description" content="Politique de confidentialité et protection des données personnelles - Kamba Lhains." />
      </Head>

      <Header />

      <main className="politique-confidentialite">
        <div className="container">
          <h1>POLITIQUE DE CONFIDENTIALITÉ</h1>

          <section className="section">
            <h2>1. RESPONSABLE DU TRAITEMENT</h2>
            <div className="content">
              <p>Le responsable du traitement des données personnelles est :</p>
              <p><strong>Kamba Lhains</strong><br />
                229 rue Saint-Honoré<br />
                75001 Paris, France<br />
                SIREN : 987 663 424</p>
            </div>
          </section>

          <section className="section">
            <h2>2. DONNÉES PERSONNELLES COLLECTÉES</h2>
            <div className="content">
              <p>Dans le cadre de nos services, nous collectons les données personnelles suivantes :</p>
              <ul>
                <li><strong>Données d'identification :</strong> nom, prénom, email, téléphone</li>
                <li><strong>Données de livraison :</strong> adresse de livraison et de facturation</li>
                <li><strong>Données de commande :</strong> produits commandés, montants, historique d'achats</li>
                <li><strong>Données de paiement :</strong> informations de transaction (traitées par Stripe)</li>
                <li><strong>Données de navigation :</strong> cookies, adresse IP, données de connexion</li>
              </ul>
            </div>
          </section>

          <section className="section">
            <h2>3. FINALITÉS DU TRAITEMENT</h2>
            <div className="content">
              <p>Vos données personnelles sont utilisées pour :</p>
              <ul>
                <li><strong>Gestion des commandes :</strong> traitement, préparation et livraison</li>
                <li><strong>Service client :</strong> réponse à vos questions et réclamations</li>
                <li><strong>Facturation :</strong> édition et envoi des factures</li>
                <li><strong>Suivi de livraison :</strong> transmission aux transporteurs</li>
                <li><strong>Communication marketing :</strong> newsletters et offres promotionnelles (avec votre consentement)</li>
                <li><strong>Amélioration du site :</strong> analyse de navigation et d'audience</li>
                <li><strong>Obligations légales :</strong> comptabilité, garanties</li>
              </ul>
            </div>
          </section>

          <section className="section">
            <h2>4. BASE LÉGALE</h2>
            <div className="content">
              <p>Le traitement de vos données personnelles est fondé sur :</p>
              <ul>
                <li><strong>L'exécution du contrat :</strong> pour le traitement des commandes</li>
                <li><strong>L'intérêt légitime :</strong> pour l'amélioration de nos services</li>
                <li><strong>Le consentement :</strong> pour la communication marketing</li>
                <li><strong>L'obligation légale :</strong> pour la comptabilité et les garanties</li>
              </ul>
            </div>
          </section>

          <section className="section">
            <h2>5. DESTINATAIRES DES DONNÉES</h2>
            <div className="content">
              <p>Vos données personnelles peuvent être transmises aux destinataires suivants :</p>
              <ul>
                <li><strong>Services internes :</strong> équipes commerciales et service client</li>
                <li><strong>Prestataires de paiement :</strong> Stripe pour le traitement des paiements</li>
                <li><strong>Transporteurs :</strong> Colissimo et DHL pour la livraison</li>
                <li><strong>Outils d'analyse :</strong> Google Analytics pour l'amélioration du site</li>
                <li><strong>Autorités compétentes :</strong> en cas d'obligation légale</li>
              </ul>
            </div>
          </section>

          <section className="section">
            <h2>6. DURÉE DE CONSERVATION</h2>
            <div className="content">
              <p>Nous conservons vos données personnelles pendant les durées suivantes :</p>
              <ul>
                <li><strong>Données de commande :</strong> 10 ans (obligations comptables)</li>
                <li><strong>Données clients :</strong> 3 ans après le dernier contact</li>
                <li><strong>Données de prospection :</strong> 3 ans ou jusqu'à désinscription</li>
                <li><strong>Cookies de navigation :</strong> 13 mois maximum</li>
                <li><strong>Données de garantie :</strong> durée de la garantie légale</li>
              </ul>
            </div>
          </section>

          <section className="section">
            <h2>7. TRANSFERTS HORS UE</h2>
            <div className="content">
              <p>Certains de nos prestataires peuvent être situés hors de l'Union européenne. Dans ce cas, nous nous assurons qu'un niveau de protection adéquat soit garanti, notamment par :</p>
              <ul>
                <li>Des décisions d'adéquation de la Commission européenne</li>
                <li>Des clauses contractuelles types approuvées par la Commission européenne</li>
                <li>Des certifications et codes de conduite approuvés</li>
              </ul>
            </div>
          </section>

          <section className="section">
            <h2>8. VOS DROITS</h2>
            <div className="content">
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul>
                <li><strong>Droit d'accès :</strong> obtenir la confirmation que vos données sont traitées</li>
                <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> supprimer vos données dans certains cas</li>
                <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
                <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> vous opposer au traitement pour motifs légitimes</li>
                <li><strong>Droit de retrait du consentement :</strong> pour les traitements basés sur le consentement</li>
              </ul>
            </div>
          </section>

          <section className="section">
            <h2>9. EXERCICE DE VOS DROITS</h2>
            <div className="content">
              <p>Pour exercer vos droits, vous pouvez nous contacter :</p>
              <ul>
                <li><strong>Par courrier :</strong> Kamba Lhains, 229 rue Saint-Honoré, 75001 Paris</li>
              </ul>
              <p>Nous vous répondrons dans un délai d'un mois. Une pièce d'identité pourra vous être demandée pour vérifier votre identité.</p>
            </div>
          </section>

          <section className="section">
            <h2>10. RÉCLAMATION</h2>
            <div className="content">
              <p>Si vous estimez que le traitement de vos données personnelles n'est pas conforme au RGPD, vous avez le droit d'introduire une réclamation auprès de la CNIL :</p>
              <p><strong>CNIL</strong><br />
                3 Place de Fontenoy<br />
                TSA 80715<br />
                75334 PARIS CEDEX 07<br />
                Téléphone : 01 53 73 22 22<br />
                Site web : cnil.fr</p>
            </div>
          </section>

          <section className="section">
            <h2>11. COOKIES</h2>
            <div className="content">
              <p>Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.</p>
              <p>Les cookies utilisés sont :</p>
              <ul>
                <li><strong>Cookies techniques :</strong> nécessaires au fonctionnement du site</li>
                <li><strong>Cookies analytiques :</strong> pour mesurer l'audience (Google Analytics)</li>
                <li><strong>Cookies de personnalisation :</strong> pour mémoriser vos préférences</li>
              </ul>
            </div>
          </section>

          <section className="section">
            <h2>12. MISE À JOUR</h2>
            <div className="content">
              <p>Cette politique de confidentialité peut être mise à jour. Nous vous informerons de toute modification importante par email ou via un avis sur notre site.</p>
              <p><strong>Dernière mise à jour :</strong> 20 août 2025</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .politique-confidentialite {
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

        .content ul {
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
          .politique-confidentialite {
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