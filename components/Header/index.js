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
        <div className={`${styles.headerContent} ${isMenuOpen ? styles.menuOpen : ''}`}>
          <Logo />
          <Navigation />
          <UserActions />
          
          {/* Mobile Actions */}
          <div className={styles.mobileActions}>
            {!isMenuOpen && (
              <>
                {/* Search Button */}
                <button className={styles.mobileActionButton} aria-label="Rechercher">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </button>

                {/* Cart Button */}
                <button className={styles.mobileActionButton} aria-label="Panier">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 01-8 0"></path>
                  </svg>
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button 
              className={`${styles.mobileMenuButton} ${isMenuOpen ? styles.closeButton : ''}`}
              onClick={(e) => toggleMenu(e)}
              aria-label="Menu"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
        
        <MobileMenu isOpen={isMenuOpen} />
      </div>
    </header>
  );
};

export default Header;