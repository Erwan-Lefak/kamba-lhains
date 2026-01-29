import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MentionsLegales() {
  return (
    <>
      <Head>
        <title>Mentions légales - Kamba Lhains</title>
        <meta name="description" content="Mentions légales du site Kamba Lhains - Informations légales et réglementaires." />
      </Head>

      <Header />

      <main className="mentions-legales">
        <div className="container">
          <h1>MENTIONS LÉGALES</h1>

          <section className="section">
            <h2>IDENTIFICATION DE L'ENTREPRISE</h2>
            <div className="content">
              <p><strong>Dénomination :</strong> Kamba Lhains</p>
              <p><strong>Forme juridique :</strong> Affaire personnelle</p>
              <p><strong>Dirigeant :</strong> Obel Franck</p>
              <p><strong>Adresse du siège social :</strong><br />
                229 rue Saint-Honoré<br />
                75001 Paris, France</p>
              <p><strong>SIREN :</strong> 987 663 424</p>
              <p><strong>SIRET :</strong> 987 663 424 00016</p>
              <p><strong>Code NAF/APE :</strong> 4791B - Vente à distance sur catalogue spécialisé</p>
              <p><strong>N° TVA intracommunautaire :</strong> FR57987663424</p>
              <p><strong>RCS :</strong> Paris 987 663 424</p>
              <p><strong>Date de création :</strong> 20 mars 2024</p>
            </div>
          </section>

          <section className="section">
            <h2>CONTACT</h2>
            <div className="content">
              <p><strong>Formulaire de contact :</strong> <a href="/contact" style={{ color: '#333', textDecoration: 'underline' }}>Contactez-nous</a></p>
              <p><strong>Site internet :</strong> kamba-lhains.com</p>
            </div>
          </section>

          <section className="section">
            <h2>RESPONSABLE DE LA PUBLICATION</h2>
            <div className="content">
              <p>Le responsable de la publication est Monsieur Obel Franck en sa qualité de dirigeant de l'entreprise.</p>
            </div>
          </section>

          <section className="section">
            <h2>HÉBERGEMENT</h2>
            <div className="content">
              <p><strong>Hébergeur :</strong> Vercel Inc.</p>
              <p><strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
              <p><strong>Site web :</strong> vercel.com</p>
            </div>
          </section>

          <section className="section">
            <h2>PROPRIÉTÉ INTELLECTUELLE</h2>
            <div className="content">
              <p>L'ensemble des contenus présents sur ce site (textes, images, graphismes, logo, icônes, sons, logiciels, etc.) sont la propriété exclusive de Kamba Lhains, à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs.</p>
              <p>Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Kamba Lhains.</p>
            </div>
          </section>

          <section className="section">
            <h2>LIMITATION DE RESPONSABILITÉ</h2>
            <div className="content">
              <p>Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement remis à jour, mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes.</p>
              <p>Si vous constatiez une lacune, erreur ou ce qui paraît être un dysfonctionnement, merci de bien vouloir le signaler via notre formulaire de contact en décrivant le problème de la manière la plus précise possible.</p>
            </div>
          </section>

          <section className="section">
            <h2>DROIT APPLICABLE</h2>
            <div className="content">
              <p>Tant le présent site que les modalités et conditions de son utilisation sont régis par le droit français, quel que soit le lieu d'utilisation. En cas de contestation éventuelle, et après l'échec de toute tentative de recherche d'une solution amiable, les tribunaux français seront seuls compétents pour connaître de ce litige.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .mentions-legales {
          min-height: 100vh;
          padding: calc(var(--header-height) + 20px) 0 50px;
          background: #ffffff;
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

        .content p strong {
          font-weight: 500;
          color: #333;
        }

        @media (max-width: 768px) {
          .mentions-legales {
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

          .content p {
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