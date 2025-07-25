import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Header.module.css';

const Navigation = () => {
  const { t } = useLanguage();
  const router = useRouter();
  
  const navigationItems = [
    { href: '/nouvelle-collection', label: 'Nouvelle Collection', type: 'link' },
    { href: '/exclusivites', label: 'Exclusivités', type: 'link' },
    { href: '/aube', label: 'Aube', type: 'link' },
    { href: '/zenith', label: 'Zenith', type: 'link' },
    { href: '/crepuscule', label: 'Crépuscule', type: 'link' },
    { href: '/kambavers?section=collections&subcategory=eclat-ombre', label: t('navigation.kambavers'), type: 'link' }
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
        {navigationItems.map((item, index) => (
          <li key={item.href || index}>
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