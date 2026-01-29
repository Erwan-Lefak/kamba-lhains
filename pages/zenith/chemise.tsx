import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import MobileCarousel from '../../components/MobileCarousel';
import CollectionSidebar from '../../components/CollectionSidebar';
import { products } from '../../data/products';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from '../../styles/HomePage.module.css';

export default function ZenithChemise() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [showHautSubmenu, setShowHautSubmenu] = useState(true);
  const [showBasSubmenu, setShowBasSubmenu] = useState(false);
  const [showAccessoiresSubmenu, setShowAccessoiresSubmenu] = useState(false);

  useEffect(() => {
    setIsMenuVisible(false);
  }, []);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // Filtrer les produits chemise
  const chemiseProducts = products.filter(product => {
    return product.id === '7' || product.id === '7-ml' || product.id === 'surchemise-grand-boubou';
  });

  return (
    <>
      <Head>
        <title>Chemise - Kamba Lhains</title>
        <meta name="description" content={t('meta.veste')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="kambavers-page">
        <CollectionSidebar
          collection="zenith"
          currentPage="chemise"
          isMenuVisible={isMenuVisible}
          isHoveringMenu={isHoveringMenu}
          showHautSubmenu={showHautSubmenu}
          showBasSubmenu={showBasSubmenu}
          showAccessoiresSubmenu={showAccessoiresSubmenu}
          setShowHautSubmenu={setShowHautSubmenu}
          setShowBasSubmenu={setShowBasSubmenu}
          setShowAccessoiresSubmenu={setShowAccessoiresSubmenu}
          setIsHoveringMenu={setIsHoveringMenu}
        />

        <button
          className="menu-toggle"
          onClick={toggleMenu}
          onMouseEnter={() => setIsHoveringButton(true)}
          onMouseLeave={() => setIsHoveringButton(false)}
        >
          {isMenuVisible ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        <div className={`main-content ${isMenuVisible ? 'with-sidebar' : 'full-width'}`}>
          {/* Image Section */}
          <section className={styles.newCollectionSection}>
            <div className={styles.mediaSection} style={{ width: '100%' }}>
              <div className="zenith-images-container">
                <div className="zenith-image-wrapper">
                  <Image
                    src="/images/zenith-chemise-hero-1.jpg?v=2"
                    alt="Collection Zénith Chemise - Kamba Lhains"
                    width={1200}
                    height={800}
                    className={styles.collectionImage}
                    quality={95}
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Collection Title */}
          <section style={{
            padding: '60px 0',
            textAlign: 'center',
            background: 'white'
          }}>
            <h2 style={{
              fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
              fontSize: '11px',
              fontWeight: 400,
              color: '#000000',
              textShadow: 'none',
              boxShadow: 'none',
              textTransform: 'uppercase',
              marginBottom: '15px',
              textAlign: 'center',
              width: '100%',
              margin: 0
            }}>
              Tous les articles
            </h2>
          </section>

          {/* Products Grid Section */}
          <section className={styles.threeProductsSection}>
            {/* Desktop Grid */}
            <div className={styles.threeProductsGrid}>
              {chemiseProducts.map(product => (
                <div key={product.id} className={styles.productSlot}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Mobile Carousel */}
            <MobileCarousel products={chemiseProducts} />
          </section>
        </div>
      </main>

      <Footer isKambaversPage={true} isMenuVisible={isMenuVisible} />

      <style jsx>{`
        .kambavers-page {
          display: flex;
          min-height: 100vh;
          background: white;
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
        }

        .menu-toggle {
          position: fixed;
          top: 90px;
          left: 20px;
          z-index: 1001;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border: none;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .menu-toggle svg {
          color: #000000;
          transition: color 0.3s ease;
        }

        .menu-toggle:hover svg {
          color: #9f0909;
        }

        .menu-toggle:hover svg line {
          stroke: #9f0909;
        }

        .main-content {
          margin-left: 250px;
          flex: 1;
          padding-top: 40px;
          transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }

        .main-content.full-width {
          margin-left: 0;
        }

        .main-content.with-sidebar {
          margin-left: 250px;
        }

        .zenith-images-container {
          display: flex;
          gap: 20px;
          width: 100%;
          height: 100%;
          max-width: 100%;
        }

        .zenith-image-wrapper {
          flex: 1;
          height: 100%;
          overflow: hidden;
          max-width: 100%;
        }

        .zenith-image-wrapper img {
          width: 100% !important;
          height: auto !important;
          max-width: 100% !important;
          object-fit: cover;
          object-position: center;
        }

        @media (max-width: 1024px) {
          .main-content.with-sidebar {
            margin-left: 200px;
          }
        }

        @media (max-width: 768px) {
          .kambavers-page {
            overflow-x: hidden;
            max-width: 100vw;
          }

          .menu-toggle {
            top: 90px;
            left: 15px;
          }

          .main-content {
            margin-left: 0 !important;
            padding-top: 80px;
            width: 100vw !important;
            max-width: 100vw !important;
            padding-left: 0;
            padding-right: 0;
            overflow-x: hidden;
          }

          .main-content > * {
            max-width: 100vw;
            overflow-x: hidden;
          }

          .zenith-images-container {
            flex-direction: column;
            gap: 10px;
            width: 100%;
            max-width: 100vw;
          }

          .zenith-image-wrapper {
            width: 100%;
            max-width: 100%;
            height: auto;
          }

          .zenith-image-wrapper img {
            width: 100% !important;
            height: auto !important;
            max-width: 100% !important;
            object-fit: contain;
            object-position: center top;
          }
        }
      `}</style>
    </>
  );
}
