import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCategoriesModal } from '../../contexts/CategoriesModalContext';
import styles from './Header.module.css';

const Navigation = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const { openModal } = useCategoriesModal();
  
  const navigationItems = [
    { href: '/nouvelle-collection', label: 'Nouvelle Collection', type: 'link' },
    { href: '/exclusivites', label: 'Exclusivités', type: 'link' },
    { category: 'Aube', label: 'Aube', type: 'modal' },
    { category: 'Zénith', label: 'Zenith', type: 'modal' },
    { category: 'Crépuscule', label: 'Crépuscule', type: 'modal' },
    { href: '/kambavers', label: t('navigation.kambavers'), type: 'link' }
  ];

  const isActive = (href) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  const handleItemClick = (item, e) => {
    if (item.type === 'modal') {
      e.preventDefault();
      openModal(item.category);
    }
  };

  return (
    <nav className={styles.navigationSection}>
      <ul className={styles.navigation}>
        {navigationItems.map((item, index) => (
          <li key={item.href || item.category || index}>
            {item.type === 'link' ? (
              <Link 
                href={item.href} 
                className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}
              >
                {item.label}
              </Link>
            ) : (
              <button
                onClick={(e) => handleItemClick(item, e)}
                className={styles.navLink}
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;