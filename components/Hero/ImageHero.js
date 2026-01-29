import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Hero.module.css';

const ImageHero = ({ imageSrc = '/images/hero-shooting.jpg' }) => {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on mount
    checkMobile();

    // Add event listener for resize
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Split tagline into lines for <br />
  const taglineLines = t('hero.tagline').split('\n');

  // Use different image on mobile
  const heroImageSrc = isMobile ? '/images/hero-mobile.jpg' : imageSrc;

  return (
    <Link href="/zenith" className={styles.imageContainer}>
      <Image
        src={heroImageSrc}
        alt="Kamba Lhains Collection"
        fill
        className={styles.heroImage}
        priority
        quality={100}
        sizes="100vw"
        style={{ objectFit: 'cover' }}
        unoptimized={isMobile}
      />

      {/* Sticky Text */}
      <div className={styles.stickyTextContainer}>
        <div className={styles.stickyText}>
          {taglineLines.map((line, index) => (
            <span key={index}>
              {line}
              {index < taglineLines.length - 1 && <br />}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.stickyTextContainer}>
        <div className={styles.stickyText} id="nouvelle-collection-phase1">
          {taglineLines.map((line, index) => (
            <span key={index}>
              {line}
              {index < taglineLines.length - 1 && <br />}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ImageHero;
