import Head from 'next/head';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from '../../styles/HomePage.module.css';

export default function KambaversBoutiques() {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [showCollectionsSubmenu, setShowCollectionsSubmenu] = useState(false);

  // Cacher le menu immédiatement quand on arrive sur la page
  useEffect(() => {
    setIsMenuVisible(false);
  }, []);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <>
      <Head>
        <title>Boutiques - Kambavers - Kamba Lhains</title>
        <meta name="description" content="Trouvez nos boutiques et points de vente Kambavers - Kamba Lhains." />
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
            <ul>
              <li>
                <button 
                  onClick={() => router.push('/kambavers/marque')}
                >
                  LA MARQUE
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/kambavers/charte')}
                >
                  NOS VALEURS
                </button>
              </li>
              {/* <li>
                <button
                  onClick={() => {
                    setShowCollectionsSubmenu(!showCollectionsSubmenu);
                  }}
                >
                  COLLECTIONS
                </button>
                {showCollectionsSubmenu && (
                  <ul className="submenu">
                    <li>
                      <button
                        onClick={() => router.push('/kambavers/collections/eclat-ombre')}
                        className="submenu-item"
                      >
                        ÉCLAT D'OMBRE
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => router.push('/kambavers/collections/ota-benga')}
                        className="submenu-item"
                      >
                        OTA BENGA - Acte 1
                      </button>
                    </li>
                  </ul>
                )}
              </li> */}
              {/* <li>
                <button
                  onClick={() => router.push('/kambavers/boutiques')}
                  className="active"
                >
                  POINTS DE VENTE
                </button>
              </li> */}
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
          {/* Section 1 - Nos Boutiques Introduction - comme 1ère section charte */}
          <section className={styles.newCollectionSection}>
            <div className={styles.textSection}>
              <h1 
                style={{ 
                  fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
                  fontSize: '11px',
                  fontWeight: 400,
                  color: '#5aac40',
                  textShadow: 'none',
                  boxShadow: 'none',
                  textTransform: 'uppercase',
                  marginBottom: '15px',
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                Fashion Green Room
              </h1>
              <p className={styles.collectionDescription}>
                Kamba Lhains a l'opportunité d'être sélectionné par l'association Fashion Green Hub pour participer à la seconde édition de son concept store Fashion Green Room, installé au Printemps Haussmann.
                <br /><br />
                À partir d'octobre 2025, vous pourrez retrouver nos créations sous le dôme Binet, dans un espace de 37 m² qui met en lumière une sélection de designers et d'artisans engagés, unis par une même vision : celle d'une mode écoresponsable, durable et respectueuse des savoir-faire.
              </p>
            </div>
            
            <div className={styles.mediaSection}>
              <div className={styles.imageContainer}>
                <Image
                  src="/images/map2.jpg"
                  alt="Fashion Green Room - Plan"
                  width={1200}
                  height={800}
                  className={styles.collectionImage}
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </div>
            </div>
          </section>

          {/* Section 2 - Détails des Boutiques */}
          <section className={styles.twoProductsSection}>
            <div className={styles.twoProductsGrid}>
              <div className={styles.simpleProductSlot}>
                <Image
                  src="/images/haussman.jpg"
                  alt="Boutique Haussman - Kamba Lhains"
                  width={1200}
                  height={800}
                  className={styles.collectionImage}
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className={styles.textZone}>
                <div style={{ 
                  width: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-start', 
                  justifyContent: 'center',
                  height: '100%' 
                }}>
                  <h1 
                    style={{ 
                      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
                      fontSize: '11px',
                      fontWeight: 400,
                      color: '#000000',
                      textShadow: 'none',
                      boxShadow: 'none',
                      textTransform: 'uppercase',
                      margin: '0 auto 20px auto',
                      textAlign: 'justify',
                      maxWidth: '260px',
                      marginLeft: 'calc(50% - 130px + 3px)'
                    }}
                  >
                    Points de vente
                  </h1>
                  <div className="boutiques-details">
                    <h3 className="section-title">PRINTEMPS HAUSSEMANN</h3>
                  <p className={styles.textZoneContent}>
                    123 Boulevard Haussmann<br />
                    75008 Paris, France<br />
                    Métro : Havre-Caumartin
                  </p>

                  <h3 className="section-title">FK LE MARAIS</h3>
                  <p className={styles.textZoneContent}>
                    72 Rue de Turenne,<br />
                    75003 Paris, France<br />
                    Métro : Havre-Caumartin
                  </p>
                  </div>
                </div>
              </div>
            </div>
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

        /* Styles spécifiques pour les boutiques */
        .boutiques-details {
          width: 100%;
          height: 30vh;
          overflow-y: auto;
          padding: 20px 0;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }

        .boutiques-details::-webkit-scrollbar {
          display: none; /* WebKit */
        }

        .boutiques-details .textZoneContent,
        .boutiques-details p,
        .boutiques-details * {
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif !important;
          font-size: 11px;
          line-height: 1.8;
          color: #000;
          margin: 0 auto;
          font-weight: 300;
          text-align: justify !important;
          text-justify: inter-word !important;
          max-width: 260px;
          word-spacing: 0.5px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .section-title {
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          font-size: 11px;
          color: #000;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 25px auto 10px auto;
          text-align: justify;
          max-width: 260px;
          word-spacing: 0.5px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .section-title:first-of-type,
        .boutiques-details h3:nth-of-type(3) {
          font-weight: 700;
        }

        .boutiques-details h3:nth-of-type(3) {
          margin-top: 50px;
        }

        .section-title:not(:first-of-type):not(.boutiques-details h3:nth-of-type(3)):not(.boutiques-details h3:nth-of-type(2)):not(.boutiques-details h3:nth-of-type(4)) {
          font-weight: 600;
        }

        .boutiques-details h3:nth-of-type(2),
        .boutiques-details h3:nth-of-type(4) {
          font-weight: 400;
        }

        .main-title {
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #000;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 auto 30px auto;
          text-align: center;
          max-width: 260px;
          word-spacing: 0.5px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @media (max-width: 1024px) {
          .sidebar-menu {
            width: 200px;
          }

          .main-content.with-sidebar {
            margin-left: 200px;
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