import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface HeaderContextType {
  isMenuOpen: boolean;
  isLanguageOpen: boolean;
  isSearchOpen: boolean;
  isScrolled: boolean;
  toggleMenu: (event?: React.MouseEvent) => void;
  toggleLanguage: (event: React.MouseEvent) => void;
  toggleSearch: () => void;
  closeAllMenus: () => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Close all menus on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
      setIsLanguageOpen(false);
      setIsSearchOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = (): void => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Element;
      if (isLanguageOpen && !target.closest('[data-language-selector]')) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isLanguageOpen]);

  const toggleMenu = (event?: React.MouseEvent): void => {
    event?.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
    setIsLanguageOpen(false);
    setIsSearchOpen(false);
  };

  const toggleLanguage = (event: React.MouseEvent): void => {
    event.stopPropagation();
    setIsLanguageOpen(!isLanguageOpen);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  const toggleSearch = (): void => {
    console.log('toggleSearch in Context - current isSearchOpen:', isSearchOpen);
    setIsSearchOpen((prev) => {
      console.log('toggleSearch - changing from', prev, 'to', !prev);
      return !prev;
    });
    setIsMenuOpen(false);
    setIsLanguageOpen(false);
  };

  const closeAllMenus = (): void => {
    setIsMenuOpen(false);
    setIsLanguageOpen(false);
    setIsSearchOpen(false);
  };

  return (
    <HeaderContext.Provider
      value={{
        isMenuOpen,
        isLanguageOpen,
        isSearchOpen,
        isScrolled,
        toggleMenu,
        toggleLanguage,
        toggleSearch,
        closeAllMenus,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = (): HeaderContextType => {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
};
