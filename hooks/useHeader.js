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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLanguageOpen || isMenuOpen) {
        setIsLanguageOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isLanguageOpen, isMenuOpen]);

  const toggleMenu = () => {
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