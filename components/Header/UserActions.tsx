import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHeader } from '../../hooks/useHeader';
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
  const { isLanguageOpen, toggleLanguage } = useHeader();
  const { getTotalItems } = useCart();
  const { favorites } = useFavorites();

  const languages: LanguageOption[] = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' }
  ];

  return (
    <div className={styles.actionsSection}>
      {/* Search Button */}
      <button className={styles.actionButton} aria-label="Rechercher">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </button>

      {/* Language Selector */}
      <div className={styles.languageSelector} onClick={toggleLanguage} data-language-selector>
        <span>{currentLanguage.toUpperCase()}</span>
        {isLanguageOpen && (
          <div className={styles.languageDropdown}>
            {languages.map((lang) => (
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
          </div>
        )}
      </div>

      {/* User Account Button */}
      <Link href="/connexion" className={styles.actionButton} aria-label="Compte utilisateur">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </Link>

      {/* Favorites Button */}
      <Link href="/favoris" className={styles.actionButton} aria-label="Favoris">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        {favorites.length > 0 && (
          <span className={styles.cartCount}>{favorites.length}</span>
        )}
      </Link>

      {/* Cart Button */}
      <Link href="/panier" className={styles.actionButton} aria-label="Panier">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {getTotalItems() > 0 && (
          <span className={styles.cartCount}>{getTotalItems()}</span>
        )}
      </Link>
    </div>
  );
};

export default UserActions;