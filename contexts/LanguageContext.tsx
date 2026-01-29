import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation, Language, translations } from '../utils/translations';

interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

interface LanguageProviderProps {
  children: React.ReactNode;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Toujours initialiser avec 'fr' pour éviter les erreurs d'hydratation
  const [currentLanguage, setCurrentLanguage] = useState<Language>('fr');
  const [isClient, setIsClient] = useState(false);

  const t = (key: string): any => getTranslation(currentLanguage, key);

  const changeLanguage = (lang: Language): void => {
    setCurrentLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kamba-language', lang);
    }
  };

  // Charger la langue sauvegardée uniquement côté client après l'hydratation
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('kamba-language') as Language;
      if (savedLanguage && savedLanguage !== currentLanguage) {
        setCurrentLanguage(savedLanguage);
      }
    }
  }, []);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      changeLanguage,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};