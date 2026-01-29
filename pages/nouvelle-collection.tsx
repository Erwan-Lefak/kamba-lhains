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
export default function NouvelleCollection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const textZoneRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPoster, setShowPoster] = useState(true);
  const [productHeight, setProductHeight] = useState<number>(0);


  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(console.error);
    }
  }, []);

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

  // Create a white placeholder SVG that will match video dimensions
  const whitePosterDataUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='100%25' height='100%25' fill='%23ffffff'/%3E%3C/svg%3E";

  // Single product with 10 collection images for carousel
  const singleProductWithImages = {
    ...featuredProducts[0],
    images: [
      '/images/shadow-burst/DSC_1950-Modifier-2.jpg',
      '/images/shadow-burst/DSC_1970-Modifier.jpg',
      '/images/shadow-burst/DSC_1984.jpg',
      '/images/shadow-burst/DSC_2126-Modifier-2.jpg',
      '/images/shadow-burst/DSC_2037-Modifier.jpg',
      '/images/shadow-burst/DSC_2019-Modifier-Modifier.jpg',
      '/images/shadow-burst/DSC_1998-Modifier-2.jpg',
      '/images/shadow-burst/DSC_2021.jpg',
      '/images/shadow-burst/DSC_2144.jpg',
      '/images/shadow-burst/DSC_2149-Modifier-Modifier.jpg'
    ]
  };

  return (
    <>
      <Head>
        <title>Nouvelle Collection - Kamba Lhains</title>
        <meta name="description" content="Découvrez notre nouvelle collection - Pièces exclusives alliant élégance et modernité." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main style={{ paddingTop: '34px' }}>
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
                marginBottom: '5px',
                textAlign: 'center',
                width: '100%'
              }}
            >
              "Shadow Burst - Act I"
            </h1>
            <h2
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
              Mist
            </h2>
            <p className={styles.collectionDescription}>
              Une exploration subtile entre lumière et obscurité, où chaque pièce révèle l'élégance dans sa forme la plus pure. Cette collection capsule transcende les codes traditionnels pour offrir une garde-robe intemporelle, pensée pour la femme moderne qui cultive l'art de la sophistication discrète.
            </p>
          </div>
          
          <div className={styles.mediaSection}>
            <div className={`${styles.videoContainer} ${isFullscreen ? styles.fullscreen : ''}`}>
              {showPoster && (
                <Image width={600} height={750} src={whitePosterDataUrl}
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
                poster={whitePosterDataUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onCanPlay={handleCanPlay}
                onLoadStart={handleLoadStart}
                onPlaying={handlePlaying}
                style={{ opacity: showPoster ? 0 : 1 }}
              >
                <source src="https://res.cloudinary.com/diibzuu9j/video/upload/v1761859556/WhatsApp_Vid%C3%A9o_2025-10-30_%C3%A0_22.12.39_4548f635_m274wh.mp4" type="video/mp4" />
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
                    <Image src="https://www.jacquemus.com/on/demandware.static/Sites-Jacquemus-Site/-/default/dw74ee98d3/images/sound.svg"
                      alt="mute video"
                      title="mute video"
                      width={14}
                      height={14}
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
            <div className={`${styles.simpleProductSlot} nouvelle-collection-carousel`} ref={productRef}>
              <ProductCard product={singleProductWithImages} hideInfo={true} noLink={true} />
            </div>
            <div className={styles.textZone} ref={textZoneRef}>
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
      </main>

      <Footer />
    </>
  );
}