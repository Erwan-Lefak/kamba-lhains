import { useHeader } from '../../hooks/useHeader';
import Logo from './Logo';
import Navigation from './Navigation';
import UserActions from './UserActions';
import MobileMenu from './MobileMenu';
import styles from './Header.module.css';

const Header = () => {
  const { isMenuOpen, toggleMenu } = useHeader();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <Logo />
          <Navigation />
          <UserActions />
          
          {/* Mobile Menu Button */}
          <button 
            className={styles.mobileMenuButton}
            onClick={toggleMenu}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
        
        <MobileMenu isOpen={isMenuOpen} />
      </div>
    </header>
  );
};

export default Header;