import { useRef, useEffect } from 'react';
import styles from './Hero.module.css';

const VideoHero = ({ videoSrc = '/0629.mp4' }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, []);

  return (
    <div className={styles.videoContainer}>
      <video
        ref={videoRef}
        className={styles.heroVideo}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        aria-hidden="true"
        tabIndex="-1"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoHero;