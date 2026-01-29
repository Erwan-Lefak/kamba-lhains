import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';

const VideoHero = ({ videoSrc = 'https://res.cloudinary.com/diibzuu9j/video/upload/f_mp4,vc_h264/v1761667241/Kambaween_rotation_rvbeqq.mp4' }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPoster, setShowPoster] = useState(false);

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
    // Ne pas afficher le poster au chargement
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

  // Create a white placeholder SVG that will match video dimensions
  const whitePosterDataUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='100%25' height='100%25' fill='%23ffffff'/%3E%3C/svg%3E";

  return (
    <div className={`${styles.videoContainer} ${isFullscreen ? styles.fullscreen : ''}`}>
      {showPoster && (
        <Image width={600} height={750} src={whitePosterDataUrl}
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
        preload="auto"
        poster={whitePosterDataUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onLoadStart={handleLoadStart}
        onPlaying={handlePlaying}
        style={{ opacity: showPoster ? 0 : 1 }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      
      {/* Sticky Text for Shadow Burst */}
      <div className={styles.stickyTextContainer}>
        <div className={styles.stickyText}>SHADOW BURST</div>
      </div>
      <div className={styles.stickyTextContainer}>
        <div className={styles.stickyText} id="nouvelle-collection-phase1">SHADOW BURST</div>
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
            <Image width={600} height={750} src="https://www.jacquemus.com/on/demandware.static/Sites-Jacquemus-Site/-/default/dw74ee98d3/images/sound.svg" 
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