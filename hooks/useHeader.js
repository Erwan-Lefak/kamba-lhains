import { useState, useEffect } from 'react';

export const useHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language dropdown when clicking outside (but not the mobile menu)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close language dropdown, not the mobile menu
      if (isLanguageOpen && !event.target.closest('.languageSelector')) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isLanguageOpen]);

  const toggleMenu = (event) => {
    event?.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
    setIsLanguageOpen(false);
  };

  const toggleLanguage = (event) => {
    event.stopPropagation();
    setIsLanguageOpen(!isLanguageOpen);
    setIsMenuOpen(false);
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsLanguageOpen(false);
  };

  return {
    isMenuOpen,
    isLanguageOpen,
    isScrolled,
    toggleMenu,
    toggleLanguage,
    closeAllMenus
  };
};