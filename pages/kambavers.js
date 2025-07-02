import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Kambavers() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Open menu automatically when page loads
    const timer = setTimeout(() => {
      setIsMenuOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Kambavers - KAMBA LHAINS</title>
        <meta name="description" content="Découvrez l'univers Kambavers de KAMBA LHAINS" />
      </Head>

      <Header />

      <main className="kambavers-page">
        {/* Sliding Menu */}
        <div className={`sliding-menu ${isMenuOpen ? 'open' : ''}`}>
          <nav className="menu-nav">
            <ul>
              <li><a href="/collections">Collections</a></li>
              <li><a href="/about">La Marque</a></li>
              <li><a href="/boutique">Boutiques</a></li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="content-area">
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
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .kambavers-page {
          padding-top: 80px;
          min-height: 100vh;
          position: relative;
          background: #fafafa;
          overflow-x: hidden;
        }

        .sliding-menu {
          position: fixed;
          top: 80px;
          left: -300px;
          width: 300px;
          height: calc(100vh - 80px);
          background: white;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          border-right: 1px solid #e0e0e0;
        }

        .sliding-menu.open {
          left: 0;
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

        .menu-nav a {
          text-decoration: none;
          color: #333;
          font-size: 1.5rem;
          font-weight: 300;
          letter-spacing: 1px;
          transition: color 0.3s ease;
          display: block;
          padding: 10px 0;
        }

        .menu-nav a:hover {
          color: #666;
        }

        .content-area {
          margin-left: 0;
          transition: margin-left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: calc(100vh - 80px);
        }

        .sliding-menu.open ~ .content-area {
          margin-left: 300px;
        }

        .image-container {
          display: flex;
          height: calc(100vh - 80px);
          padding: 0 40px;
          gap: 20px;
          align-items: center;
        }

        .image-half {
          flex: 1;
          height: 80%;
          overflow: hidden;
          border-radius: 4px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .main-image:hover {
          transform: scale(1.02);
        }

        @media (max-width: 1024px) {
          .sliding-menu {
            width: 250px;
            left: -250px;
          }

          .sliding-menu.open ~ .content-area {
            margin-left: 250px;
          }

          .image-container {
            padding: 0 20px;
            gap: 15px;
          }

          .menu-nav {
            padding: 40px 30px;
          }

          .menu-nav a {
            font-size: 1.3rem;
          }
        }

        @media (max-width: 768px) {
          .sliding-menu {
            width: 100vw;
            left: -100vw;
          }

          .sliding-menu.open ~ .content-area {
            margin-left: 0;
            opacity: 0.3;
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

          .menu-nav a {
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
        }
      `}</style>
    </>
  );
}