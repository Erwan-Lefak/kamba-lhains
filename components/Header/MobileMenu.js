import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import styles from './Header.module.css';

const MobileMenu = ({ isOpen }) => {
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const { getTotalItems } = useCart();

  const languages = [
    { code: 'fr', label: 'France Métropolitaine', flag: '🇫🇷' },
    { code: 'en', label: 'United Kingdom', flag: '🇬🇧' },
    { code: 'ko', label: '대한민국', flag: '🇰🇷' }
  ];
  
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

  if (!isOpen) return null;

  return (
    <div className={styles.mobileMenu}>
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
      </div>

      <div className={styles.mobileLanguageSelector}>
        {languages.map((lang) => (
          <div 
            key={lang.code}
            className={styles.mobileLanguageItem}
            onClick={() => changeLanguage(lang.code)}
          >
            <span className={styles.mobileLanguageFlag}>{lang.flag}</span>
            <span className={styles.mobileLanguageText}>{lang.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;