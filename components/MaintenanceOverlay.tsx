import { useEffect, useState } from 'react';
import styles from '../styles/MaintenanceOverlay.module.css';

export default function MaintenanceOverlay() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in au chargement
    setIsVisible(true);
  }, []);

  return (
    <div className={`${styles.overlay} ${isVisible ? styles.visible : ''}`}>
      {/* Vidéo en arrière-plan */}
      <video
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="https://res.cloudinary.com/diibzuu9j/video/upload/v1761667241/Kambaween_rotation_rvbeqq.mov" type="video/mp4" />
      </video>

      {/* Overlay sombre pour contraste */}
      <div className={styles.darkOverlay}></div>

      {/* Logo en haut à gauche avec lien Instagram */}
      <a
        href="https://www.instagram.com/kambalhains/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.logoLink}
        aria-label="Suivez-nous sur Instagram"
      >
        <img
          src="/images/products/logo.png"
          alt="KAMBA LHAINS"
          className={styles.logo}
        />
      </a>

      {/* Contenu texte */}
      <div className={styles.content}>
        <div className={styles.topText}>
          <p className={styles.nowAvailable}>NOW AVAILABLE</p>
          <p className={styles.at}>AT 7EME CIEL</p>
        </div>

        <h1 className={styles.mainTitle}>PRINTEMPS</h1>

        <p className={styles.subtitle}>64 Bd Haussmann, 75009 Paris, France</p>
      </div>
    </div>
  );
}
console.log('Force rebuild');
