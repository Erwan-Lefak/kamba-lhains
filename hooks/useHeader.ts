import { useState, useEffect } from 'react';

interface UseHeaderReturn {
  isMenuOpen: boolean;
  isLanguageOpen: boolean;
  isSearchOpen: boolean;
  isScrolled: boolean;
  toggleMenu: (event?: React.MouseEvent) => void;
  toggleLanguage: (event: React.MouseEvent) => void;
  toggleSearch: () => void;
  closeAllMenus: () => void;
}

export const useHeader = (): UseHeaderReturn => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = (): void => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language dropdown when clicking outside (but not the mobile menu)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      // Only close language dropdown, not the mobile menu
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
    console.log('toggleSearch called, current isSearchOpen:', isSearchOpen);
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false);
    setIsLanguageOpen(false);
    console.log('toggleSearch - new state should be:', !isSearchOpen);
  };

  const closeAllMenus = (): void => {
    setIsMenuOpen(false);
    setIsLanguageOpen(false);
    setIsSearchOpen(false);
  };

  return {
    isMenuOpen,
    isLanguageOpen,
    isSearchOpen,
    isScrolled,
    toggleMenu,
    toggleLanguage,
    toggleSearch,
    closeAllMenus
  };
};