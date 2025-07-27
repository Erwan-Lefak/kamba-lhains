import Head from 'next/head';
import Image from 'next/image';
import React, { useRef, useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import MobileCarousel from '../components/MobileCarousel';
import { featuredProducts } from '../data/products';
import styles from '../styles/HomePage.module.css';

// Force Vercel cache invalidation 
export default function Kambavers() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPoster, setShowPoster] = useState(true);
  const [activeCategory, setActiveCategory] = useState('collections');
  const [activeSubCategory, setActiveSubCategory] = useState('eclat-ombre');
  const [showCollectionsSubmenu, setShowCollectionsSubmenu] = useState(true);

  // Handle navigation from URL or external links
  useEffect(() => {
    // Check if we're coming from the main navigation
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    const subcategory = urlParams.get('subcategory');
    
    if (section === 'collections' || !section) {
      setActiveCategory('collections');
      setActiveSubCategory(subcategory || 'eclat-ombre');
      setShowCollectionsSubmenu(true);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(console.error);
    }
  }, []);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSkip = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime += 5;
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setShowPoster(false);
  };

  const handleLoadStart = () => {
    setShowPoster(true);
  };

  const handlePlaying = () => {
    setShowPoster(false);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (video) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      video.currentTime = newTime;
    }
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Single product with 3 collection images for carousel
  const singleProductWithImages = {
    ...featuredProducts[0],
    images: [
      '/images/collection/IMG_3031.jpeg',
      '/images/collection/IMG_3033.jpeg',
      '/images/collection/IMG_3034.jpeg'
    ]
  };

  // Single product with OTA BENGA collection images for carousel
  const otaBengaProductWithImages = {
    ...featuredProducts[0],
    images: [
      '/images/collection/wetransfer_img_2800-jpeg_2025-07-25_1347/IMG_2800.jpeg',
      '/images/collection/wetransfer_img_2800-jpeg_2025-07-25_1347/IMG_3060.jpeg',
      '/images/collection/wetransfer_img_2800-jpeg_2025-07-25_1347/IMG_3118.jpeg',
      '/images/collection/wetransfer_img_2800-jpeg_2025-07-25_1347/IMG_3119.jpeg',
      '/images/collection/wetransfer_img_2800-jpeg_2025-07-25_1347/IMG_3120.jpeg'
    ]
  };

  return (
    <>
      <Head>
        <title>Kambavers - Kamba Lhains</title>
        <meta name="description" content="Découvrez l'univers Kambavers - Pièces exclusives alliant élégance et modernité." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="kambavers-page">
        {/* Menu latéral gauche */}
        <div className="sidebar-menu">
          <nav className="sidebar-nav">
            <ul>
              <li>
                <button 
                  onClick={() => {
                    setActiveCategory('collections');
                    setShowCollectionsSubmenu(!showCollectionsSubmenu);
                  }}
                  className={activeCategory === 'collections' ? 'active' : ''}
                >
                  COLLECTIONS
                </button>
                {activeCategory === 'collections' && showCollectionsSubmenu && (
                  <ul className="submenu">
                    <li>
                      <button 
                        onClick={() => {
                          setActiveSubCategory('eclat-ombre');
                          // This is already the current page content, no navigation needed
                        }}
                        className={`submenu-item ${activeSubCategory === 'eclat-ombre' ? 'active' : ''}`}
                      >
                        ÉCLAT D'OMBRE
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => setActiveSubCategory('ota-benga')}
                        className={`submenu-item ${activeSubCategory === 'ota-benga' ? 'active' : ''}`}
                      >
                        OTA BENGA - Acte 1
                      </button>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <button 
                  onClick={() => setActiveCategory('marque')}
                  className={activeCategory === 'marque' ? 'active' : ''}
                >
                  LA MARQUE
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveCategory('boutiques')}
                  className={activeCategory === 'boutiques' ? 'active' : ''}
                >
                  BOUTIQUES
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Contenu principal */}
        <div className="main-content">
          {/* Contenu conditionnel selon la sous-catégorie */}
          {activeCategory === 'collections' && activeSubCategory === 'eclat-ombre' && (
            <>
            <section className={styles.newCollectionSection}>
            <div className={styles.textSection}>
              <h1 
                style={{ 
                  fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#000000',
                  textShadow: 'none',
                  boxShadow: 'none',
                  textTransform: 'uppercase',
                  marginBottom: '15px',
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                "ÉCLAT D'OMBRE"
              </h1>
              <p className={styles.collectionDescription}>
                Une exploration subtile entre lumière et obscurité, où chaque pièce révèle l'élégance dans sa forme la plus pure. Cette collection capsule transcende les codes traditionnels pour offrir une garde-robe intemporelle, pensée pour la femme moderne qui cultive l'art de la sophistication discrète.
              </p>
            </div>
            
            <div className={styles.mediaSection}>
              <div className={`${styles.videoContainer} ${isFullscreen ? styles.fullscreen : ''}`}>
                {showPoster && (
                  <img
                    src="/images/ui/video-poster.jpg"
                    alt="Video loading"
                    className={styles.videoPoster}
                  />
                )}
                <video
                  ref={videoRef}
                  className={styles.collectionVideo}
                  muted={isMuted}
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onCanPlay={handleCanPlay}
                  onLoadStart={handleLoadStart}
                  onPlaying={handlePlaying}
                  style={{ opacity: showPoster ? 0 : 1 }}
                >
                  <source src="/collec.mov" type="video/quicktime" />
                  <source src="/collec.mov" type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
                
                <div className={styles.videoControls}>
                  <button 
                    className={styles.playButton}
                    onClick={handlePlayPause}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none">
                        <rect x="8" y="4" width="2" height="16"></rect>
                        <rect x="14" y="4" width="2" height="16"></rect>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5,3 19,12 5,21"></polygon>
                      </svg>
                    )}
                  </button>
                  
                  <div 
                    className={styles.timeline}
                    onClick={handleTimelineClick}
                  >
                    <div 
                      className={styles.timelineProgress}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  
                  <div className={styles.rightControls}>
                    <button 
                      className={styles.skipButton}
                      onClick={handleSkip}
                      aria-label="Avancer de 5 secondes"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5,4 15,12 5,20"></polygon>
                        <line x1="19" y1="5" x2="19" y2="19"></line>
                      </svg>
                    </button>
                    
                    <button 
                      className={styles.fullscreenButton}
                      onClick={handleFullscreen}
                      aria-label="Plein écran"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                      </svg>
                    </button>
                    
                    <button 
                      className={styles.muteButton}
                      onClick={handleMute}
                      aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
                    >
                      <img 
                        src="https://www.jacquemus.com/on/demandware.static/Sites-Jacquemus-Site/-/default/dw74ee98d3/images/sound.svg" 
                        alt="mute video" 
                        title="mute video" 
                        width="14" 
                        height="14" 
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Two Products Section */}
          <section className={styles.twoProductsSection}>
            <div className={styles.twoProductsGrid}>
              <div className={styles.simpleProductSlot}>
                <ProductCard product={singleProductWithImages} hideInfo={true} noLink={true} />
              </div>
              <div className={styles.textZone}>
                <p className={styles.textZoneContent}>
                  Chaque création de cette collection capsule révèle une recherche permanente de l'équilibre parfait entre tradition et modernité. Les matières nobles côtoient les coupes contemporaines dans une harmonie subtile qui définit l'ADN de la marque.
                </p>
              </div>
            </div>
          </section>

          {/* Look Book Title */}
          <section style={{
            padding: '30px 0',
            textAlign: 'center',
            background: 'white'
          }}>
            <h2 style={{
              fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
              fontSize: '15px',
              fontWeight: 700,
              color: '#000000',
              textShadow: 'none',
              boxShadow: 'none',
              textTransform: 'uppercase',
              marginBottom: '15px',
              textAlign: 'center',
              width: '100%',
              margin: 0
            }}>
              Look Book
            </h2>
          </section>

          {/* Gallery Section - 4x3 Grid */}
          <section className={styles.gallerySection}>
            <div className={styles.galleryGrid}>
              {[
                'IMG_3036.jpeg', 'IMG_3046.jpeg', 'IMG_3047.jpeg', 'IMG_3048.jpeg',
                'IMG_3049.jpeg', 'IMG_3050.jpeg', 'IMG_3051.jpeg', 'IMG_3052.jpeg', 
                'IMG_3054.jpeg', 'IMG_3055.jpeg', 'IMG_3056.jpeg', 'IMG_3057.jpeg'
              ].map((imageName, index) => (
                <div key={index} className={styles.gallerySlot}>
                  <Image 
                    src={`/images/collection/${imageName}`} 
                    alt={`Collection image ${index + 1}`}
                    width={800}
                    height={1200}
                    className={styles.galleryImage}
                    quality={95}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </section>
          </>
          )}
          
          {/* Contenu pour OTA BENGA */}
          {activeCategory === 'collections' && activeSubCategory === 'ota-benga' && (
            <>
            <section className={styles.newCollectionSection}>
            <div className={styles.textSection}>
              <h1 
                style={{ 
                  fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#000000',
                  textShadow: 'none',
                  boxShadow: 'none',
                  textTransform: 'uppercase',
                  marginBottom: '15px',
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                "OTA BENGA - Acte 1"
              </h1>
              <p className={styles.collectionDescription}>
                Une collection qui rend hommage à l'héritage africain avec une approche contemporaine. Chaque pièce raconte une histoire, mêlant traditions ancestrales et modernité urbaine dans un dialogue créatif unique qui célèbre l'identité et l'authenticité.
              </p>
            </div>
            
            <div className={styles.mediaSection}>
              <div className={styles.imageContainer}>
                <Image
                  src="/images/collection/wetransfer_img_2800-jpeg_2025-07-25_1347/IMG_2802.jpeg"
                  alt="OTA BENGA - Acte 1 Collection"
                  width={1200}
                  height={800}
                  className={styles.collectionImage}
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </div>
            </div>
          </section>

          {/* Two Products Section */}
          <section className={styles.twoProductsSection}>
            <div className={styles.twoProductsGrid}>
              <div className={`${styles.simpleProductSlot} ota-benga-carousel`}>
                <ProductCard product={otaBengaProductWithImages} hideInfo={true} noLink={true} />
              </div>
              <div className={styles.textZone}>
                <p className={styles.textZoneContent}>
                  Cette collection puise son inspiration dans les racines profondes de l'Afrique, réinterprétant les codes traditionnels à travers un prisme moderne. Chaque création reflète un héritage culturel riche, sublimé par des techniques artisanales contemporaines.
                </p>
              </div>
            </div>
          </section>

          {/* Look Book Title */}
          <section style={{
            padding: '30px 0',
            textAlign: 'center',
            background: 'white'
          }}>
            <h2 style={{
              fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
              fontSize: '15px',
              fontWeight: 700,
              color: '#000000',
              textShadow: 'none',
              boxShadow: 'none',
              textTransform: 'uppercase',
              marginBottom: '15px',
              textAlign: 'center',
              width: '100%',
              margin: 0
            }}>
              Look Book
            </h2>
          </section>

          {/* Gallery Section - 4x3 Grid */}
          <section className={`${styles.gallerySection} ota-benga-gallery`}>
            <div className={styles.galleryGrid}>
              {[
                'IMG_3036.jpeg', 'IMG_3046.jpeg', 'IMG_3047.jpeg', 'IMG_3048.jpeg',
                'IMG_3049.jpeg', 'IMG_3050.jpeg', 'IMG_3051.jpeg', 'IMG_3052.jpeg', 
                'IMG_3054.jpeg', 'IMG_3055.jpeg', 'IMG_3056.jpeg', 'IMG_3057.jpeg'
              ].map((imageName, index) => (
                <div key={index} className={styles.gallerySlot}>
                  <Image 
                    src={`/images/collection/${imageName}`} 
                    alt={`OTA BENGA collection image ${index + 1}`}
                    width={800}
                    height={1200}
                    className={styles.galleryImage}
                    quality={95}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </section>
          </>
          )}
          
          {/* Autres sections */}
          {activeCategory === 'marque' && (
            <section style={{ padding: '40px', textAlign: 'center' }}>
              <h1>LA MARQUE</h1>
              <p>Informations sur la marque Kamba Lhains...</p>
            </section>
          )}
          
          {activeCategory === 'boutiques' && (
            <section style={{ padding: '40px', textAlign: 'center' }}>
              <h1>BOUTIQUES</h1>
              <p>Nos boutiques et points de vente...</p>
            </section>
          )}
        </div>
      </main>

      <Footer />

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

        .main-content {
          margin-left: 250px;
          flex: 1;
          padding-top: 40px;
        }

        @media (max-width: 1024px) {
          .sidebar-menu {
            width: 200px;
          }

          .main-content {
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
            position: relative;
            width: 100%;
            top: 0;
            height: auto;
            border-right: none;
            border-bottom: 1px solid #e5e7eb;
          }

          .sidebar-nav {
            padding: 20px 0;
          }

          .sidebar-nav ul {
            display: flex;
            justify-content: center;
            gap: 0;
          }

          .sidebar-nav li {
            flex: 1;
          }

          .sidebar-nav button {
            padding: 15px 10px;
            font-size: 11px;
            font-weight: 400;
            text-align: center;
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
            margin-left: 0;
            padding-top: 0;
          }
        }

        @media (max-width: 480px) {
          .sidebar-nav button {
            padding: 12px 5px;
            font-size: 11px;
            font-weight: 400;
          }
        }

        /* Styles spécifiques pour OTA BENGA - flèches blanches */
        :global(.ota-benga-carousel .imageNavButton),
        :global(.ota-benga-carousel .prevButton),
        :global(.ota-benga-carousel .nextButton),
        :global(.ota-benga-gallery .imageNavButton),
        :global(.ota-benga-gallery .prevButton),
        :global(.ota-benga-gallery .nextButton) {
          background-color: rgba(255, 255, 255, 0.9) !important;
          border-radius: 50% !important;
          opacity: 1 !important;
        }

        :global(.ota-benga-carousel .imageNavButton):hover,
        :global(.ota-benga-carousel .prevButton):hover,
        :global(.ota-benga-carousel .nextButton):hover,
        :global(.ota-benga-gallery .imageNavButton):hover,
        :global(.ota-benga-gallery .prevButton):hover,
        :global(.ota-benga-gallery .nextButton):hover {
          background-color: white !important;
          opacity: 1 !important;
        }

        :global(.ota-benga-carousel .imageNavButton svg path),
        :global(.ota-benga-carousel .prevButton svg path),
        :global(.ota-benga-carousel .nextButton svg path),
        :global(.ota-benga-gallery .imageNavButton svg path),
        :global(.ota-benga-gallery .prevButton svg path),
        :global(.ota-benga-gallery .nextButton svg path) {
          stroke: #333 !important;
        }
      `}</style>
    </>
  );
}