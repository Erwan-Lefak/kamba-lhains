import { useRef, useEffect, useState } from 'react';
import styles from './Hero.module.css';

const VideoHero = ({ videoSrc = '/ACCUEIL.mp4' }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPoster, setShowPoster] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, []);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscKey = (event) => {
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
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 5;
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
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

  const handleTimelineClick = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      videoRef.current.currentTime = newTime;
    }
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
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
        className={styles.heroVideo}
        muted={isMuted}
        loop
        playsInline
        autoPlay
        preload="metadata"
        poster="/images/ui/video-poster.jpg"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onLoadStart={handleLoadStart}
        onPlaying={handlePlaying}
        style={{ opacity: showPoster ? 0 : 1 }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      
      {/* Sticky Text for Nouvelle Collection */}
      <div className={styles.stickyTextContainer}>
        <div className={styles.stickyText}>NOUVELLE COLLECTION</div>
      </div>
      <div className={styles.stickyTextContainer}>
        <div className={styles.stickyText} id="nouvelle-collection-phase1">NOUVELLE COLLECTION</div>
      </div>
      
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
  );
};

export default VideoHero;