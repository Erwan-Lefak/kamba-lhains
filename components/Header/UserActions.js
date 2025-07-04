import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHeader } from '../../hooks/useHeader';
import { useCart } from '../../contexts/CartContext';
import styles from './Header.module.css';

const UserActions = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const { isLanguageOpen, toggleLanguage } = useHeader();
  const { getTotalItems } = useCart();

  const languages = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'ko', label: 'KO' }
  ];

  return (
    <div className={styles.actionsSection}>
      {/* Search Button */}
      <button className={styles.actionButton} aria-label="Rechercher">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </button>

      {/* Language Selector */}
      <div className={styles.languageSelector} onClick={toggleLanguage}>
        <span>{currentLanguage.toUpperCase()}</span>
        {isLanguageOpen && (
          <div className={styles.languageDropdown}>
            {languages.map((lang) => (
              <div 
                key={lang.code}
                className={styles.languageOption}
                onClick={() => changeLanguage(lang.code)}
              >
                {lang.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Account Button */}
      <Link href="/connexion" className={styles.actionButton} aria-label="Compte utilisateur">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </Link>

      {/* Cart Button */}
      <Link href="/panier" className={styles.actionButton} aria-label="Panier">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 01-8 0"></path>
        </svg>
        <span className={styles.cartCount}>{getTotalItems()}</span>
      </Link>
    </div>
  );
};

export default UserActions;