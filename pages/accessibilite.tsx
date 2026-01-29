import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Accessibilite() {
  return (
    <>
      <Head>
        <title>Accessibilité - Kamba Lhains</title>
        <meta name="description" content="Déclaration d'accessibilité du site Kamba Lhains - Engagement envers l'accessibilité numérique." />
      </Head>

      <Header />

      <main className="accessibilite">
        <div className="container">
          <h1>DÉCLARATION D'ACCESSIBILITÉ</h1>

          <section className="section">
            <h2>ENGAGEMENT</h2>
            <div className="content">
              <p>Kamba Lhains s'engage à rendre son site internet accessible conformément à l'article 47 de la loi n° 2005-102 du 11 février 2005.</p>
              <p>Cette déclaration d'accessibilité s'applique au site kamba-lhains.com.</p>
            </div>
          </section>

          <section className="section">
            <h2>ÉTAT DE CONFORMITÉ</h2>
            <div className="content">
              <p>Le site kamba-lhains.com est en conformité partielle avec le Référentiel Général d'Amélioration de l'Accessibilité (RGAA) version 4.1 et les Web Content Accessibility Guidelines (WCAG) 2.1 niveau AA.</p>
              <p>Nous travaillons continuellement à améliorer l'accessibilité de notre site pour tous les utilisateurs.</p>
            </div>
          </section>

          <section className="section">
            <h2>CONTENUS NON ACCESSIBLES</h2>
            <div className="content">
              <p>Malgré notre volonté de rendre ce site accessible à tous, il est possible que certains contenus ne le soient pas encore totalement :</p>
              <ul>
                <li>Certaines images peuvent ne pas avoir de description alternative appropriée</li>
                <li>Quelques vidéos peuvent être dépourvues de sous-titres</li>
                <li>Certains contrastes de couleur peuvent être insuffisants</li>
                <li>La navigation au clavier peut être limitée sur certaines fonctionnalités</li>
              </ul>
            </div>
          </section>

          <section className="section">
            <h2>AMÉLIORATION ET CONTACT</h2>
            <div className="content">
              <p>Si vous rencontrez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une fonctionnalité du site, merci de nous le signaler.</p>
              <p>Si vous n'obtenez pas de réponse rapide de notre part, vous êtes en droit de faire parvenir vos doléances ou demande de saisine au Défenseur des droits.</p>
            </div>
          </section>

          <section className="section">
            <h2>VOIES DE RECOURS</h2>
            <div className="content">
              <p>Cette procédure est à utiliser dans le cas suivant : vous avez signalé au responsable du site internet un défaut d'accessibilité qui vous empêche d'accéder à un contenu ou à l'une des fonctionnalités du site et vous n'avez pas obtenu de réponse satisfaisante.</p>
              <p>Vous pouvez :</p>
              <ul>
                <li>Écrire un message au Défenseur des droits</li>
                <li>Contacter le délégué du Défenseur des droits dans votre région</li>
                <li>Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) : Défenseur des droits, Libre réponse 71120, 75342 Paris CEDEX 07</li>
              </ul>
            </div>
          </section>

          <section className="section">
            <h2>TECHNOLOGIES UTILISÉES</h2>
            <div className="content">
              <p>L'accessibilité de kamba-lhains.com s'appuie sur les technologies suivantes :</p>
              <ul>
                <li>HTML5</li>
                <li>CSS3</li>
                <li>JavaScript</li>
                <li>Next.js</li>
              </ul>
            </div>
          </section>

          <section className="section">
            <h2>ENVIRONNEMENT DE TEST</h2>
            <div className="content">
              <p>Les vérifications de restitution de contenus ont été réalisées sur la base de la combinaison fournie par la base de référence du RGAA, avec les versions suivantes :</p>
              <ul>
                <li>Navigateur Firefox avec lecteur d'écran NVDA</li>
                <li>Navigateur Safari avec lecteur d'écran VoiceOver</li>
                <li>Navigateur Chrome avec lecteur d'écran JAWS</li>
              </ul>
            </div>
          </section>

          <section className="section">
            <h2>OUTILS D'ÉVALUATION</h2>
            <div className="content">
              <p>L'évaluation a été réalisée à l'aide des outils suivants :</p>
              <ul>
                <li>Contrôleur de couleurs</li>
                <li>Extension navigateur axe DevTools</li>
                <li>Extension navigateur WAVE</li>
                <li>Validateur HTML du W3C</li>
                <li>Validateur CSS du W3C</li>
              </ul>
            </div>
          </section>

          <section className="section">
            <h2>ACTIONS MISES EN ŒUVRE</h2>
            <div className="content">
              <p>Pour améliorer l'accessibilité, nous avons mis en place :</p>
              <ul>
                <li>Une structure sémantique HTML appropriée</li>
                <li>Des alternatives textuelles pour les images</li>
                <li>Une navigation au clavier fonctionnelle</li>
                <li>Des contrastes de couleurs suffisants</li>
                <li>Des formulaires avec des labels explicites</li>
                <li>Une taille de police adaptable</li>
              </ul>
            </div>
          </section>

          <section className="section">
            <h2>CONTACT</h2>
            <div className="content">
              <p>Si vous rencontrez des difficultés pour accéder aux informations ou fonctionnalités du site, vous pouvez nous contacter pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme.</p>
              <ul>
                <li><strong>Formulaire de contact :</strong> <a href="/contact" style={{ color: '#333', textDecoration: 'underline' }}>Contactez-nous</a></li>
                <li><strong>Adresse :</strong> 229 rue Saint-Honoré, 75001 Paris, France</li>
              </ul>
            </div>
          </section>

          <section className="section">
            <h2>MISE À JOUR</h2>
            <div className="content">
              <p>Cette déclaration d'accessibilité a été établie le 20 août 2025. Elle sera mise à jour lors de chaque modification significative du site ou lors de la mise en place de nouveaux dispositifs d'accessibilité.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .accessibilite {
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
          .accessibilite {
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