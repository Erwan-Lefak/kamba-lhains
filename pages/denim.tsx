import Head from 'next/head';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import MobileCarousel from '../components/MobileCarousel';
import CollectionSidebar from '../components/CollectionSidebar';
import { products } from '../data/products';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/HomePage.module.css';

export default function Denim() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [showHautSubmenu, setShowHautSubmenu] = useState(false);
  const [showBasSubmenu, setShowBasSubmenu] = useState(false);
  const [showAccessoiresSubmenu, setShowAccessoiresSubmenu] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);
  const textZoneRef = useRef<HTMLDivElement>(null);
  const [productHeight, setProductHeight] = useState<number>(0);

  // Observer pour détecter les changements de hauteur du produit
  useEffect(() => {
    const productElement = productRef.current;
    const textElement = textZoneRef.current;

    if (!productElement || !textElement) return;

    const updateHeight = () => {
      const height = productElement.offsetHeight;
      setProductHeight(height);
      textElement.style.height = `${height}px`;
    };

    // Observer les changements de taille
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(productElement);

    // Observer les changements dans le DOM (carrousel)
    const mutationObserver = new MutationObserver(updateHeight);
    mutationObserver.observe(productElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style']
    });

    // Mise à jour initiale
    updateHeight();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // Filtrer tous les produits en denim
  const denimProducts = products.filter(product => {
    return product.subCategory === 'denim';
  });

  // Produit 1957 avec toutes ses images pour le carousel
  const product1957 = denimProducts.find(p => p.id === 'jean-1957');
  const singleProductWithImages = product1957 ? {
    ...product1957,
    images: product1957.images || []
  } : denimProducts[0];

  return (
    <>
      <Head>
        <title>Denim - Kamba Lhains</title>
        <meta name="description" content={t('meta.denim')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="kambavers-page">
        <CollectionSidebar
          collection="denim"
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

        {/* Bouton toggle pour le menu */}
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          onMouseEnter={() => setIsHoveringButton(true)}
          onMouseLeave={() => setIsHoveringButton(false)}
        >
          {isMenuVisible ? (
            // Croix quand le menu est visible
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            // 3 traits quand le menu n'est pas visible
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        {/* Contenu principal */}
        <div className={`main-content ${isMenuVisible ? 'with-sidebar' : 'full-width'}`}>
          {/* Section Introduction Denim */}
          <section className={styles.newCollectionSection}>
            <div className={styles.textSection}>
              <h1
                style={{
                  fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
                  fontSize: '11px',
                  fontWeight: 400,
                  color: '#000000',
                  textShadow: 'none',
                  boxShadow: 'none',
                  textTransform: 'uppercase',
                  marginBottom: '15px',
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                {t('products.breadcrumb.denim')}
              </h1>
              <p className={styles.collectionDescription}>
                {t('collections.denim')}
              </p>
            </div>

            <div className={styles.mediaSection}>
              <div className="denim-images-container">
                <div className="denim-image-wrapper">
                  <Image
                    src="/images/denim-hero-new.jpg?v=2"
                    alt="Denim - Kamba Lhains"
                    width={600}
                    height={800}
                    className={styles.collectionImage}
                    quality={95}
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Two Products Section */}
          <section className={styles.twoProductsSection}>
            <div className={styles.twoProductsGrid}>
              <div className={styles.simpleProductSlot} ref={productRef}>
                <Image
                  src="/images/denim-product.jpg"
                  alt="Denim 1957"
                  width={800}
                  height={1200}
                  className={styles.productImage}
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className={styles.textZone} ref={textZoneRef}>
                <p className={styles.textZoneContent}>
                  {t('collections.denimSection2').split('\n').map((paragraph: string, index: number) => (
                    <React.Fragment key={index}>
                      {paragraph}
                      {index < t('collections.denimSection2').split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
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
              {t('products.page.allProducts')}
            </h2>
          </section>

        {/* Products Grid Section */}
        <section className={styles.threeProductsSection}>
          {/* Desktop Grid */}
          <div className={styles.threeProductsGrid}>
            {denimProducts.map(product => (
              <div key={product.id} className={styles.productSlot}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <MobileCarousel products={denimProducts} />
        </section>
        </div>
      </main>

      <Footer isKambaversPage={true} isMenuVisible={isMenuVisible} />

      <style jsx>{`
        .kambavers-page {
          display: flex;
          min-height: 100vh;
          background: white;
        }

        .sidebar-menu {
          position: fixed;
          left: 0;
          top: 80px;
          width: 250px;
          height: calc(100vh - 80px);
          background: white;
          z-index: 1000;
          overflow-y: auto;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-menu.hidden {
          transform: translateX(-100%);
        }

        .sidebar-menu.visible {
          transform: translateX(0);
        }

        @media (max-width: 768px) {
          .sidebar-menu {
            transition: none;
            transform: translateX(-100%);
          }

          .sidebar-menu.visible {
            transform: translateX(0);
          }
        }

        .sidebar-nav {
          padding: 40px 0;
        }

        .sidebar-nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .sidebar-nav li {
          margin-bottom: 0;
        }

        .sidebar-nav button {
          width: 100%;
          background: none;
          border: none;
          padding: 20px 30px;
          text-align: left;
          font-family: inherit;
          font-size: 11px;
          font-weight: 400;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .sidebar-nav button:hover {
          color: #9f0909;
        }

        .sidebar-nav button.active {
          color: #9f0909;
        }

        .sidebar-title {
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #000000;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 15px 0 20px 30px;
          padding: 0;
        }

        .sidebar-nav .submenu {
          list-style: none !important;
          margin: 0 !important;
          padding: 0 !important;
          padding-left: 35px !important;
        }

        .sidebar-nav .submenu li {
          margin-bottom: 0 !important;
        }

        .sidebar-nav .submenu-item {
          width: 100% !important;
          background: none !important;
          border: none !important;
          padding: 10px 20px !important;
          text-align: left !important;
          font-family: inherit !important;
          font-size: 8px !important;
          font-weight: 400 !important;
          color: #666 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          cursor: pointer !important;
          transition: color 0.3s ease !important;
        }

        .sidebar-nav .submenu-item:hover {
          color: #9f0909 !important;
        }

        .sidebar-nav .submenu-item.active {
          color: #9f0909 !important;
        }

        .menu-toggle {
          position: fixed;
          top: 90px;
          left: 136px;
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
        }

        .main-content.full-width {
          margin-left: 0;
        }

        .main-content.with-sidebar {
          margin-left: 250px;
        }

        @media (max-width: 1024px) {
          .sidebar-menu {
            width: 200px;
          }

          .main-content.with-sidebar {
            margin-left: 200px;
          }

          .sidebar-nav button {
            padding: 16px 20px;
            font-size: 11px;
            font-weight: 400;
          }

          .submenu-item {
            padding: 12px 20px;
            font-size: 8px;
          }
        }

        .denim-images-container {
          display: flex;
          gap: 20px;
          width: 100%;
          height: 100%;
        }

        .denim-image-wrapper {
          flex: 1;
          height: 100%;
          overflow: hidden;
        }

        .denim-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        @media (max-width: 768px) {
          .sidebar-menu {
            width: 280px;
            top: 80px;
            height: calc(100vh - 80px);
            z-index: 1100;
            padding-top: 0;
          }

          .sidebar-title {
            margin-top: 300px !important;
          }

          .menu-toggle {
            top: 90px;
            left: 15px;
          }

          .main-content {
            margin-left: 0 !important;
            padding-top: 80px;
          }

          .denim-images-container {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </>
  );
}
