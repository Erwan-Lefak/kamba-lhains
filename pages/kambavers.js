import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Kambavers() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [visibleImages, setVisibleImages] = useState(new Set());
  const observer = useRef();

  // Collection images for masonry layout
  const collectionImages = [
    { src: '/blazer-amara.png', id: 1, height: 400 },
    { src: '/veste-jane.png', id: 2, height: 500 },
    { src: '/bombers-itoua.png', id: 3, height: 350 },
    { src: '/jupe-bine.png', id: 4, height: 450 },
    { src: '/chemise-ngozi.png', id: 5, height: 380 },
    { src: '/pantalon-koffi.png', id: 6, height: 420 },
    { src: '/veste-kmobou.png', id: 7, height: 390 },
    { src: '/chemise-uriel.png', id: 8, height: 460 },
    { src: '/blazer-amara.png', id: 9, height: 340 },
    { src: '/veste-jane.png', id: 10, height: 480 },
    { src: '/bombers-itoua.png', id: 11, height: 360 },
    { src: '/jupe-bine.png', id: 12, height: 440 }
  ];

  useEffect(() => {
    // Open menu automatically when page loads (no animation)
    setIsMenuOpen(true);
  }, []);

  useEffect(() => {
    // Intersection Observer for image animations
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleImages(prev => new Set([...prev, parseInt(entry.target.dataset.id)]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Observe all collection images when collections section is active
    if (activeSection === 'collections') {
      const images = document.querySelectorAll('.collection-image');
      images.forEach(img => {
        if (observer.current) {
          observer.current.observe(img);
        }
      });
    }
  }, [activeSection]);

  const handleMenuClick = (section) => {
    setActiveSection(section);
    if (section === 'collections') {
      setVisibleImages(new Set()); // Reset visible images
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'collections':
        return (
          <div className="collections-content">
            <div className="masonry-grid">
              {collectionImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`collection-image ${visibleImages.has(image.id) ? 'visible' : ''}`}
                  data-id={image.id}
                  style={{ height: `${image.height}px` }}
                >
                  <img src={image.src} alt={`Collection ${image.id}`} />
                </div>
              ))}
            </div>
          </div>
        );
      case 'marque':
        return (
          <div className="marque-content">
            <div className="content-text">
              <h2>La Marque</h2>
              <p>KAMBA LHAINS incarne l'excellence de la mode africaine contemporaine, alliant tradition et modernité dans chaque création.</p>
              <p>Notre vision est de révolutionner l'industrie de la mode en proposant des pièces uniques qui célèbrent l'héritage culturel africain tout en s'adaptant aux codes de la mode internationale.</p>
            </div>
          </div>
        );
      case 'boutiques':
        return (
          <div className="boutiques-content">
            <div className="content-text">
              <h2>Nos Boutiques</h2>
              <div className="boutique-item">
                <h3>Paris - George V</h3>
                <p>21 avenue George V<br />75008 Paris</p>
                <p>+33 1 58 30 03 84</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="image-container">
            <div className="image-half">
              <img 
                src="/blazer-amara.png" 
                alt="Kambavers Collection 1"
                className="main-image"
              />
            </div>
            <div className="image-half">
              <img 
                src="/veste-jane.png" 
                alt="Kambavers Collection 2"
                className="main-image"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Head>
        <title>Kambavers - Kamba Lhains</title>
        <meta name="description" content="Découvrez l'univers Kambavers de Kamba Lhains" />
      </Head>

      <Header />

      <main className="kambavers-page">
        {/* Sliding Menu */}
        <div className={`sliding-menu ${isMenuOpen ? 'open' : ''}`}>
          <nav className="menu-nav">
            <ul>
              <li>
                <button 
                  onClick={() => handleMenuClick('collections')}
                  className={activeSection === 'collections' ? 'active' : ''}
                >
                  Collections
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleMenuClick('marque')}
                  className={activeSection === 'marque' ? 'active' : ''}
                >
                  La Marque
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleMenuClick('boutiques')}
                  className={activeSection === 'boutiques' ? 'active' : ''}
                >
                  Boutiques
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="content-area">
          {renderContent()}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .kambavers-page {
          padding-top: 0;
          min-height: 100vh;
          position: relative;
          background: #fafafa;
          overflow-x: hidden;
        }

        .sliding-menu {
          position: fixed;
          top: 79px;
          left: 0;
          width: 300px;
          height: calc(100vh - 79px);
          background: white;
          z-index: 1001;
        }

        .menu-nav {
          padding: 60px 40px;
        }

        .menu-nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .menu-nav li {
          margin-bottom: 40px;
        }

        .menu-nav button {
          background: none;
          border: none;
          color: #333;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          transition: color 0.3s ease;
          display: block;
          padding: 10px 0;
          cursor: pointer;
          font-family: inherit;
        }

        .menu-nav button:hover,
        .menu-nav button.active {
          color: #666;
        }

        .content-area {
          margin-left: 300px;
          margin-top: 80px;
          min-height: calc(100vh - 80px);
        }

        .image-container {
          display: flex;
          height: calc(100vh - 80px);
          padding: 0;
          gap: 0;
          align-items: stretch;
        }

        .image-half {
          flex: 1;
          height: 100%;
          overflow: hidden;
        }

        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Collections Content */
        .collections-content {
          padding: 40px;
          height: calc(100vh - 80px);
          overflow-y: auto;
        }

        .masonry-grid {
          columns: 3;
          column-gap: 0;
          column-fill: auto;
        }

        .collection-image {
          break-inside: avoid;
          margin-bottom: 0;
          opacity: 0;
          filter: blur(10px);
          transform: translateY(20px);
          transition: all 0.8s ease-out;
          overflow: hidden;
        }

        .collection-image.visible {
          opacity: 1;
          filter: blur(0);
          transform: translateY(0);
        }

        .collection-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }

        .collection-image:hover img {
          transform: scale(1.02);
        }

        /* Other content sections */
        .marque-content,
        .boutiques-content {
          padding: 40px;
          height: calc(100vh - 80px);
          overflow-y: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .content-text {
          max-width: 600px;
          text-align: center;
        }

        .content-text h2 {
          font-size: 2.5rem;
          font-weight: 300;
          color: #333;
          margin-bottom: 2rem;
          letter-spacing: 1px;
        }

        .content-text p {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #666;
          margin-bottom: 1.5rem;
        }

        .boutique-item {
          margin-top: 3rem;
          padding: 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .boutique-item h3 {
          font-size: 1.3rem;
          color: #333;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        @media (max-width: 1024px) {
          .sliding-menu {
            width: 250px;
          }

          .content-area {
            margin-left: 250px;
          }

          .masonry-grid {
            columns: 2;
          }

          .collections-content {
            padding: 30px 20px;
          }
        }

        @media (max-width: 768px) {
          .sliding-menu {
            width: 100vw;
          }

          .content-area {
            margin-left: 0;
          }

          .masonry-grid {
            columns: 1;
          }

          .image-container {
            flex-direction: column;
            padding: 20px;
            gap: 20px;
            height: auto;
            min-height: calc(100vh - 80px);
          }

          .image-half {
            height: 50vh;
            min-height: 300px;
          }

          .menu-nav {
            padding: 60px 40px;
            text-align: center;
          }

          .menu-nav li {
            margin-bottom: 50px;
          }

          .menu-nav button {
            font-size: 16px;
          }

          .collections-content,
          .marque-content,
          .boutiques-content {
            padding: 20px;
          }

          .content-text h2 {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .image-container {
            padding: 15px;
          }

          .image-half {
            height: 40vh;
            min-height: 250px;
          }

          .collections-content {
            padding: 15px;
          }
        }
      `}</style>
    </>
  );
}