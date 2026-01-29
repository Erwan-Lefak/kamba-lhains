import Head from 'next/head';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  return (
    <>
      <Head>
        <title>Notre Histoire - Kamba Lhains</title>
        <meta name="description" content="Découvrez l'histoire de Kamba Lhains, marque de mode alliant tradition artisanale et design contemporain." />
      </Head>

      <Header />

      <main className="about-page">
        <div className="hero-section">
          <div className="hero-content">
            <h1>Notre Histoire</h1>
            <p>L'art ancestral du tissage rencontre l'innovation contemporaine</p>
          </div>
        </div>

        <div className="container">
          <section className="story-section">
            <div className="story-content">
              <div className="story-text">
                <h2>L'Héritage Ancestral</h2>
                <p>
                  KAMBA LHAINS tire ses origines de l'art millénaire du tissage, 
                  une tradition transmise de génération en génération par les artisans 
                  de notre région. Chaque motif, chaque couleur raconte une histoire, 
                  celle d'un peuple et de son héritage culturel.
                </p>
                <p>
                  Notre fondatrice a grandi entourée de ces techniques ancestrales, 
                  observant sa grand-mère tisser avec patience et précision des pièces 
                  uniques qui habillaient toute la famille. C'est cette passion pour 
                  l'artisanat authentique qui a donné naissance à KAMBA LHAINS.
                </p>
              </div>
              <div className="story-image">
                <Image width={600} height={750} src="https://via.placeholder.com/500x400/8B4513/FFFFFF?text=Tissage+Ancestral" 
                  alt="Artisanat traditionnel de tissage" 
                />
              </div>
            </div>
          </section>

          <section className="mission-section">
            <h2>Notre Mission</h2>
            <div className="mission-grid">
              <div className="mission-card">
                <h3>Préserver l'Artisanat</h3>
                <p>
                  Maintenir vivantes les techniques traditionnelles de tissage 
                  en soutenant les artisans locaux et en transmettant leur savoir-faire.
                </p>
              </div>
              <div className="mission-card">
                <h3>Innover avec Respect</h3>
                <p>
                  Créer des designs contemporains qui honorent la tradition 
                  tout en répondant aux attentes de la mode moderne.
                </p>
              </div>
              <div className="mission-card">
                <h3>Commerce Équitable</h3>
                <p>
                  Assurer une rémunération juste aux artisans et contribuer 
                  au développement économique de leur communauté.
                </p>
              </div>
              <div className="mission-card">
                <h3>Durabilité</h3>
                <p>
                  Utiliser des matériaux naturels et des méthodes de production 
                  respectueuses de l'environnement.
                </p>
              </div>
            </div>
          </section>

          <section className="process-section">
            <h2>Notre Processus de Création</h2>
            <div className="process-steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Sélection des Matériaux</h3>
                <p>
                  Nous choisissons avec soin des fibres naturelles de qualité supérieure, 
                  sourced de manière éthique et durable.
                </p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Tissage Artisanal</h3>
                <p>
                  Chaque pièce est tissée à la main par nos artisans partenaires, 
                  selon des techniques transmises depuis des générations.
                </p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Design Contemporain</h3>
                <p>
                  Nos créateurs transforment ces textiles traditionnels en vêtements 
                  modernes adaptés au style de vie d'aujourd'hui.
                </p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h3>Finition Experte</h3>
                <p>
                  Chaque vêtement est soigneusement fini et contrôlé pour garantir 
                  la plus haute qualité.
                </p>
              </div>
            </div>
          </section>

          <section className="team-section">
            <h2>Notre Équipe</h2>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-photo">
                  <Image width={600} height={750} src="https://via.placeholder.com/200x200/8B4513/FFFFFF?text=Fondatrice" 
                    alt="Fondatrice" 
                  />
                </div>
                <h3>Amina Kamba</h3>
                <p className="member-role">Fondatrice & Directrice Créative</p>
                <p>
                  Passionnée d'artisanat depuis l'enfance, Amina a créé KAMBA LHAINS 
                  pour partager la beauté du tissage traditionnel avec le monde.
                </p>
              </div>
              <div className="team-member">
                <div className="member-photo">
                  <Image width={600} height={750} src="https://via.placeholder.com/200x200/8B4513/FFFFFF?text=Artisan" 
                    alt="Maître artisan" 
                  />
                </div>
                <h3>Mamadou Diallo</h3>
                <p className="member-role">Maître Artisan</p>
                <p>
                  Avec plus de 30 ans d'expérience, Mamadou supervise notre atelier 
                  et forme la nouvelle génération d'artisans.
                </p>
              </div>
              <div className="team-member">
                <div className="member-photo">
                  <Image width={600} height={750} src="https://via.placeholder.com/200x200/8B4513/FFFFFF?text=Designer" 
                    alt="Designer" 
                  />
                </div>
                <h3>Sarah Lhains</h3>
                <p className="member-role">Designer en Chef</p>
                <p>
                  Diplômée d'une école de mode parisienne, Sarah apporte son expertise 
                  du design contemporain à nos créations traditionnelles.
                </p>
              </div>
            </div>
          </section>

          <section className="cta-section">
            <h2>Rejoignez Notre Histoire</h2>
            <p>
              Découvrez nos collections et faites partie de cette aventure 
              qui unit tradition et modernité.
            </p>
            <a href="/collections" className="cta-button">
              Découvrir Nos Collections
            </a>
          </section>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .about-page {
          min-height: 100vh;
          padding: calc(var(--header-height) + 20px) 0 50px;
        }

        .hero-section {
          background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), 
                      url('https://via.placeholder.com/1920x400/8B4513/FFFFFF?text=Notre+Histoire');
          background-size: cover;
          background-position: center;
          padding: 6rem 0;
          text-align: center;
          color: white;
        }

        .hero-content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 300;
          letter-spacing: 2px;
        }

        .hero-content p {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .story-section {
          padding: 5rem 0;
        }

        .story-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .story-text h2 {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          color: #333;
          font-weight: 300;
        }

        .story-text p {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #666;
          margin-bottom: 1.5rem;
        }

        .story-image img {
          width: 100%;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .mission-section {
          padding: 5rem 0;
          background: white;
          margin: 0 -20px;
          padding-left: 20px;
          padding-right: 20px;
        }

        .mission-section h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #333;
          font-weight: 300;
        }

        .mission-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .mission-card {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          text-align: center;
        }

        .mission-card h3 {
          color: #8B4513;
          margin-bottom: 1rem;
          font-size: 1.3rem;
        }

        .mission-card p {
          color: #666;
          line-height: 1.6;
        }

        .process-section {
          padding: 5rem 0;
        }

        .process-section h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #333;
          font-weight: 300;
        }

        .process-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .step {
          text-align: center;
          position: relative;
        }

        .step-number {
          width: 60px;
          height: 60px;
          background: #8B4513;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0 auto 1rem;
        }

        .step h3 {
          color: #333;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .step p {
          color: #666;
          line-height: 1.6;
        }

        .team-section {
          padding: 5rem 0;
          background: white;
          margin: 0 -20px;
          padding-left: 20px;
          padding-right: 20px;
        }

        .team-section h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #333;
          font-weight: 300;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .team-member {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          text-align: center;
        }

        .member-photo {
          margin-bottom: 1.5rem;
        }

        .member-photo img {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
        }

        .team-member h3 {
          color: #333;
          margin-bottom: 0.5rem;
          font-size: 1.3rem;
        }

        .member-role {
          color: #8B4513;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .team-member p:last-child {
          color: #666;
          line-height: 1.6;
        }

        .cta-section {
          padding: 5rem 0;
          text-align: center;
        }

        .cta-section h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #333;
          font-weight: 300;
        }

        .cta-section p {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-button {
          background: #8B4513;
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 5px;
          font-size: 1.1rem;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s;
          font-weight: 500;
        }

        .cta-button:hover {
          background: #654321;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .story-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .mission-grid,
          .process-steps,
          .team-grid {
            grid-template-columns: 1fr;
          }

          .hero-content h1 {
            font-size: 2rem;
          }

          .story-text h2,
          .mission-section h2,
          .process-section h2,
          .team-section h2,
          .cta-section h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  );
}