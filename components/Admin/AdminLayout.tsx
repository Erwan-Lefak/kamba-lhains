import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AdminLayout.module.css';

interface User {
  name: string;
  role: string;
  avatar?: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  user: User;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
  submenu?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    href: '/admin'
  },
  {
    id: 'orders',
    label: 'Commandes',
    icon: '📦',
    href: '/admin/orders',
    badge: 12
  },
  {
    id: 'products',
    label: 'Produits',
    icon: '🛍️',
    href: '/admin/products',
    submenu: [
      { id: 'all-products', label: 'Tous les produits', icon: '📋', href: '/admin/products' },
      { id: 'add-product', label: 'Ajouter produit', icon: '➕', href: '/admin/products/add' },
      { id: 'categories', label: 'Catégories', icon: '🏷️', href: '/admin/products/categories' },
      { id: 'inventory', label: 'Inventaire', icon: '📊', href: '/admin/products/inventory' }
    ]
  },
  {
    id: 'customers',
    label: 'Clients',
    icon: '👥',
    href: '/admin/customers'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: '📈',
    href: '/admin/analytics',
    submenu: [
      { id: 'overview', label: 'Vue d\'ensemble', icon: '📊', href: '/admin/analytics' },
      { id: 'sales', label: 'Ventes', icon: '💰', href: '/admin/analytics/sales' },
      { id: 'traffic', label: 'Trafic', icon: '🚀', href: '/admin/analytics/traffic' },
      { id: 'conversion', label: 'Conversion', icon: '🎯', href: '/admin/analytics/conversion' }
    ]
  },
  {
    id: 'ai',
    label: 'IA & ML',
    icon: '🤖',
    href: '/admin/ai',
    submenu: [
      { id: 'models', label: 'Modèles', icon: '🧠', href: '/admin/ai/models' },
      { id: 'recommendations', label: 'Recommandations', icon: '✨', href: '/admin/ai/recommendations' },
      { id: 'insights', label: 'Insights', icon: '💡', href: '/admin/ai/insights' },
      { id: 'training', label: 'Entraînement', icon: '🔄', href: '/admin/ai/training' }
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: '📢',
    href: '/admin/marketing',
    submenu: [
      { id: 'campaigns', label: 'Campagnes', icon: '🎯', href: '/admin/marketing/campaigns' },
      { id: 'promotions', label: 'Promotions', icon: '🏷️', href: '/admin/marketing/promotions' },
      { id: 'newsletters', label: 'Newsletters', icon: '📧', href: '/admin/marketing/newsletters' }
    ]
  },
  {
    id: 'content',
    label: 'Contenu',
    icon: '📝',
    href: '/admin/content',
    submenu: [
      { id: 'pages', label: 'Pages', icon: '📄', href: '/admin/content/pages' },
      { id: 'blog', label: 'Blog', icon: '✍️', href: '/admin/content/blog' },
      { id: 'media', label: 'Média', icon: '🖼️', href: '/admin/content/media' }
    ]
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: '⚙️',
    href: '/admin/settings',
    submenu: [
      { id: 'general', label: 'Général', icon: '🔧', href: '/admin/settings' },
      { id: 'payments', label: 'Paiements', icon: '💳', href: '/admin/settings/payments' },
      { id: 'shipping', label: 'Livraison', icon: '🚚', href: '/admin/settings/shipping' },
      { id: 'users', label: 'Utilisateurs', icon: '👤', href: '/admin/settings/users' }
    ]
  }
];

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['dashboard']);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return router.pathname === '/admin';
    }
    return router.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    // Simulation de déconnexion
    document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/admin/login');
  };

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <motion.aside 
        className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo */}
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.logo}>
            <span className={styles.logoIcon}>👑</span>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  className={styles.logoText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Admin Panel
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={styles.collapseButton}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation */}
        <nav className={styles.navigation}>
          {menuItems.map((item) => (
            <div key={item.id} className={styles.menuItem}>
              <Link
                href={item.href}
                className={`${styles.menuLink} ${isActive(item.href) ? styles.active : ''}`}
                onClick={() => item.submenu && toggleSubmenu(item.id)}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      className={styles.menuLabel}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {!sidebarCollapsed && item.badge && (
                  <span className={styles.menuBadge}>{item.badge}</span>
                )}
                
                {!sidebarCollapsed && item.submenu && (
                  <span className={`${styles.menuArrow} ${expandedMenus.includes(item.id) ? styles.expanded : ''}`}>
                    ▼
                  </span>
                )}
              </Link>

              {/* Submenu */}
              <AnimatePresence>
                {!sidebarCollapsed && item.submenu && expandedMenus.includes(item.id) && (
                  <motion.div
                    className={styles.submenu}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.id}
                        href={subitem.href}
                        className={`${styles.submenuLink} ${isActive(subitem.href) ? styles.active : ''}`}
                      >
                        <span className={styles.submenuIcon}>{subitem.icon}</span>
                        <span className={styles.submenuLabel}>{subitem.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <h1 className={styles.pageTitle}>
              {menuItems.find(item => isActive(item.href))?.label || 'Dashboard'}
            </h1>
          </div>

          <div className={styles.topBarRight}>
            {/* Search */}
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Rechercher..."
                className={styles.searchInput}
              />
              <span className={styles.searchIcon}>🔍</span>
            </div>

            {/* Notifications */}
            <button className={styles.notificationButton}>
              <span className={styles.notificationIcon}>🔔</span>
              <span className={styles.notificationBadge}>3</span>
            </button>

            {/* User Menu */}
            <div className={styles.userMenu}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={styles.userButton}
              >
                <div className={styles.userAvatar}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <span>{user.name.charAt(0)}</span>
                  )}
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.userRole}>{user.role}</span>
                </div>
                <span className={styles.userArrow}>▼</span>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    className={styles.userDropdown}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link href="/admin/profile" className={styles.dropdownItem}>
                      <span className={styles.dropdownIcon}>👤</span>
                      Profil
                    </Link>
                    <Link href="/admin/settings" className={styles.dropdownItem}>
                      <span className={styles.dropdownIcon}>⚙️</span>
                      Paramètres
                    </Link>
                    <div className={styles.dropdownDivider} />
                    <button onClick={handleLogout} className={styles.dropdownItem}>
                      <span className={styles.dropdownIcon}>🚪</span>
                      Déconnexion
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>

      <style jsx>{`
        .${styles.adminLayout} {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        .${styles.sidebar} {
          background: #1f2937;
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 1000;
          overflow-y: auto;
          transition: width 0.3s ease;
        }

        .${styles.sidebar}::-webkit-scrollbar {
          width: 4px;
        }

        .${styles.sidebar}::-webkit-scrollbar-track {
          background: transparent;
        }

        .${styles.sidebar}::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 2px;
        }

        .${styles.sidebarHeader} {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid #374151;
        }

        .${styles.logo} {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: white;
        }

        .${styles.logoIcon} {
          font-size: 24px;
          flex-shrink: 0;
        }

        .${styles.logoText} {
          font-size: 18px;
          font-weight: 700;
        }

        .${styles.collapseButton} {
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .${styles.collapseButton}:hover {
          background: #374151;
          color: white;
        }

        .${styles.navigation} {
          flex: 1;
          padding: 20px 0;
        }

        .${styles.menuItem} {
          margin-bottom: 4px;
        }

        .${styles.menuLink} {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          color: #d1d5db;
          text-decoration: none;
          transition: all 0.2s;
          position: relative;
        }

        .${styles.menuLink}:hover {
          background: #374151;
          color: white;
        }

        .${styles.menuLink}.${styles.active} {
          background: #3b82f6;
          color: white;
        }

        .${styles.menuLink}.${styles.active}::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #60a5fa;
        }

        .${styles.menuIcon} {
          font-size: 18px;
          flex-shrink: 0;
        }

        .${styles.menuLabel} {
          flex: 1;
          font-weight: 500;
        }

        .${styles.menuBadge} {
          background: #ef4444;
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 600;
        }

        .${styles.menuArrow} {
          font-size: 10px;
          transition: transform 0.2s;
        }

        .${styles.menuArrow}.${styles.expanded} {
          transform: rotate(180deg);
        }

        .${styles.submenu} {
          background: #111827;
          margin-left: 20px;
          border-left: 2px solid #374151;
        }

        .${styles.submenuLink} {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          color: #9ca3af;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s;
        }

        .${styles.submenuLink}:hover {
          background: #1f2937;
          color: #d1d5db;
        }

        .${styles.submenuLink}.${styles.active} {
          background: #1e40af;
          color: white;
        }

        .${styles.submenuIcon} {
          font-size: 14px;
        }

        .${styles.mainContent} {
          flex: 1;
          margin-left: 280px;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s ease;
        }

        .${styles.sidebar}.${styles.collapsed} + .${styles.mainContent} {
          margin-left: 80px;
        }

        .${styles.topBar} {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .${styles.pageTitle} {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .${styles.topBarRight} {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .${styles.searchContainer} {
          position: relative;
        }

        .${styles.searchInput} {
          width: 300px;
          padding: 8px 40px 8px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          background: #f9fafb;
          transition: all 0.2s;
        }

        .${styles.searchInput}:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .${styles.searchIcon} {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
        }

        .${styles.notificationButton} {
          position: relative;
          background: transparent;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .${styles.notificationButton}:hover {
          background: #f3f4f6;
        }

        .${styles.notificationIcon} {
          font-size: 20px;
          color: #6b7280;
        }

        .${styles.notificationBadge} {
          position: absolute;
          top: 4px;
          right: 4px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          padding: 2px 4px;
          border-radius: 8px;
          font-weight: 600;
          min-width: 16px;
          text-align: center;
        }

        .${styles.userMenu} {
          position: relative;
        }

        .${styles.userButton} {
          display: flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .${styles.userButton}:hover {
          background: #f3f4f6;
        }

        .${styles.userAvatar} {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
          overflow: hidden;
        }

        .${styles.userAvatar} img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .${styles.userInfo} {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .${styles.userName} {
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
        }

        .${styles.userRole} {
          font-size: 12px;
          color: #6b7280;
        }

        .${styles.userArrow} {
          font-size: 10px;
          color: #6b7280;
        }

        .${styles.userDropdown} {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          min-width: 180px;
          overflow: hidden;
          z-index: 1000;
        }

        .${styles.dropdownItem} {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #374151;
          text-decoration: none;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }

        .${styles.dropdownItem}:hover {
          background: #f3f4f6;
        }

        .${styles.dropdownIcon} {
          font-size: 16px;
        }

        .${styles.dropdownDivider} {
          height: 1px;
          background: #e5e7eb;
          margin: 4px 0;
        }

        .${styles.pageContent} {
          flex: 1;
          padding: 0;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .${styles.sidebar} {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .${styles.sidebar}.${styles.mobileOpen} {
            transform: translateX(0);
          }

          .${styles.mainContent} {
            margin-left: 0;
          }

          .${styles.searchInput} {
            width: 200px;
          }

          .${styles.userInfo} {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}