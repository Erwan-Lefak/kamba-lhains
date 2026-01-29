import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '../styles/MaintenanceOverlay.module.css';

export default function MaintenanceOverlay() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Forcer le démarrage de la vidéo sur mobile
    if (videoRef.current) {
      // S'assurer que la vidéo est bien en mute
      videoRef.current.muted = true;
      videoRef.current.setAttribute('muted', '');
      videoRef.current.setAttribute('playsinline', '');

      videoRef.current.play().catch((error) => {
        console.log('Autoplay prevented:', error);
      });
    }
  }, []);

  return (
    <div className={styles.overlay}>
      {/* Vidéo en arrière-plan */}
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="https://res.cloudinary.com/diibzuu9j/video/upload/f_mp4,vc_h264/v1761667241/Kambaween_rotation_rvbeqq.mp4" type="video/mp4" />
        <source src="https://res.cloudinary.com/diibzuu9j/video/upload/f_webm/v1761667241/Kambaween_rotation_rvbeqq.webm" type="video/webm" />
      </video>

      {/* Overlay sombre pour contraste */}
      <div className={styles.darkOverlay}></div>

      {/* Logo en haut à gauche */}
      <div className={styles.logoContainer}>
        <Image width={600} height={750} src="/images/products/logo.jpg"
          alt="KAMBA LHAINS"
          className={styles.logo}
        />
      </div>

      {/* Icône Instagram en haut à droite */}
      <a
        href="https://www.instagram.com/kambalhains/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.instagramIcon}
        aria-label="Suivez-nous sur Instagram"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
            fill="white"
          />
        </svg>
      </a>

      {/* Contenu texte */}
      <div className={styles.content}>
        <div className={styles.topText}>
          <p className={styles.nowAvailable}>NOW AVAILABLE</p>
          <p className={styles.at}>AT 7ÈME CIEL</p>
        </div>

        <h1 className={styles.mainTitle}>PRINTEMPS</h1>

        <p className={styles.subtitle}>64 Bd Haussmann, 75009 Paris, France</p>
      </div>
    </div>
  );
}
console.log('Force rebuild');
