import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Header.module.css';

const Navigation = () => {
  const { t } = useLanguage();
  const router = useRouter();
  
  const navigationItems = [
    { href: '/nouvelle-collection', label: 'Nouvelle Collection' },
    { href: '/exclusivites', label: 'Non Exclusivités' },
    { href: '/aube', label: 'Aube' },
    { href: '/zenith', label: 'Zenith' },
    { href: '/crepuscule', label: 'Crépuscule' },
    { href: '/kambavers', label: t('navigation.kambavers') }
  ];

  const isActive = (href) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  return (
    <nav className={styles.navigationSection}>
      <ul className={styles.navigation}>
        {navigationItems.map((item) => (
          <li key={item.href}>
            <Link 
              href={item.href} 
              className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;