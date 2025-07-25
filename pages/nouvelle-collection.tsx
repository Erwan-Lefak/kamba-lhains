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
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPoster, setShowPoster] = useState(true);


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
      </main>

      <Footer />
    </>
  );
}