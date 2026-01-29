import { Language } from './translations';

// Traductions des noms de produits
export const productNameTranslations: Record<string, Record<Language, string>> = {
  "GILET 1957": {
    fr: "GILET 1957",
    en: "VEST 1957"
  },
  "BAGGY 1957": {
    fr: "BAGGY 1957",
    en: "BAGGY 1957"
  },
  "PANTALON JANE": {
    fr: "PANTALON JANE",
    en: "JANE PANTS"
  },
  "VESTE JANE": {
    fr: "VESTE JANE",
    en: "JANE JACKET"
  },
  "VOILE DE CORPS": {
    fr: "VOILE DE CORPS",
    en: "BODY VEIL"
  },
  "JUPE BINE": {
    fr: "JUPE BINE",
    en: "BINE SKIRT"
  },
  "SHORT URIEL": {
    fr: "SHORT URIEL",
    en: "URIEL SHORTS"
  },
  "CHEMISE URIEL MANCHE LONGUE": {
    fr: "CHEMISE URIEL MANCHE LONGUE",
    en: "URIEL LONG SLEEVE SHIRT"
  },
  "CHEMISE URIEL MANCHES COURTES": {
    fr: "CHEMISE URIEL MANCHES COURTES",
    en: "URIEL SHORT SLEEVE SHIRT"
  },
  "BAS DE SURVÊTEMENT ASABILI": {
    fr: "BAS DE SURVÊTEMENT ASABILI",
    en: "ASABILI TRACKSUIT BOTTOMS"
  },
  "BOMBERS ITOUA": {
    fr: "BOMBERS ITOUA",
    en: "ITOUA BOMBER"
  },
  "CALEÇON CHAMPION": {
    fr: "CALEÇON CHAMPION",
    en: "CHAMPION BOXER"
  },
  "SURCHEMISE GRAND BOUBOU": {
    fr: "SURCHEMISE GRAND BOUBOU",
    en: "GRAND BOUBOU OVERSHIRT"
  }
};

// Fonction pour obtenir le nom traduit d'un produit
export const getTranslatedProductName = (name: string, language: Language): string => {
  return productNameTranslations[name]?.[language] || name;
};
