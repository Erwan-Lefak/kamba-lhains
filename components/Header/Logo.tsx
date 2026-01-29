import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';

interface LogoProps {
  isScrolled?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isScrolled = false }) => {
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

  // On mobile, always show black logo
  const shouldShowBlackLogo = isMobile || isScrolled;

  return (
    <div className={styles.logoSection}>
      <Link href="/" className={styles.logo}>
        <Image
          src={shouldShowBlackLogo
            ? "https://res.cloudinary.com/diibzuu9j/image/upload/v1765047411/kamba-images/kamba-images/logo-scrolled.png"
            : "https://res.cloudinary.com/diibzuu9j/image/upload/v1765047412/kamba-images/kamba-images/logo-transparent.jpg"}
          alt="KAMBA LHAINS"
          width={150}
          height={40}
          className={styles.logoImage}
          priority
        />
      </Link>
    </div>
  );
};

export default Logo;