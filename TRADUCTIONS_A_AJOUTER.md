# Guide complet des traductions à ajouter

Ce document liste TOUTES les traductions qui doivent être ajoutées au fichier `utils/translations.ts` et appliquées dans les composants.

## ⚠️ IMPORTANT : Méthode de travail

Pour traduire tout le site, suivez ces étapes :

### Étape 1 : Ajouter TOUTES les traductions dans `utils/translations.ts`

Ajoutez les interfaces et traductions ci-dessous dans le fichier `utils/translations.ts`.

### Étape 2 : Appliquer les traductions dans chaque composant

Pour chaque composant, importez `useLanguage` et remplacez le texte en dur par `t('cle.de.traduction')`.

---

## 📝 TRADUCTIONS À AJOUTER DANS `utils/translations.ts`

### 1. Interface pour les couleurs

```typescript
export interface ColorTranslations {
  black: string;
  white: string;
  coffee: string;
  beige: string;
  yellow: string;
  pink: string;
  indigoBlue: string;
  offWhite: string;
  gray: string;
  burgundy: string;
  khaki: string;
  brown: string;
  anthracite: string;
  skyBlue: string;
  navyBlue: string;
  green: string;
  red: string;
}
```

### 2. Interface pour les textes communs

```typescript
export interface CommonTranslations {
  or: string;
  close: string;
  color: string;
  size: string;
  description: string;
}
```

### 3. Interface pour le header

```typescript
export interface HeaderTranslations {
  search: string;
  favorites: string;
  cart: string;
  userAccount: string;
  account: string;
  searchPlaceholder: string;
}
```

### 4. Interface pour l'authentification

```typescript
export interface AuthTranslations {
  login: string;
  signup: string;
  loginAction: string;
  signupAction: string;
  createAccount: string;
  loginSubtitle: string;
  signupSubtitle: string;
  firstName: string;
  firstNamePlaceholder: string;
  lastName: string;
  lastNamePlaceholder: string;
  email: string;
  password: string;
  confirmPassword: string;
  processing: string;
  loginButton: string;
  createAccountButton: string;
  forgotPassword: string;
  noAccount: string;
  haveAccount: string;
  continueGoogle: string;
  continueFacebook: string;
  continueApple: string;
  termsIntro: string;
  termsOfUse: string;
  privacyPolicy: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMinLength: string;
  firstNameRequired: string;
  lastNameRequired: string;
  confirmPasswordRequired: string;
  passwordMismatch: string;
  errorGeneric: string;
}
```

### 5. Interface pour la recherche

```typescript
export interface SearchTranslations {
  placeholder: string;
  clear: string;
  suggestions: string;
  noProducts: string;
  tryOtherKeywords: string;
  emptyCollection: string;
  searchError: string;
  connectionError: string;
  title: string;
  searchPlaceholder: string;
  filters: string;
  resultsFound: string;
  category: string;
  allCategories: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  nameAsc: string;
  nameDesc: string;
  priceAsc: string;
  priceDesc: string;
  newest: string;
  oldest: string;
  inStockOnly: string;
  searching: string;
  noResults: string;
  modifyCriteria: string;
  startSearch: string;
  typeKeyword: string;
}
```

### 6. Interface pour le checkout

```typescript
export interface CheckoutTranslations {
  firstNameRequired: string;
  lastNameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  addressRequired: string;
  cityRequired: string;
  postalCodeRequired: string;
  paymentError: string;
  emptyCart: string;
  emptyDescription: string;
  continue: string;
  item: string;
  items: string;
  information: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shipping: string;
  address: string;
  addressComplement: string;
  city: string;
  postalCode: string;
  payment: string;
  processing: string;
  order: string;
  securePayment: string;
  metaDescription: string;
}
```

### 7. Mettre à jour CartTranslations

Ajoutez ces propriétés à l'interface `CartTranslations` existante :

```typescript
export interface CartTranslations {
  title: string;
  empty: string;
  total: string;
  subtotal: string;
  shipping: string;
  tax: string;
  checkout: string;
  continue: string;
  quantity: string;
  remove: string;
  // AJOUTER CES NOUVELLES PROPRIÉTÉS :
  emptyDescription: string;
  clear: string;
  summary: string;
  free: string;
  processing: string;
  securePayment: string;
}
```

### 8. Mettre à jour ProductTranslations

Ajoutez ces propriétés à l'interface `ProductTranslations` existante :

```typescript
export interface ProductTranslations {
  addToCart: string;
  addToFavorites: string;
  removeFromFavorites: string;
  selectSize: string;
  outOfStock: string;
  inStock: string;
  // AJOUTER CES NOUVELLES PROPRIÉTÉS :
  color: string;
  size: string;
  previousImage: string;
  nextImage: string;
}
```

