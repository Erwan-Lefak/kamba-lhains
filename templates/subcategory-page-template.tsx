import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import MobileCarousel from '../../components/MobileCarousel';
import CollectionHeader from '../../components/CollectionHeader';
import CollectionSidebar from '../../components/CollectionSidebar';
import { products } from '../../data/products';
import styles from '../../styles/HomePage.module.css';

export default function {{COLLECTION_TITLE}}{{SUBCATEGORY_TITLE}}() {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [showHautSubmenu, setShowHautSubmenu] = useState({{HAUT_SUBMENU}});
  const [showBasSubmenu, setShowBasSubmenu] = useState({{BAS_SUBMENU}});
  const [showAccessoiresSubmenu, setShowAccessoiresSubmenu] = useState({{ACCESSOIRES_SUBMENU}});

  useEffect(() => {
    setIsMenuVisible(false);
  }, []);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const subcategoryProducts = products.filter(product => {
    const isCollection = product.category === '{{COLLECTION_NAME}}';
    {{PRODUCT_FILTER}}
    return isCollection && (nameMatch || descriptionMatch);
  });

  return (
    <>
      <Head>
        <title>{{SUBCATEGORY_DISPLAY}} {{COLLECTION_NAME}} - Kamba Lhains</title>
        <meta name="description" content="Découvrez nos {{SUBCATEGORY_DISPLAY}} {{COLLECTION_NAME}} - {{META_DESCRIPTION}}" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="kambavers-page">
        <CollectionSidebar
          collection="{{COLLECTION_KEY}}"
          currentPage="{{SUBCATEGORY_KEY}}"
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
          {/* 1ère section: Collection Header (titre + description + image) */}
          <CollectionHeader collection="{{COLLECTION_KEY}}" />

          {/* 2ème section: Titre de la sous-catégorie */}
          <section style={{
            padding: '30px 0',
            textAlign: 'center',
            background: 'white'
          }}>
            <h2 style={{
              fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
              fontSize: '15px',
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
              {{SUBCATEGORY_DISPLAY}} {{COLLECTION_NAME}}
            </h2>
          </section>

          {/* 3ème section: Galerie photo 4x2 */}
          <section className={styles.gallerySection}>
            <div className={styles.galleryGrid}>
              {{{GALLERY_IMAGES}}.map((imageName, index) => (
                <div key={index} className={styles.gallerySlot}>
                  <Image 
                    src={`/images/collection/${imageName}`} 
                    alt={`{{SUBCATEGORY_DISPLAY}} {{COLLECTION_NAME}} ${index + 1}`}
                    width={400}
                    height={600}
                    className={styles.galleryImage}
                    quality={90}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Section produits (optionnelle) */}
          <section className={styles.threeProductsSection}>
            <div className={styles.threeProductsGrid}>
              {subcategoryProducts.length > 0 ? (
                subcategoryProducts.map(product => (
                  <div key={product.id} className={styles.productSlot}>
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                  <p>Aucun produit {{SUBCATEGORY_DISPLAY}} {{COLLECTION_NAME}} disponible pour le moment.</p>
                </div>
              )}
            </div>
            
            {subcategoryProducts.length > 0 && <MobileCarousel products={subcategoryProducts} />}
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
        }

        .main-content.full-width {
          margin-left: 0;
        }

        .main-content.with-sidebar {
          margin-left: 250px;
        }

        @media (max-width: 1024px) {
          .main-content.with-sidebar {
            margin-left: 200px;
          }
        }

        @media (max-width: 768px) {
          .menu-toggle {
            top: 20px;
            left: 20px;
          }

          .main-content {
            margin-left: 0 !important;
            padding-top: 80px;
          }
        }
      `}</style>
    </>
  );
}