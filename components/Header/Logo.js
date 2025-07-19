import Link from 'next/link';
import styles from './Header.module.css';

const Logo = () => {
  return (
    <div className={styles.logoSection}>
      <Link href="/" className={styles.logo}>
        <img 
          src="/images/products/logo.png" 
          alt="KAMBA LHAINS" 
          className={styles.logoImage}
        />
      </Link>
    </div>
  );
};

export default Logo;