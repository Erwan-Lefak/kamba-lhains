import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useHeader } from '../../contexts/HeaderContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useCart } from '../../contexts/CartContext';
import Logo from './Logo';
import Navigation from './Navigation';
import UserActions from './UserActions';
import MobileMenu from './MobileMenu';
import SearchDropdown from './SearchDropdown';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  const { isMenuOpen, toggleMenu, isScrolled, isSearchOpen, toggleSearch, closeAllMenus } = useHeader();
  const { favorites } = useFavorites();
  const { getTotalItems } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  // Animation states pour les compteurs mobiles du header
  const [cartPulse, setCartPulse] = useState(false);
  const [favoritesPulse, setFavoritesPulse] = useState(false);
  const prevCartCount = useRef<number>(getTotalItems());
  const prevFavoritesCount = useRef<number>(favorites.length);
  const isFirstRender = useRef(true);

  const currentCartCount = getTotalItems();
  const currentFavoritesCount = favorites.length;

  const isTransparent = isHomePage && !isScrolled && !isHovered;

  // Détecter les changements du panier
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (currentCartCount > prevCartCount.current) {
      console.log('🛒 Header Mobile - Animation panier déclenchée:', prevCartCount.current, '->', currentCartCount);
      setCartPulse(true);
      const timer = setTimeout(() => setCartPulse(false), 1000);
      return () => clearTimeout(timer);
    }
    prevCartCount.current = currentCartCount;
  }, [currentCartCount]);

  // Détecter les changements des favoris
  useEffect(() => {
    if (currentFavoritesCount > prevFavoritesCount.current) {
      console.log('❤️ Header Mobile - Animation favoris déclenchée:', prevFavoritesCount.current, '->', currentFavoritesCount);
      setFavoritesPulse(true);
      const timer = setTimeout(() => setFavoritesPulse(false), 1000);
      return () => clearTimeout(timer);
    }
    prevFavoritesCount.current = currentFavoritesCount;
  }, [currentFavoritesCount]);

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ''} ${!isTransparent ? styles.opaque : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.container}>
        <div className={`${styles.headerContent} ${isMenuOpen ? styles.menuOpen : ''}`}>
          <Logo isScrolled={!isTransparent} />
          <Navigation />
          <UserActions />

          {/* Mobile Actions */}
          <div className={styles.mobileActions}>
            {!isMenuOpen && (
              <>
                {/* Search Button */}
                <button className={styles.mobileActionButton} aria-label="Rechercher" onClick={toggleSearch}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </button>

                {/* Favorites Button */}
                <Link href="/favoris" className={styles.mobileActionButton} aria-label="Favoris">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {favorites.length > 0 && (
                    <span className={`${styles.mobileCartCount} ${favoritesPulse ? styles.pulse : ''}`}>{favorites.length}</span>
                  )}
                </Link>

                {/* Cart Button */}
                <Link href="/panier" className={styles.mobileActionButton} aria-label="Panier">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 01-8 0"></path>
                  </svg>
                  {getTotalItems() > 0 && (
                    <span className={`${styles.mobileCartCount} ${cartPulse ? styles.pulse : ''}`}>{getTotalItems()}</span>
                  )}
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button 
              className={`${styles.mobileMenuButton} ${isMenuOpen ? styles.closeButton : ''}`}
              onClick={(e) => toggleMenu(e)}
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : '☰'}
            </button>
          </div>
        </div>
        
        <MobileMenu isOpen={isMenuOpen} onClose={closeAllMenus} />
      </div>

      {/* Search Dropdown */}
      <SearchDropdown isOpen={isSearchOpen} onClose={toggleSearch} />
    </header>
  );
};

export default Header;