### 9. Interface pour le suivi de commande

```typescript
export interface TrackingTranslations {
  title: string;
  description: string;
  orderNumber: string;
  orderNumberPlaceholder: string;
  email: string;
  emailPlaceholder: string;
  submitButton: string;
  importantInfo: string;
  orderNumberInfo: string;
  orderNumberDesc: string;
  processingTimes: string;
  preparationTime: string;
  franceShipping: string;
  internationalShipping: string;
  carrierTracking: string;
  trackingEmail: string;
  searchInProgress: string;
  searchingOrder: string;
  featureComingSoon: string;
  checkEmail: string;
  trackOnCarrier: string;
  contactUs: string;
  newSearch: string;
}
```

### 10. Mettre à jour LanguageTranslationSet

```typescript
export interface LanguageTranslationSet {
  navigation: NavigationTranslations;
  hero: HeroTranslations;
  sections: SectionTranslations;
  language: LanguageTranslations;
  footer: FooterTranslations;
  products: ProductTranslations;
  cart: CartTranslations;
  favorites: FavoritesTranslations;
  // AJOUTER CES NOUVELLES SECTIONS :
  colors: ColorTranslations;
  common: CommonTranslations;
  header: HeaderTranslations;
  auth: AuthTranslations;
  search: SearchTranslations;
  checkout: CheckoutTranslations;
  tracking: TrackingTranslations;
}
```

---

## 🇫🇷 TRADUCTIONS FRANÇAISES

Ajoutez ces traductions dans la section `fr` de l'objet `translations` :

