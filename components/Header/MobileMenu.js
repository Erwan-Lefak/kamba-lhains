import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import styles from './Header.module.css';

const MobileMenu = ({ isOpen }) => {
  const { t } = useLanguage();
  const { getTotalItems } = useCart();
  
  const mainMenuItems = [
    { href: '/', label: t('navigation.home') },
    { href: '/boutique', label: t('navigation.shop') },
    { href: '/contact', label: t('navigation.contact') },
    { href: '/kambavers', label: t('navigation.kambavers') }
  ];

  const bottomMenuItems = [
    { href: '/panier', label: 'Panier', count: getTotalItems() },
    { href: '/connexion', label: 'Compte' }
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
              <span>{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span>({item.count})</span>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;