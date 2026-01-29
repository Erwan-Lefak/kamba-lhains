import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHeader } from '../../contexts/HeaderContext';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Language } from '../../utils/translations';
import styles from './Header.module.css';

interface LanguageOption {
  code: Language;
  label: string;
}

const UserActions: React.FC = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const { isLanguageOpen, toggleLanguage, toggleSearch } = useHeader();
  const { getTotalItems } = useCart();
  const { favorites } = useFavorites();
  const languageRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [cartPulse, setCartPulse] = useState(false);
  const [favoritesPulse, setFavoritesPulse] = useState(false);
  const prevCartCount = useRef<number>(getTotalItems());
  const prevFavoritesCount = useRef<number>(favorites.length);
  const isFirstRender = useRef(true);
  const [mounted, setMounted] = useState(false);

  // Stocker les valeurs actuelles dans des variables
  const currentCartCount = getTotalItems();
  const currentFavoritesCount = favorites.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  const languages: LanguageOption[] = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' }
  ];

  // Calculer la position du dropdown quand il s'ouvre
  useEffect(() => {
    if (isLanguageOpen && languageRef.current) {
      const rect = languageRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom - 15,
        left: rect.left - 5
      });
    }
  }, [isLanguageOpen]);

  // Détecter les changements du panier et déclencher l'animation
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (currentCartCount > prevCartCount.current) {
      console.log('🛒 Animation panier déclenchée:', prevCartCount.current, '->', currentCartCount);
      setCartPulse(true);
      const timer = setTimeout(() => setCartPulse(false), 1000);
      return () => clearTimeout(timer);
    }
    prevCartCount.current = currentCartCount;
  }, [currentCartCount]);

  // Détecter les changements des favoris et déclencher l'animation
  useEffect(() => {
    if (currentFavoritesCount > prevFavoritesCount.current) {
      console.log('❤️ Animation favoris déclenchée:', prevFavoritesCount.current, '->', currentFavoritesCount);
      setFavoritesPulse(true);
      const timer = setTimeout(() => setFavoritesPulse(false), 1000);
      return () => clearTimeout(timer);
    }
    prevFavoritesCount.current = currentFavoritesCount;
  }, [currentFavoritesCount]);

  const handleSearchClick = () => {
    console.log('Search button clicked in UserActions');
    toggleSearch();
  };

  // Filtrer pour n'afficher que la langue non sélectionnée
  const availableLanguages = languages.filter(lang => lang.code !== currentLanguage);

  return (
    <div className={styles.actionsSection}>
      {/* Search Button */}
      <button className={styles.actionButton} aria-label={t('header.search')} onClick={handleSearchClick}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </button>

      {/* Language Selector */}
      <div ref={languageRef} className={styles.languageSelector} onClick={toggleLanguage} data-language-selector>
        <span>{currentLanguage.toUpperCase()}</span>
      </div>

      {/* Language Dropdown - rendered in a portal to body */}
      {mounted && isLanguageOpen && ReactDOM.createPortal(
        <div
          className={styles.languageDropdown}
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            zIndex: 999999,
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)'
          }}
        >
          {availableLanguages.map((lang) => (
            <div
              key={lang.code}
              className={styles.languageOption}
              onClick={(e) => {
                e.stopPropagation();
                changeLanguage(lang.code);
                toggleLanguage(e);
              }}
            >
              {lang.label}
            </div>
          ))}
        </div>,
        document.body
      )}

      {/* User Account Button */}
      <Link href="/connexion" className={styles.actionButton} aria-label={t('header.userAccount')}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </Link>

      {/* Favorites Button */}
      <Link href="/favoris" className={styles.actionButton} aria-label={t('header.favorites')}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        {favorites.length > 0 && (
          <span className={`${styles.cartCount} ${favoritesPulse ? styles.pulse : ''}`}>{favorites.length}</span>
        )}
      </Link>

      {/* Cart Button */}
      <Link href="/panier" className={styles.actionButton} aria-label={t('header.cart')}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {getTotalItems() > 0 && (
          <span className={`${styles.cartCount} ${cartPulse ? styles.pulse : ''}`}>{getTotalItems()}</span>
        )}
      </Link>
    </div>
  );
};

export default UserActions;