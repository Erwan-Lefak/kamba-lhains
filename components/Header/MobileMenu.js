import Link from 'next/link';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Header.module.css';

const MobileMenu = ({ isOpen }) => {
  const { t } = useLanguage();
  
  const mobileMenuItems = [
    { href: '/', label: t('navigation.home') },
    { href: '/boutique', label: t('navigation.shop') },
    { href: '/contact', label: t('navigation.contact') },
    { href: '/kambavers', label: t('navigation.kambavers') },
    { href: '/connexion', label: t('navigation.connection') }
  ];

  if (!isOpen) return null;

  return (
    <div className={styles.mobileMenu}>
      <ul className={styles.mobileNavigation}>
        {mobileMenuItems.map((item) => (
          <li key={item.href} className={styles.mobileNavItem}>
            <Link href={item.href} className={styles.mobileNavLink}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobileMenu;