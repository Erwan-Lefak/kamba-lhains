import React from 'react';
import { useRouter } from 'next/router';

interface CollectionSidebarProps {
  collection: 'exclusivites' | 'aube' | 'zenith' | 'crepuscule';
  currentPage?: string;
  isMenuVisible: boolean;
  isHoveringMenu: boolean;
  showHautSubmenu: boolean;
  showBasSubmenu: boolean;
  showAccessoiresSubmenu: boolean;
  setShowHautSubmenu: (show: boolean) => void;
  setShowBasSubmenu: (show: boolean) => void;
  setShowAccessoiresSubmenu: (show: boolean) => void;
  setIsHoveringMenu: (hover: boolean) => void;
}

const collectionConfig = {
  exclusivites: {
    name: 'Exclusivités',
    basePath: '/exclusivites'
  },
  aube: {
    name: 'Aube', 
    basePath: '/aube'
  },
  zenith: {
    name: 'Zénith',
    basePath: '/zenith'
  },
  crepuscule: {
    name: 'Crépuscule',
    basePath: '/crepuscule'
  }
};

const subcategories = {
  haut: [
    { key: 't-shirt', label: 'T-SHIRT' },
    { key: 'chemise', label: 'CHEMISE' },
    { key: 'sweat-shirt', label: 'SWEAT-SHIRT' },
    { key: 'veste-en-jeans', label: 'VESTE EN JEANS' }
  ],
  bas: [
    { key: 'denim', label: 'DENIM' },
    { key: 'sweatpants', label: 'SWEATPANTS' },
    { key: 'baggy-jeans', label: 'BAGGY JEANS' },
    { key: 'short', label: 'SHORT' },
    { key: 'pantalon-cargo', label: 'PANTALON CARGO' },
    { key: 'underwear', label: 'UNDERWEAR' }
  ],
  accessoires: [
    { key: 'bonnet', label: 'BONNET' },
    { key: 'sac-de-sport', label: 'SAC DE SPORT' }
  ]
};

export default function CollectionSidebar({
  collection,
  currentPage,
  isMenuVisible,
  isHoveringMenu,
  showHautSubmenu,
  showBasSubmenu,
  showAccessoiresSubmenu,
  setShowHautSubmenu,
  setShowBasSubmenu,
  setShowAccessoiresSubmenu,
  setIsHoveringMenu
}: CollectionSidebarProps) {
  const router = useRouter();
  const config = collectionConfig[collection];

  const isCurrentCategory = (category: string) => {
    return subcategories.haut.some(sub => sub.key === category) ||
           subcategories.bas.some(sub => sub.key === category) ||
           subcategories.accessoires.some(sub => sub.key === category);
  };

  const getCurrentCategory = () => {
    if (!currentPage) return '';
    if (subcategories.haut.some(sub => sub.key === currentPage)) return 'haut';
    if (subcategories.bas.some(sub => sub.key === currentPage)) return 'bas';
    if (subcategories.accessoires.some(sub => sub.key === currentPage)) return 'accessoires';
    return '';
  };

  const currentCategory = getCurrentCategory();

  return (
    <>
      <div 
        className={`sidebar-menu ${isMenuVisible ? 'visible' : 'hidden'}`}
        onMouseEnter={() => setIsHoveringMenu(true)}
        onMouseLeave={() => setIsHoveringMenu(false)}
      >
        <nav className="sidebar-nav">
          <h3 className="sidebar-title">Catégorie</h3>
          <ul>
            <li>
              <button 
                onClick={() => router.push(config.basePath)}
                className={!currentPage ? 'active' : ''}
              >
                TOUS
              </button>
            </li>
            <li>
              <button 
                onClick={() => setShowHautSubmenu(!showHautSubmenu)}
                className={currentCategory === 'haut' ? 'active' : ''}
              >
                HAUT
              </button>
              {showHautSubmenu && (
                <ul className="submenu">
                  {subcategories.haut
                    .filter(sub => {
                      // Cacher chemise et veste-en-jeans pour la collection aube
                      if (collection === 'aube' && (sub.key === 'chemise' || sub.key === 'veste-en-jeans')) {
                        return false;
                      }
                      return true;
                    })
                    .map(sub => (
                    <li key={sub.key}>
                      <button 
                        onClick={() => router.push(`${config.basePath}/${sub.key}`)} 
                        className={`submenu-item ${currentPage === sub.key ? 'active' : ''}`}
                      >
                        {sub.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <button 
                onClick={() => setShowBasSubmenu(!showBasSubmenu)}
                className={currentCategory === 'bas' ? 'active' : ''}
              >
                BAS
              </button>
              {showBasSubmenu && (
                <ul className="submenu">
                  {subcategories.bas.map(sub => (
                    <li key={sub.key}>
                      <button 
                        onClick={() => router.push(`${config.basePath}/${sub.key}`)} 
                        className={`submenu-item ${currentPage === sub.key ? 'active' : ''}`}
                      >
                        {sub.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <button 
                onClick={() => setShowAccessoiresSubmenu(!showAccessoiresSubmenu)}
                className={currentCategory === 'accessoires' ? 'active' : ''}
              >
                ACCESSOIRES
              </button>
              {showAccessoiresSubmenu && (
                <ul className="submenu">
                  {subcategories.accessoires.map(sub => (
                    <li key={sub.key}>
                      <button 
                        onClick={() => router.push(`${config.basePath}/${sub.key}`)} 
                        className={`submenu-item ${currentPage === sub.key ? 'active' : ''}`}
                      >
                        {sub.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>

      <style jsx>{`
        .sidebar-menu {
          position: fixed;
          left: 0;
          top: 80px;
          width: 250px;
          height: calc(100vh - 80px);
          background: white;
          z-index: 1000;
          overflow-y: auto;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-menu.hidden {
          transform: translateX(-100%);
        }

        .sidebar-menu.visible {
          transform: translateX(0);
        }

        .sidebar-nav {
          padding: 40px 0;
        }

        .sidebar-nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .sidebar-nav li {
          margin-bottom: 0;
        }

        .sidebar-nav button {
          width: 100%;
          background: none;
          border: none;
          padding: 20px 30px;
          text-align: left;
          font-family: inherit;
          font-size: 11px;
          font-weight: 400;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .sidebar-nav button:hover {
          color: #9f0909;
        }

        .sidebar-nav button.active {
          color: #9f0909;
        }

        .sidebar-title {
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #000000;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 15px 0 20px 30px;
          padding: 0;
        }

        .sidebar-nav .submenu {
          list-style: none !important;
          margin: 0 !important;
          padding: 0 !important;
          padding-left: 35px !important;
        }

        .sidebar-nav .submenu li {
          margin-bottom: 0 !important;
        }

        .sidebar-nav .submenu-item {
          width: 100% !important;
          background: none !important;
          border: none !important;
          padding: 10px 20px !important;
          text-align: left !important;
          font-family: inherit !important;
          font-size: 8px !important;
          font-weight: 400 !important;
          color: #666 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          cursor: pointer !important;
          transition: color 0.3s ease !important;
        }

        .sidebar-nav .submenu-item:hover {
          color: #9f0909 !important;
        }

        .sidebar-nav .submenu-item.active {
          color: #9f0909 !important;
        }

        @media (max-width: 1024px) {
          .sidebar-menu {
            width: 200px;
          }

          .sidebar-nav button {
            padding: 16px 20px;
            font-size: 11px;
            font-weight: 400;
          }

          .submenu-item {
            padding: 12px 20px !important;
            font-size: 8px !important;
          }
        }

        @media (max-width: 768px) {
          .sidebar-menu {
            width: 280px;
            top: 0;
            height: 100vh;
          }
        }
      `}</style>
    </>
  );
}