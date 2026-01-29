import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ConditionsUtilisation() {
  return (
    <>
      <Head>
        <title>Conditions d'utilisation - Kamba Lhains</title>
        <meta name="description" content="Conditions d'utilisation du site Kamba Lhains - Règles d'usage et responsabilités." />
      </Head>

      <Header />

      <main className="conditions-utilisation">
        <div className="container">
          <h1>CONDITIONS D'UTILISATION</h1>

          <section className="section">
            <h2>ARTICLE 1 - OBJET</h2>
            <div className="content">
              <p>Les présentes conditions d'utilisation régissent l'accès et l'utilisation du site internet kamba-lhains.com exploité par Kamba Lhains.</p>
              <p>L'accès au site implique l'acceptation pleine et entière des présentes conditions d'utilisation.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 2 - ACCÈS AU SITE</h2>
            <div className="content">
              <p>Le site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. Tous les frais supportés par l'utilisateur pour accéder au service (matériel informatique, logiciels, connexion Internet, etc.) sont à sa charge.</p>
              <p>Kamba Lhains met en œuvre tous les moyens raisonnables à sa disposition pour assurer un accès de qualité au site, mais n'est tenu à aucune obligation d'y parvenir.</p>
              <p>Kamba Lhains ne peut être tenu responsable de tout dysfonctionnement du réseau ou des serveurs ou de tout autre événement échappant au contrôle raisonnable qui empêcherait ou dégraderait l'accès au site.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 3 - UTILISATION DU SITE</h2>
            <div className="content">
              <p>L'utilisateur s'engage à utiliser le site de manière loyale et conforme à sa destination.</p>
              <p>Il est notamment interdit :</p>
              <ul>
                <li>D'utiliser le site à des fins commerciales non autorisées</li>
                <li>De reproduire, copier, vendre ou exploiter le contenu du site sans autorisation</li>
                <li>D'effectuer des tentatives d'intrusion ou d'attaque du site</li>
                <li>De diffuser des virus ou tout autre code malveillant</li>
                <li>De collecter des données personnelles d'autres utilisateurs</li>
                <li>D'usurper l'identité d'autrui ou de fournir des informations fausses</li>
                <li>De porter atteinte aux droits de propriété intellectuelle</li>
              </ul>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 4 - CRÉATION DE COMPTE</h2>
            <div className="content">
              <p>La création d'un compte utilisateur peut être nécessaire pour accéder à certains services. L'utilisateur s'engage à fournir des informations exactes et à jour.</p>
              <p>L'utilisateur est responsable de la confidentialité de ses identifiants de connexion et de toutes les activités qui se produisent sous son compte.</p>
              <p>L'utilisateur doit immédiatement informer Kamba Lhains de toute utilisation non autorisée de son compte.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 5 - CONTENU UTILISATEUR</h2>
            <div className="content">
              <p>L'utilisateur peut être amené à publier du contenu (commentaires, avis, photos, etc.). Il reste seul responsable du contenu qu'il publie.</p>
              <p>L'utilisateur garantit qu'il dispose de tous les droits nécessaires sur le contenu qu'il publie et qu'il ne porte atteinte à aucun droit de tiers.</p>
              <p>Kamba Lhains se réserve le droit de modérer, modifier ou supprimer tout contenu qui ne respecterait pas les présentes conditions ou la législation en vigueur.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 6 - PROPRIÉTÉ INTELLECTUELLE</h2>
            <div className="content">
              <p>Le site et son contenu (textes, images, sons, vidéos, logiciels, etc.) sont protégés par les droits de propriété intellectuelle.</p>
              <p>Toute reproduction, représentation, modification, publication ou transmission du contenu du site, en tout ou partie, sans l'autorisation écrite préalable de Kamba Lhains est strictement interdite.</p>
              <p>L'utilisateur peut utiliser le site uniquement pour ses besoins personnels et non commerciaux.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 7 - LIENS HYPERTEXTES</h2>
            <div className="content">
              <p>Le site peut contenir des liens vers d'autres sites internet. Ces liens sont fournis uniquement pour la commodité de l'utilisateur.</p>
              <p>Kamba Lhains n'exerce aucun contrôle sur ces sites externes et décline toute responsabilité quant à leur contenu.</p>
              <p>La création de liens vers le site de Kamba Lhains est autorisée sous réserve qu'ils ne portent pas atteinte à l'image de la société.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 8 - DISPONIBILITÉ DU SITE</h2>
            <div className="content">
              <p>Kamba Lhains s'efforce de maintenir le site accessible 24h/24 et 7j/7, mais ne peut garantir une disponibilité permanente.</p>
              <p>Le site peut être temporairement inaccessible pour des raisons de maintenance, de mise à jour ou de dysfonctionnement technique.</p>
              <p>Kamba Lhains se réserve le droit d'interrompre, de suspendre momentanément ou de modifier sans préavis l'accès à tout ou partie du site.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 9 - RESPONSABILITÉ</h2>
            <div className="content">
              <p>L'utilisation du site se fait aux risques et périls de l'utilisateur.</p>
              <p>Kamba Lhains ne peut être tenu responsable des dommages directs ou indirects causés au matériel de l'utilisateur lors de l'accès au site.</p>
              <p>Kamba Lhains ne peut être tenu responsable des préjudices indirects tels que perte de marchés ou perte de chances consécutifs à l'utilisation du site.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 10 - SUSPENSION ET RÉSILIATION</h2>
            <div className="content">
              <p>Kamba Lhains se réserve le droit de suspendre ou de résilier l'accès au site de tout utilisateur qui ne respecterait pas les présentes conditions d'utilisation.</p>
              <p>Cette suspension ou résiliation peut intervenir sans préavis ni indemnité.</p>
              <p>L'utilisateur peut également résilier son compte à tout moment en nous contactant.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 11 - MODIFICATION DES CONDITIONS</h2>
            <div className="content">
              <p>Kamba Lhains se réserve le droit de modifier à tout moment les présentes conditions d'utilisation.</p>
              <p>Les conditions modifiées prennent effet dès leur publication sur le site. Il appartient à l'utilisateur de consulter régulièrement ces conditions.</p>
              <p>L'utilisation continue du site après modification vaut acceptation des nouvelles conditions.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 12 - DROIT APPLICABLE ET JURIDICTION</h2>
            <div className="content">
              <p>Les présentes conditions d'utilisation sont régies par le droit français.</p>
              <p>En cas de litige, les parties s'efforceront de trouver une solution amiable. À défaut, les tribunaux français seront seuls compétents.</p>
            </div>
          </section>

          <section className="section">
            <h2>ARTICLE 13 - CONTACT</h2>
            <div className="content">
              <p>Pour toute question relative aux présentes conditions d'utilisation, vous pouvez nous contacter :</p>
              <ul>
                <li><strong>Formulaire de contact :</strong> <a href="/contact" style={{ color: '#333', textDecoration: 'underline' }}>Contactez-nous</a></li>
                <li><strong>Adresse :</strong> 229 rue Saint-Honoré, 75001 Paris, France</li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .conditions-utilisation {
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
          .conditions-utilisation {
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