import Head from 'next/head';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import MobileCarousel from '../components/MobileCarousel';
import { products } from '../data/products';
import styles from '../styles/HomePage.module.css';

export default function Ceinture() {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [showHautSubmenu, setShowHautSubmenu] = useState(false);
  const [showBasSubmenu, setShowBasSubmenu] = useState(false);
  const [showAccessoiresSubmenu, setShowAccessoiresSubmenu] = useState(true);

  // Cacher le menu immédiatement quand on arrive sur la page
  useEffect(() => {
    setIsMenuVisible(false);
  }, []);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // Filtrer les produits contenant "ceinture" ou "belt" dans le nom ou la description
  const ceintureProducts = products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes('ceinture') || 
                     product.name.toLowerCase().includes('belt');
    const descriptionMatch = Array.isArray(product.description) 
      ? product.description.some(desc => 
          desc.toLowerCase().includes('ceinture') || 
          desc.toLowerCase().includes('belt')
        )
      : product.description.toLowerCase().includes('ceinture') || 
        product.description.toLowerCase().includes('belt');
    return nameMatch || descriptionMatch;
  });

  return (
    <>
      <Head>
        <title>Ceinture - Kamba Lhains</title>
        <meta name="description" content="Découvrez notre sélection de Ceintures - Finition parfaite et style assuré." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="kambavers-page">
        {/* Menu latéral gauche */}
        <div 
          className={`sidebar-menu ${isMenuVisible ? 'visible' : 'hidden'}`}
          onMouseEnter={() => setIsHoveringMenu(true)}
          onMouseLeave={() => setIsHoveringMenu(false)}
        >
          <nav className="sidebar-nav">
            <h3 className="sidebar-title">Catégorie</h3>
            <ul>
              <li>
                <button>
                  TOUS
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setShowHautSubmenu(!showHautSubmenu);
                  }}
                >
                  HAUT
                </button>
                {showHautSubmenu && (
                  <ul className="submenu">
                    <li><button onClick={() => router.push('/t-shirt')} className="submenu-item">T-SHIRT</button></li>
                    <li><button onClick={() => router.push('/chemise')} className="submenu-item">CHEMISE</button></li>
                    <li><button onClick={() => router.push('/sweat-shirt')} className="submenu-item">SWEAT-SHIRT</button></li>
                    <li><button onClick={() => router.push('/veste-en-jeans')} className="submenu-item">VESTE EN JEANS</button></li>
                  </ul>
                )}
              </li>
              <li>
                <button 
                  onClick={() => {
                    setShowBasSubmenu(!showBasSubmenu);
                  }}
                >
                  BAS
                </button>
                {showBasSubmenu && (
                  <ul className="submenu">
                    <li><button onClick={() => router.push('/denim')} className="submenu-item">DENIM</button></li>
                    <li><button onClick={() => router.push('/sweatpants')} className="submenu-item">SWEATPANTS</button></li>
                    <li><button onClick={() => router.push('/baggy-jeans')} className="submenu-item">BAGGY JEANS</button></li>
                    <li><button onClick={() => router.push('/short')} className="submenu-item">SHORT</button></li>
                    <li><button onClick={() => router.push('/pantalon-cargo')} className="submenu-item">PANTALON CARGO</button></li>
                    <li><button onClick={() => router.push('/underwear')} className="submenu-item">SOUS-VÊTEMENTS</button></li>
                  </ul>
                )}
              </li>
              <li>
                <button 
                  onClick={() => {
                    setShowAccessoiresSubmenu(!showAccessoiresSubmenu);
                  }}
                  className="active"
                >
                  ACCESSOIRES
                </button>
                {showAccessoiresSubmenu && (
                  <ul className="submenu">
                    <li><button onClick={() => router.push('/bonnet')} className="submenu-item">BONNET</button></li>
                    <li><button onClick={() => router.push('/casquette')} className="submenu-item">CASQUETTE</button></li>
                    <li><button onClick={() => router.push('/chapeau')} className="submenu-item">CHAPEAU</button></li>
                    <li><button onClick={() => router.push('/sac')} className="submenu-item">SAC</button></li>
                    <li><button onClick={() => router.push('/ceinture')} className="submenu-item active">CEINTURE</button></li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </div>

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

          {/* Collection Title */}
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
              Ceinture
            </h2>
          </section>

          {/* Gallery Section - 2x4 Grid */}
          <section className={styles.gallerySection}>
            <div className={styles.galleryGrid}>
              {[
                'IMG_3036.jpeg', 'IMG_3046.jpeg', 'IMG_3047.jpeg', 'IMG_3048.jpeg',
                'IMG_3049.jpeg', 'IMG_3050.jpeg', 'IMG_3051.jpeg', 'IMG_3052.jpeg'
              ].map((imageName, index) => (
                <div key={index} className={styles.gallerySlot}>
                  <Image 
                    src={`/images/collection/${imageName}`} 
                    alt={`Ceinture ${index + 1}`}
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

        {/* Three Products Grid Section */}
        <section className={styles.threeProductsSection}>
          {/* Desktop Grid */}
          <div className={styles.threeProductsGrid}>
            {ceintureProducts.length > 0 ? (
              ceintureProducts.map(product => (
                <div key={product.id} className={styles.productSlot}>
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <p>Aucune ceinture disponible pour le moment.</p>
              </div>
            )}
          </div>
          
          {/* Mobile Carousel */}
          {ceintureProducts.length > 0 && <MobileCarousel products={ceintureProducts} />}
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

        @media (max-width: 768px) {
          .sidebar-menu {
            width: 280px;
            top: 0;
            height: 100vh;
          }

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