import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Header.module.css';

interface NavigationItem {
  href: string;
  label: string;
  type: string;
}

const Navigation: React.FC = () => {
  const { t } = useLanguage();
  const router = useRouter();
  
  const navigationItems: NavigationItem[] = [
    { href: '/nouvelle-collection', label: 'Shadow Burst', type: 'link' },
    { href: '/exclusivites', label: 'Exclusivités', type: 'link' },
    { href: '/aube', label: 'Aube', type: 'link' },
    { href: '/zenith', label: 'Zenith', type: 'link' },
    { href: '/crepuscule', label: 'Crépuscule', type: 'link' },
    { href: '/kambavers', label: t('navigation.kambavers'), type: 'link' }
  ];

  const isActive = (href: string): boolean => {
    if (href === '/') {
      return router.pathname === '/';
    }
    
    // Pour Kambavers, on vérifie toutes les pages kambavers
    if (href.includes('/kambavers')) {
      return router.pathname.startsWith('/kambavers');
    }
    
    return router.pathname.startsWith(href);
  };

  const handleKambaversClick = (e: React.MouseEvent, href: string) => {
    if (href === '/kambavers') {
      e.preventDefault();
      // Forcer la navigation vers kambavers principal sur tous les appareils
      if (router.pathname.startsWith('/kambavers')) {
        // Si on est déjà dans une section kambavers, forcer le rechargement
        window.location.href = '/kambavers';
      } else {
        // Sinon, navigation normale
        router.push('/kambavers');
      }
    }
  };

  return (
    <nav className={styles.navigationSection}>
      <ul className={styles.navigation}>
        {navigationItems.map((item, index) => (
          <li key={item.href || index}>
            <Link 
              href={item.href} 
              className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}
              onClick={(e) => handleKambaversClick(e, item.href)}
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