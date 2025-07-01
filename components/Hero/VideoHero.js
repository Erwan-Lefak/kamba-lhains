import { useState, useEffect, useRef } from 'react';
import { useInView } from '../../hooks/useInView';
import styles from './Hero.module.css';

const VideoHero = ({ 
  videoSrc = '/0629.mp4',
  posterSrc = '/hero-poster.jpg',
  title,
  subtitle
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef(null);
  const { ref: containerRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Preload video when component mounts or comes into view
  useEffect(() => {
    if (inView && videoRef.current) {
      const video = videoRef.current;
      
      const handleLoadedData = () => {
        setIsVideoReady(true);
        setIsLoaded(true);
      };

      const handleCanPlay = () => {
        video.play().catch(console.error);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('canplay', handleCanPlay);
      
      // Fallback for slower connections
      const timeoutId = setTimeout(() => {
        setIsLoaded(true);
      }, 3000);

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplay', handleCanPlay);
        clearTimeout(timeoutId);
      };
    }
  }, [inView]);

  // Handle reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className={styles.videoContainer}
      role="img"
      aria-label={title || "Hero video presentation"}
    >
      {/* Loading overlay */}
      <div className={`${styles.loadingOverlay} ${isLoaded ? styles.hidden : ''}`}>
        <div className={styles.loadingSpinner} aria-label="Loading video"></div>
      </div>

      {/* Poster image for immediate display */}
      {posterSrc && (
        <img
          src={posterSrc}
          alt={title || "Hero image"}
          className={`${styles.posterImage} ${isVideoReady ? styles.loaded : ''}`}
          loading="eager"
          decoding="async"
        />
      )}

      {/* Main video element */}
      <video
        ref={videoRef}
        className={styles.heroVideo}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex="-1"
      >
        <source src={videoSrc} type="video/mp4" />
        <source src={videoSrc.replace('.mp4', '.webm')} type="video/webm" />
        {/* Fallback for unsupported browsers */}
        <img 
          src={posterSrc} 
          alt={title || "Hero video fallback"} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </video>

      {/* Optional content overlay */}
      {(title || subtitle) && (
        <div className={styles.heroContent}>
          {title && (
            <h1 className={styles.heroTitle}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p className={styles.heroSubtitle}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoHero;