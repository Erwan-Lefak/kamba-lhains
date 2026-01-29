import Head from 'next/head';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import styles from '../../styles/HomePage.module.css';
import { useLanguage } from '../../contexts/LanguageContext';

export default function KambaversCharte() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [showCollectionsSubmenu, setShowCollectionsSubmenu] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <>
      <Head>
        <title>{t('kambavers.charte.metaTitle')}</title>
        <meta name="description" content={t('kambavers.charte.metaDescription')} />
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
                  {t('kambavers.menu.brand')}
                </button>
              </li>
              <li>
                <button className="active">
                  {t('kambavers.menu.values')}
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
          {/* Section 1 - Notre Charte Introduction - comme 1ère section marque */}
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
                {t('kambavers.charte.title')}
              </h1>
              <p className={styles.collectionDescription}>
                {t('kambavers.charte.intro')}
              </p>
            </div>
            
            <div className={styles.mediaSection}>
              <div className={styles.imageContainer}>
                <Image
                  src="/images/valeur2.jpg?v=2"
                  alt={t('kambavers.charte.imageAlt1')}
                  width={1200}
                  height={800}
                  className={styles.collectionImage}
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </div>
            </div>
          </section>

          {/* Section 2 - Détails de nos valeurs - comme 2ème section marque */}
          <section className={styles.twoProductsSection}>
            <div className={styles.twoProductsGrid}>
              <div className={styles.simpleProductSlot}>
                <Image
                  src="/images/valeur1.jpg?v=2"
                  alt={t('kambavers.charte.imageAlt2')}
                  width={1200}
                  height={800}
                  className={styles.collectionImage}
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className={styles.textZone}>
                <div className="charte-details">
                  <h3 className="section-title">{t('kambavers.charte.section1Title')}</h3>
                  <p className={styles.textZoneContent}>{t('kambavers.charte.section1Intro')}</p>
                  <ul className="charte-list">
                    {t('kambavers.charte.section1Items').map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  <h3 className="section-title">{t('kambavers.charte.section2Title')}</h3>
                  <p className={styles.textZoneContent}>
                    {t('kambavers.charte.section2Intro')}
                  </p>
                  <ul className="charte-list">
                    {t('kambavers.charte.section2Items').map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  <h3 className="section-title">{t('kambavers.charte.section3Title')}</h3>
                  <p className={styles.textZoneContent}>
                    {t('kambavers.charte.section3Intro')}
                  </p>
                  <ul className="charte-list">
                    {t('kambavers.charte.section3Items').map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  <h3 className="section-title">{t('kambavers.charte.section4Title')}</h3>
                  <p className={styles.textZoneContent}>
                    {t('kambavers.charte.section4Intro')}
                  </p>
                  <ul className="charte-list">
                    {t('kambavers.charte.section4Items').map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  <h3 className="section-title">{t('kambavers.charte.section5Title')}</h3>
                  <p className={styles.textZoneContent}>{t('kambavers.charte.section5Intro')}</p>
                  <ul className="charte-list">
                    {t('kambavers.charte.section5Items').map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  <div className="conclusion">
                    <p className={styles.textZoneContent} style={{ fontStyle: 'italic', marginTop: '30px' }}>
                      {t('kambavers.charte.conclusion')}
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

        /* Styles spécifiques pour la charte */
        .charte-details {
          width: 100%;
          height: 30vh;
          overflow-y: auto;
          padding: 20px 0;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }

        .charte-details::-webkit-scrollbar {
          display: none; /* WebKit */
        }

        .charte-details .textZoneContent,
        .charte-details p,
        .charte-details * {
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
          font-weight: 600;
          color: #000;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 25px auto 10px auto;
          text-align: justify;
          max-width: 400px;
          word-spacing: 0.5px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .charte-list {
          list-style: none;
          margin: 0 0 20px 0;
          padding: 0;
        }

        .charte-list li {
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          font-size: 11px;
          line-height: 1.8;
          color: #000;
          font-weight: 300;
          text-align: justify;
          margin: 8px auto;
          padding-left: 15px;
          position: relative;
          max-width: 400px;
          word-spacing: 0.5px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .charte-list li:before {
          content: '•';
          color: #000;
          font-weight: bold;
          position: absolute;
          left: 0;
        }

        .conclusion {
          border-top: 1px solid #e5e5e5;
          padding-top: 30px;
          margin-top: 30px;
        }

        .charte-image {
          width: 100%;
          height: auto;
          object-fit: contain;
          object-position: center;
          display: block;
        }

        /* Section charte avec scroll indépendant */
        .charte-section {
          width: 100%;
          height: auto;
          display: flex;
          margin: 120px 0 0 0;
          padding: 0;
        }

        .charte-grid {
          width: 100%;
          display: flex;
          height: auto;
        }

        .charte-grid {
          width: 100%;
          display: flex;
          height: auto;
        }

        .charte-image-slot {
          flex: 1;
          height: auto;
          position: sticky;
          top: 0;
          overflow: hidden;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .charte-text-zone {
          flex: 1;
          height: 70vh;
          overflow-y: auto;
          padding: 40px;
          background: white;
        }

        @media (max-width: 1024px) {
          .sidebar-menu {
            width: 200px;
          }

          .main-content.with-sidebar {
            margin-left: 200px;
          }

          .sidebar-nav {
            padding: 30px 0;
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
            border-right: none;
            border-bottom: 1px solid #e5e7eb;
            z-index: 1100;
            transition: none;
            transform: translateX(-100%);
          }

          .sidebar-menu.visible {
            transform: translateX(0);
          }

          .menu-toggle {
            top: 90px;
            left: 15px;
            z-index: 1101;
          }

          .sidebar-nav {
            padding-top: 120px;
          }

          .sidebar-nav button {
            padding: 20px 30px;
            padding-left: 30px !important;
            font-size: 11px;
            font-weight: 400;
            text-align: left;
            border-bottom: none;
            border-right: 1px solid #f5f5f5;
          }

          .sidebar-nav li:last-child button {
            border-right: none;
          }

          .submenu {
            display: none;
          }

          .main-content {
            margin-left: 0 !important;
            padding-top: 80px;
          }
        }

        @media (max-width: 480px) {
          .sidebar-nav button {
            padding: 12px 5px;
            font-size: 11px;
            font-weight: 400;
          }
        }
      `}</style>
    </>
  );
}