import { useRef, useEffect, useState } from 'react';
import styles from './Hero.module.css';

const VideoHero = ({ videoSrc = '/ACCUEIL.mp4' }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, []);

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
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
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
    <div className={styles.videoContainer}>
      <video
        ref={videoRef}
        className={styles.heroVideo}
        muted={isMuted}
        loop
        playsInline
        autoPlay
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      
      <div className={styles.videoControls}>
        <button 
          className={styles.playButton}
          onClick={handlePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
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
            ⏭
          </button>
          
          <button 
            className={styles.fullscreenButton}
            onClick={handleFullscreen}
            aria-label="Plein écran"
          >
            ⛶
          </button>
          
          <button 
            className={styles.muteButton}
            onClick={handleMute}
            aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? (
              <div className={styles.mutedIcon}>🔇</div>
            ) : (
              <div className={styles.soundIcon}>
                <img src="/sound.svg" alt="Sound" width="24" height="24" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoHero;