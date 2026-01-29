import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Language } from '../../utils/translations';
import styles from './Header.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItemWithIcon {
  href: string;
  label: string;
  count?: number;
  icon: React.ReactNode;
}

interface MenuItem {
  href: string;
  label: string;
}

interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const { getTotalItems } = useCart();
  const { favorites } = useFavorites();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [favoritesPulse, setFavoritesPulse] = useState(false);

  // Refs initialisés une seule fois
  const prevCartCount = useRef<number>(getTotalItems());
  const prevFavoritesCount = useRef<number>(favorites.length);
  const isFirstRender = useRef(true);

  // Stocker les valeurs actuelles
  const currentCartCount = getTotalItems();
  const currentFavoritesCount = favorites.length;

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Element;
      if (isLanguageDropdownOpen && !target.closest('[data-language-dropdown]')) {
        setIsLanguageDropdownOpen(false);
      }
    };

    if (isLanguageDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isLanguageDropdownOpen]);

  // Détecter les changements du panier et déclencher l'animation
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (currentCartCount > prevCartCount.current) {
      console.log('🛒 Mobile - Animation panier déclenchée:', prevCartCount.current, '->', currentCartCount);
      setCartPulse(true);
      const timer = setTimeout(() => setCartPulse(false), 1000);
      return () => clearTimeout(timer);
    }
    prevCartCount.current = currentCartCount;
  }, [currentCartCount]);

  // Détecter les changements des favoris et déclencher l'animation
  useEffect(() => {
    if (currentFavoritesCount > prevFavoritesCount.current) {
      console.log('❤️ Mobile - Animation favoris déclenchée:', prevFavoritesCount.current, '->', currentFavoritesCount);
      setFavoritesPulse(true);
      const timer = setTimeout(() => setFavoritesPulse(false), 1000);
      return () => clearTimeout(timer);
    }
    prevFavoritesCount.current = currentFavoritesCount;
  }, [currentFavoritesCount]);

  const languages: LanguageOption[] = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (langCode: Language): void => {
    changeLanguage(langCode);
    setIsLanguageDropdownOpen(false);
  };
  
  const mainMenuItems: MenuItem[] = [
    // { href: '/nouvelle-collection', label: 'Shadow Burst' },
    // { href: '/exclusivites', label: 'Exclusivités' },
    { href: '/aube', label: 'Aube' },
    { href: '/zenith', label: 'Zenith' },
    { href: '/crepuscule', label: 'Crépuscule' },
    { href: '/denim', label: 'Denim' },
    { href: '/kambavers', label: t('navigation.kambavers') }
  ];

  const bottomMenuItems: MenuItemWithIcon[] = [
    { 
      href: '/favoris', 
      label: 'Favoris', 
      count: favorites.length,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      )
    },
    { 
      href: '/panier', 
      label: 'Panier', 
      count: getTotalItems(),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 01-8 0"></path>
        </svg>
      )
    },
    { 
      href: '/connexion', 
      label: 'Compte',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    }
  ];

  return (
    <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
      {/* Search Bar */}
      <div className={styles.mobileSearchSection}>
        <div className={styles.mobileSearchBar}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.mobileSearchIcon}>
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input 
            type="text" 
            placeholder="Votre recherche.." 
            className={styles.mobileSearchInput}
          />
        </div>
      </div>
      
      <ul className={styles.mobileNavigation}>
        {mainMenuItems.map((item) => (
          <li key={item.href} className={styles.mobileNavItem}>
            <Link href={item.href} className={styles.mobileNavLink}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.mobileBottomSection}>
        {bottomMenuItems.map((item) => {
          const isPulse = item.href === '/panier' ? cartPulse : item.href === '/favoris' ? favoritesPulse : false;
          return (
            <div key={item.href} className={styles.mobileBottomItem}>
              <Link href={item.href} className={styles.mobileBottomLink}>
                <div className={styles.mobileBottomIcon}>
                  {item.icon}
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`${styles.mobileCartCount} ${isPulse ? styles.pulse : ''}`}>{item.count}</span>
                  )}
                </div>
                <span>{item.label}</span>
              </Link>
            </div>
          );
        })}
        
        {/* Language Selector aligned with other bottom items */}
        <div className={styles.mobileBottomItem}>
          <div 
            className={styles.mobileLanguageDropdown}
            data-language-dropdown
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
          >
            <div className={styles.mobileLanguageSelected}>
              <span className={styles.mobileLanguageFlag}>{currentLang.flag}</span>
              <span className={styles.mobileLanguageText}>{currentLang.label}</span>
              <span className={styles.mobileLanguageArrow}>
                {isLanguageDropdownOpen ? '▲' : '▼'}
              </span>
            </div>
            
            {isLanguageDropdownOpen && (
              <div className={styles.mobileLanguageOptions}>
                {languages.filter(lang => lang.code !== currentLanguage).map((lang) => (
                  <div 
                    key={lang.code}
                    className={styles.mobileLanguageOption}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLanguageChange(lang.code);
                    }}
                  >
                    <span className={styles.mobileLanguageFlag}>{lang.flag}</span>
                    <span className={styles.mobileLanguageText}>{lang.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* French Flag for Mobile - at the bottom */}
      <div className={styles.mobileFlagSection}>
        <img src="/images/drapeau-france.jpg" alt="Made in France" className={styles.mobileFlag} />
      </div>
    </div>
  );
};

export default MobileMenu;