```typescript
fr: {
  // ... (traductions existantes)

  colors: {
    black: "Noir",
    white: "Blanc",
    coffee: "Café",
    beige: "Beige",
    yellow: "Jaune",
    pink: "Rose",
    indigoBlue: "Bleu indigo",
    offWhite: "Blanc cassé",
    gray: "Gris",
    burgundy: "Bordeaux",
    khaki: "Kaki",
    brown: "Marron",
    anthracite: "Anthracite",
    skyBlue: "Bleu ciel",
    navyBlue: "Bleu nuit",
    green: "Vert",
    red: "Rouge"
  },

  common: {
    or: "ou",
    close: "Fermer",
    color: "Couleur",
    size: "Taille",
    description: "Description"
  },

  header: {
    search: "Rechercher",
    favorites: "Favoris",
    cart: "Panier",
    userAccount: "Compte utilisateur",
    account: "Compte",
    searchPlaceholder: "Votre recherche.."
  },

  auth: {
    login: "Connexion",
    signup: "Inscription",
    loginAction: "Connectez-vous",
    signupAction: "Inscrivez-vous",
    createAccount: "Créer un compte",
    loginSubtitle: "Accédez à votre espace personnel KAMBA LHAINS",
    signupSubtitle: "Rejoignez la communauté KAMBA LHAINS",
    firstName: "Prénom",
    firstNamePlaceholder: "Votre prénom",
    lastName: "Nom",
    lastNamePlaceholder: "Votre nom",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    processing: "Traitement...",
    loginButton: "Se connecter",
    createAccountButton: "Créer mon compte",
    forgotPassword: "Mot de passe oublié ?",
    noAccount: "Pas encore de compte ?",
    haveAccount: "Déjà un compte ?",
    continueGoogle: "Continuer avec Google",
    continueFacebook: "Continuer avec Facebook",
    continueApple: "Continuer avec Apple",
    termsIntro: "En continuant, vous acceptez nos",
    termsOfUse: "Conditions d'utilisation",
    privacyPolicy: "Politique de confidentialité",
    emailRequired: "L'email est requis",
    emailInvalid: "Format d'email invalide",
    passwordRequired: "Le mot de passe est requis",
    passwordMinLength: "Le mot de passe doit contenir au moins 6 caractères",
    firstNameRequired: "Le prénom est requis",
    lastNameRequired: "Le nom est requis",
    confirmPasswordRequired: "Confirmez votre mot de passe",
    passwordMismatch: "Les mots de passe ne correspondent pas",
    errorGeneric: "Une erreur est survenue. Veuillez réessayer."
  },

  search: {
    placeholder: "Rechercher un produit...",
    clear: "Effacer",
    suggestions: "Suggestions",
    noProducts: "Aucun produit trouvé",
    tryOtherKeywords: "Essayez avec d'autres mots-clés",
    emptyCollection: "Cette collection ne contient pas encore de produits",
    searchError: "Erreur lors de la recherche",
    connectionError: "Erreur de connexion",
    title: "Rechercher des produits",
    searchPlaceholder: "Rechercher par nom, description...",
    filters: "Filtres",
    resultsFound: "résultat(s) trouvé(s)",
    category: "Catégorie",
    allCategories: "Toutes les catégories",
    minPrice: "Prix minimum",
    maxPrice: "Prix maximum",
    sortBy: "Trier par",
    nameAsc: "Nom (A-Z)",
    nameDesc: "Nom (Z-A)",
    priceAsc: "Prix (croissant)",
    priceDesc: "Prix (décroissant)",
    newest: "Plus récent",
    oldest: "Plus ancien",
    inStockOnly: "Produits en stock uniquement",
    searching: "Recherche en cours...",
    noResults: "Aucun résultat trouvé",
    modifyCriteria: "Essayez de modifier vos critères de recherche.",
    startSearch: "Commencez votre recherche",
    typeKeyword: "Tapez un mot-clé pour rechercher des produits."
  },

  checkout: {
    firstNameRequired: "Prénom requis",
    lastNameRequired: "Nom requis",
    emailRequired: "Email requis",
    emailInvalid: "Format email invalide",
    addressRequired: "Adresse requise",
    cityRequired: "Ville requise",
    postalCodeRequired: "Code postal requis",
    paymentError: "Erreur de paiement. Veuillez réessayer.",
    emptyCart: "Votre panier est vide",
    emptyDescription: "Découvrez notre collection",
    continue: "CONTINUER",
    item: "article",
    items: "s",
    information: "Informations",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Email",
    phone: "Téléphone (optionnel)",
    shipping: "Livraison",
    address: "Adresse",
    addressComplement: "Complément d'adresse (optionnel)",
    city: "Ville",
    postalCode: "Code postal",
    payment: "Paiement",
    processing: "TRAITEMENT...",
    order: "COMMANDER",
    securePayment: "Paiement sécurisé",
    metaDescription: "Finaliser votre commande Kamba Lhains"
  },

  tracking: {
    title: "SUIVI DE COMMANDE",
    description: "Saisissez votre numéro de commande et votre adresse email pour suivre l'état de votre commande.",
    orderNumber: "Numéro de commande *",
    orderNumberPlaceholder: "Ex: KL2024080100123",
    email: "Adresse email *",
    emailPlaceholder: "votre@email.com",
    submitButton: "SUIVRE MA COMMANDE",
    importantInfo: "INFORMATIONS IMPORTANTES",
    orderNumberInfo: "Votre numéro de commande",
    orderNumberDesc: "vous a été envoyé par email lors de la confirmation de votre achat.",
    processingTimes: "Délais de traitement :",
    preparationTime: "Préparation de commande : 1-2 jours ouvrés",
    franceShipping: "Expédition France : 2-4 jours ouvrés (Colissimo) ou 1-2 jours (DHL Express)",
    internationalShipping: "Expédition internationale : 2-6 jours ouvrés selon destination",
    carrierTracking: "Suivi transporteur :",
    trackingEmail: "Un email avec le numéro de suivi vous sera envoyé dès l'expédition.",
    searchInProgress: "RECHERCHE EN COURS",
    searchingOrder: "Nous recherchons les informations de votre commande",
    featureComingSoon: "Cette fonctionnalité sera bientôt disponible. En attendant, vous pouvez :",
    checkEmail: "Vérifier votre email pour le numéro de suivi transporteur",
    trackOnCarrier: "Suivre directement sur les sites de nos transporteurs (Colissimo, DHL)",
    contactUs: "Nous contacter pour obtenir des informations",
    newSearch: "NOUVELLE RECHERCHE"
  },

  cart: {
    // ... (traductions existantes)
    emptyDescription: "Découvrez notre collection",
    clear: "Vider",
    summary: "Résumé",
    free: "Gratuite",
    processing: "TRAITEMENT...",
    securePayment: "Paiement sécurisé"
  },

  products: {
    // ... (traductions existantes)
    color: "Couleur",
    size: "Taille",
    previousImage: "Image précédente",
    nextImage: "Image suivante"
  }
}
```

---

## 🇬🇧 TRADUCTIONS ANGLAISES

Ajoutez ces traductions dans la section `en` de l'objet `translations` avec les mêmes clés mais en anglais.

---

## ✅ PROCHAINES ÉTAPES

1. **Ajoutez TOUTES ces traductions dans `utils/translations.ts`**
2. **Importez `useLanguage` dans chaque composant**
3. **Remplacez le texte en dur par `t('cle.de.traduction')`**

Par exemple, dans un composant :
```typescript
import { useLanguage } from '../contexts/LanguageContext';

const MonComposant = () => {
  const { t } = useLanguage();

  return (
    <button>{t('cart.checkout')}</button>
  );
};
```
