import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import styles from './Header.module.css';

const MobileMenu = ({ isOpen }) => {
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const { getTotalItems } = useCart();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLanguageDropdownOpen && !event.target.closest('[data-language-dropdown]')) {
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

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsLanguageDropdownOpen(false);
  };
  
  const mainMenuItems = [
    { href: '/', label: t('navigation.home') },
    { href: '/boutique', label: t('navigation.shop') },
    { href: '/contact', label: t('navigation.contact') },
    { href: '/kambavers', label: t('navigation.kambavers') }
  ];

  const bottomMenuItems = [
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
        {bottomMenuItems.map((item) => (
          <div key={item.href} className={styles.mobileBottomItem}>
            <Link href={item.href} className={styles.mobileBottomLink}>
              <div className={styles.mobileBottomIcon}>
                {item.icon}
                {item.count !== undefined && item.count > 0 && (
                  <span className={styles.mobileCartCount}>{item.count}</span>
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          </div>
        ))}
        
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
    </div>
  );
};

export default MobileMenu;