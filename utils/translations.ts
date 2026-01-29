export type Language = 'fr' | 'en';

export interface NavigationTranslations {
  home: string;
  shop: string;
  contact: string;
  kambavers: string;
  connection: string;
  aube: string;
  zenith: string;
  crepuscule: string;
  denim: string;
}

export interface HeroTranslations {
  title: string;
  tagline: string;
}

export interface HomePageTranslations {
  metaDescription: string;
}

export interface SectionTranslations {
  femaleModel: string;
  maleModel: string;
  newCollection: string;
  shop: string;
}

export interface LanguageTranslations {
  french: string;
  english: string;
}

export interface NewsletterTranslations {
  title: string;
  description: string;
  placeholder: string;
  subscribe: string;
  subscribing: string;
  disclaimer: string;
  errorGeneric: string;
}

export interface CustomerServiceLinksTranslations {
  contactForm: string;
  trackOrder: string;
  registerReturn: string;
  makeReturn: string;
  claim: string;
}

export interface FooterLinksTranslations {
  legal: string;
  faq: string;
  company: string;
  follow: string;
  legalNotices: string;
  salesConditions: string;
  privacyPolicy: string;
  termsOfUse: string;
  accessibility: string;
  account: string;
  deliveryInfo: string;
  orders: string;
  payments: string;
  returns: string;
  sizeGuide: string;
  giftCard: string;
  contactUs: string;
  stores: string;
  appointment: string;
  career: string;
  about: string;
  ourValues: string;
}

export interface FooterTranslations {
  newsletter: NewsletterTranslations;
  customerService: string;
  customerServiceLinks: CustomerServiceLinksTranslations;
  countryRegion: string;
  language: string;
  selectCountry: string;
  links: FooterLinksTranslations;
}

export interface ProductPageTranslations {
  colorLabel: string;
  sizeLabel: string;
  addToCartButton: string;
  descriptionBtn: string;
  sizeGuideBtn: string;
  careGuideBtn: string;
  deliveryTimeBtn: string;
  returnPolicyBtn: string;
  recommendedOptions: string;
  selectSizeColorAlert: string;
  allProducts: string;
}

export interface SizeGuideTranslations {
  title: string;
  sizeEU: string;
  sizeUS: string;
  chest: string;
  waist: string;
  hips: string;
  measurementsTitle: string;
  chestMeasure: string;
  waistMeasure: string;
  hipsMeasure: string;
  chooseSizeTitle: string;
  chooseSizeText: string;
  examplesTitle: string;
  example1: string;
  example2: string;
  example3: string;
  tipsTitle: string;
  tip1: string;
  tip2: string;
  tip3: string;
}

export interface CareGuideTranslations {
  title: string;
  materialLabel: string;
  cottonJersey: string;
  waistband: string;
  washTemp: string;
  nobleach: string;
  noDryer: string;
  ironLow: string;
  noDryCleaning: string;
  materialsIntro: string;
  sustainabilityText: string;
}

export interface BreadcrumbTranslations {
  zenith: string;
  aube: string;
  crepuscule: string;
  denim: string;
  haut: string;
  bas: string;
  veste: string;
  bombers: string;
  jupe: string;
  short: string;
  voileDeCorps: string;
}

export interface ProductTranslations {
  addToCart: string;
  addToFavorites: string;
  removeFromFavorites: string;
  selectSize: string;
  outOfStock: string;
  inStock: string;
  page: ProductPageTranslations;
  breadcrumb: BreadcrumbTranslations;
  sizeGuide: SizeGuideTranslations;
  careGuide: CareGuideTranslations;
}

export interface CartTranslations {
  title: string;
  empty: string;
  emptyDescription: string;
  continueButton: string;
  clear: string;
  color: string;
  size: string;
  total: string;
  subtotal: string;
  shipping: string;
  freeShipping: string;
  tax: string;
  checkout: string;
  processing: string;
  securePayment: string;
  continue: string;
  quantity: string;
  remove: string;
  summary: string;
}

export interface FavoritesTranslations {
  title: string;
  empty: string;
  emptyDescription: string;
  metaDescription: string;
}

export interface CheckoutTranslations {
  title: string;
  information: string;
  shipping: string;
  payment: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneOptional: string;
  address: string;
  address2: string;
  address2Optional: string;
  city: string;
  postalCode: string;
  country: string;
  processing: string;
  order: string;
  securePayment: string;
  items: string;
  item: string;
  // Erreurs de validation
  firstNameRequired: string;
  lastNameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  phoneRequired: string;
  addressRequired: string;
  cityRequired: string;
  postalCodeRequired: string;
  paymentError: string;
  // Panier vide
  emptyCart: string;
  emptyDescription: string;
  continueButton: string;
}

export interface AuthTranslations {
  // Titres
  login: string;
  register: string;
  createAccount: string;
  // Sous-titres
  loginSubtitle: string;
  registerSubtitle: string;
  // Formulaire
  firstName: string;
  firstNamePlaceholder: string;
  lastName: string;
  lastNamePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  confirmPassword: string;
  confirmPasswordPlaceholder: string;
  // Boutons
  loginButton: string;
  registerButton: string;
  processing: string;
  // Erreurs de validation
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMinLength: string;
  passwordMinLength8: string;
  passwordComplexity: string;
  firstNameRequired: string;
  lastNameRequired: string;
  confirmPasswordRequired: string;
  passwordsNotMatch: string;
  genericError: string;
  registeredPleaseLogin: string;
  // Liens
  forgotPassword: string;
  noAccount: string;
  hasAccount: string;
  // Social login
  or: string;
  continueWithGoogle: string;
  continueWithFacebook: string;
  continueWithApple: string;
  // Footer
  termsAcceptance: string;
  termsOfUse: string;
  and: string;
  privacyPolicy: string;
}

export interface HeaderTranslations {
  // Aria labels
  search: string;
  userAccount: string;
  favorites: string;
  cart: string;
  // Search modal
  searchPlaceholder: string;
  clear: string;
  close: string;
  suggestions: string;
  noProductsFound: string;
  tryOtherKeywords: string;
  collectionEmpty: string;
}

export interface SearchSuggestions {
  voileDeCorps: string;
  veste: string;
  denim: string;
  chemise: string;
  pantalon: string;
}

export interface MetaDescriptions {
  denim: string;
  crepuscule: string;
  aube: string;
  jupe: string;
  veste: string;
  short: string;
}

export interface CollectionIntros {
  denim: string;
  denimSection2: string;
  crepuscule: string;
  crepusculeSection2: string;
  aubeIntro: string;
  aubeDescription: string;
  allArticles: string;
}

export interface NewsletterPageTranslations {
  // Meta
  pageTitle: string;
  metaDescription: string;
  // Success page
  unsubscribeConfirmedTitle: string;
  subscribeConfirmedTitle: string;
  unsubscribeConfirmedMessage: string;
  subscribeConfirmedMessage: string;
  backToHomeButton: string;
  // Main page
  newsletterTitle: string;
  newsletterDescription: string;
  // What you'll receive section
  whatYouReceiveTitle: string;
  newCollectionsPreview: string;
  exclusiveOffers: string;
  behindTheScenes: string;
  fashionSustainabilityTips: string;
  specialEvents: string;
  // Our commitment section
  ourCommitmentTitle: string;
  qualityContent: string;
  dataRespect: string;
  oneClickUnsubscribe: string;
  frequencyRespected: string;
  personalizedContent: string;
  // Buttons
  subscribeButton: string;
  unsubscribeButton: string;
  // Form
  subscriptionFormTitle: string;
  unsubscriptionFormTitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  firstNameLabel: string;
  firstNamePlaceholder: string;
  // Interests
  interestsLabel: string;
  interestNewCollections: string;
  interestExclusiveOffers: string;
  interestBehindTheScenes: string;
  interestSustainabilityTips: string;
  interestEvents: string;
  // Frequency
  frequencyLabel: string;
  frequencyWeekly: string;
  frequencyBiweekly: string;
  frequencyMonthly: string;
  frequencyEventsOnly: string;
  // Submit buttons
  submitSubscribe: string;
  submitUnsubscribe: string;
  submittingSubscribe: string;
  submittingUnsubscribe: string;
  // Errors
  emailRequired: string;
  emailInvalid: string;
  firstNameRequired: string;
  submitError: string;
  connectionError: string;
  // Footer
  acceptanceText: string;
  privacyPolicyLink: string;
  privacyPolicyText: string;
  moreInfoText: string;
  // Social
  followUsTitle: string;
}

export interface ZenithTranslations {
  metaTitle: string;
  metaDescription: string;
  title: string;
  intro: string;
  description: string;
  section2Text: string;
  allArticles: string;
}

export interface ContactTranslations {
  metaTitle: string;
  metaDescription: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  category: string;
  selectCategory: string;
  selectOption: string;
  message: string;
  messagePlaceholder: string;
  charactersRemaining: string;
  attachFiles: string;
  chooseFiles: string;
  acceptedFormats: string;
  submit: string;
  submitting: string;
  fieldRequired: string;
  successMessage: string;
  errorMessage: string;
  categories: {
    order: string;
    career: string;
    press: string;
    other: string;
  };
  orderSubCategories: {
    tracking: string;
    modification: string;
    delivery: string;
    return: string;
    other: string;
  };
  careerSubCategories: {
    application: string;
    other: string;
  };
  pressSubCategories: {
    interview: string;
    pressKit: string;
    other: string;
  };
}

export interface AccountTranslations {
  title: string;
  metaDescription: string;
  welcome: string;
  edit: string;
  save: string;
  cancel: string;
  tabs: {
    informations: string;
    addresses: string;
    orders: string;
    preferences: string;
    security: string;
  };
  informations: {
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    memberSince: string;
  };
  addresses: {
    title: string;
    addNew: string;
    noAddresses: string;
  };
  orders: {
    title: string;
    noOrders: string;
    startShopping: string;
  };
  preferences: {
    title: string;
    language: string;
    newsletter: string;
  };
  security: {
    title: string;
    changePassword: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    updatePassword: string;
    logout: string;
    logoutDescription: string;
    logoutButton: string;
    deleteAccount: string;
    deleteAccountDescription: string;
    deleteAccountButton: string;
    deleteAccountConfirm: string;
    confirmDelete: string;
  };
  passwordsDoNotMatch: string;
  passwordChanged: string;
}

export interface CollectionSidebarTranslations {
  category: string;
  all: string;
  top: string;
  bottom: string;
  accessories: string;
  items: {
    tshirt: string;
    shirt: string;
    sweatshirt: string;
    bombers: string;
    jacket: string;
    denimJacket: string;
    pants: string;
    denimPants: string;
    baggyJeans: string;
    shorts: string;
    skirt: string;
    cargoPants: string;
    underwear: string;
    beanie: string;
    sportBag: string;
  };
}

export interface KambaversTranslations {
  metaTitle: string;
  metaDescription: string;
  indexTitle: string;
  indexDescription: string;
  menu: {
    brand: string;
    values: string;
    collections: string;
    stores: string;
  };
  brand: {
    familyStoryTitle: string;
    familyStoryDescription: string;
    familyStoryImageAlt: string;
    historyImageAlt: string;
    historyDescription: string;
  };
  charte: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    section1Title: string;
    section1Intro: string;
    section1Items: string[];
    section2Title: string;
    section2Intro: string;
    section2Items: string[];
    section3Title: string;
    section3Intro: string;
    section3Items: string[];
    section4Title: string;
    section4Intro: string;
    section4Items: string[];
    section5Title: string;
    section5Intro: string;
    section5Items: string[];
    conclusion: string;
    imageAlt1: string;
    imageAlt2: string;
  };
}

export interface LanguageTranslationSet {
  navigation: NavigationTranslations;
  hero: HeroTranslations;
  homePage: HomePageTranslations;
  sections: SectionTranslations;
  language: LanguageTranslations;
  footer: FooterTranslations;
  products: ProductTranslations;
  cart: CartTranslations;
  favorites: FavoritesTranslations;
  checkout: CheckoutTranslations;
  auth: AuthTranslations;
  header: HeaderTranslations;
  searchSuggestions: SearchSuggestions;
  meta: MetaDescriptions;
  collections: CollectionIntros;
  newsletter: NewsletterPageTranslations;
  zenith: ZenithTranslations;
  kambavers: KambaversTranslations;
  contact: ContactTranslations;
  account: AccountTranslations;
  sidebar: CollectionSidebarTranslations;
  common: {
    loading: string;
    saving: string;
    deleting: string;
  };
}

export interface Translations {
  [key: string]: LanguageTranslationSet;
}

export const translations: Translations = {
  fr: {
    navigation: {
      home: "Accueil",
      shop: "Boutique",
      contact: "Contact",
      kambavers: "Kambavers",
      connection: "Connexion",
      aube: "Aube",
      zenith: "Zenith",
      crepuscule: "Crépuscule",
      denim: "Denim"
    },
    hero: {
      title: "BLACK TO THE BASICS",
      tagline: "CRÉÉ POUR\nDES GÉNÉRATIONS"
    },
    homePage: {
      metaDescription: "Kamba Lhains - Marque de mode alliant élégance et modernité. Découvrez nos collections femme et homme."
    },
    sections: {
      femaleModel: "Modèle féminin",
      maleModel: "Modèle masculin",
      newCollection: "SHADOW BURST",
      shop: "BOUTIQUE"
    },
    language: {
      french: "Français",
      english: "English"
    },
    footer: {
      newsletter: {
        title: "S'abonner à la newsletter",
        description: "Inscrivez-vous pour recevoir par e-mail toutes les informations sur nos dernières collections, nos produits, nos défilés de mode et nos projets.",
        placeholder: "Email",
        subscribe: "S'inscrire",
        subscribing: "Inscription...",
        disclaimer: "J'accepte de recevoir la newsletter de KAMBA LHAINS pour être informé(e) en avant-première des nouvelles collections, des événements de la marque et des offres spéciales. En m'abonnant, j'accepte la Politique de confidentialité de KAMBA LHAINS.",
        errorGeneric: "Une erreur est survenue"
      },
      customerService: "Service Client",
      customerServiceLinks: {
        contactForm: "Formulaire de contact",
        trackOrder: "Suivre une commande",
        registerReturn: "Enregistrer un retour",
        makeReturn: "Faire un retour",
        claim: "Réclamation"
      },
      countryRegion: "Pays/Région",
      language: "Langue",
      selectCountry: "Sélectionner un pays",
      links: {
        legal: "Mentions légales et cookies",
        faq: "AIDE",
        company: "Entreprise",
        follow: "Nous suivre",
        legalNotices: "Mentions légales",
        salesConditions: "Conditions de vente",
        privacyPolicy: "Politique de confidentialité",
        termsOfUse: "Conditions générales d'utilisation",
        accessibility: "Accessibilité",
        account: "Compte",
        deliveryInfo: "Informations de livraison",
        orders: "Commandes",
        payments: "Paiements",
        returns: "Retours & échanges",
        sizeGuide: "Guide des tailles",
        giftCard: "Carte Cadeau",
        contactUs: "Nous contacter",
        stores: "Nos boutiques",
        appointment: "Prendre un rendez-vous en boutique",
        career: "Carrière",
        about: "A propos",
        ourValues: "Nos valeurs"
      }
    },
    products: {
      addToCart: "Ajouter au panier",
      addToFavorites: "Ajouter aux favoris",
      removeFromFavorites: "Retirer des favoris",
      selectSize: "Sélectionner la taille",
      outOfStock: "Rupture de stock",
      inStock: "En stock",
      page: {
        colorLabel: "Couleur :",
        sizeLabel: "Taille",
        addToCartButton: "AJOUTER AU PANIER",
        descriptionBtn: "Description",
        sizeGuideBtn: "Guide des tailles",
        careGuideBtn: "Guide d'entretien",
        deliveryTimeBtn: "Délais de livraison",
        returnPolicyBtn: "Retour et remboursement",
        recommendedOptions: "DES OPTIONS À EXPLORER",
        selectSizeColorAlert: "Veuillez sélectionner une taille et une couleur",
        allProducts: "Tous les articles"
      },
      breadcrumb: {
        zenith: "Zénith",
        aube: "Aube",
        crepuscule: "Crépuscule",
        denim: "Denim",
        haut: "Haut",
        bas: "Bas",
        veste: "Veste",
        bombers: "Bombers",
        jupe: "Jupe",
        short: "Short",
        voileDeCorps: "Voile de corps"
      },
      sizeGuide: {
        title: "COMMENT UTILISER CE TABLEAU DE TAILLES",
        sizeEU: "Taille EU",
        sizeUS: "Taille US",
        chest: "Tour de poitrine (cm)",
        waist: "Tour de taille (cm)",
        hips: "Tour de hanches (cm)",
        measurementsTitle: "PRENDRE LES BONNES MESURES",
        chestMeasure: "Tour de poitrine : Mesurez horizontalement au niveau le plus fort de la poitrine.",
        waistMeasure: "Tour de taille : Mesurez à l'endroit le plus étroit de la taille naturelle.",
        hipsMeasure: "Tour de hanches : Mesurez horizontalement au niveau le plus large des hanches.",
        chooseSizeTitle: "CHOISIR LA TAILLE",
        chooseSizeText: "Comparez vos mesures avec le tableau ci-dessus. Si vos mesures se situent entre deux tailles, nous recommandons de choisir la taille supérieure pour un ajustement plus confortable.",
        examplesTitle: "EXEMPLES D'APPLICATION",
        example1: "Si votre tour de poitrine est de 90 cm, votre tour de taille de 70 cm et votre tour de hanches de 94 cm, la taille S est recommandée.",
        example2: "Si vos mesures sont : poitrine 95 cm, taille 75 cm et hanches 99 cm, la taille M conviendra parfaitement.",
        example3: "Si vous mesurez : poitrine 92 cm, taille 73 cm et hanches 97 cm (entre S et M), nous conseillons la taille M pour plus de confort.",
        tipsTitle: "CONSEILS SUPPLÉMENTAIRES",
        tip1: "Nos vêtements sont conçus pour un ajustement régulier. Pour un style plus ample, optez pour la taille au-dessus.",
        tip2: "En cas de doute, n'hésitez pas à nous contacter pour des conseils personnalisés.",
        tip3: "Toutes les mesures sont données en centimètres et peuvent varier de ±2 cm selon les modèles."
      },
      careGuide: {
        title: "MATIÈRE & INSTRUCTIONS D'ENTRETIEN",
        materialLabel: "Matière",
        cottonJersey: "100% Coton - Jersey",
        waistband: "Ceinture: 97% Coton, 3% Élasthanne",
        washTemp: "Facile d'entretien 30 °C",
        nobleach: "Ne pas blanchir",
        noDryer: "Ne pas utiliser le sèche-linge",
        ironLow: "Repassage à température faible",
        noDryCleaning: "Pas de nettoyage à sec chimique",
        materialsIntro: "Nous sélectionnons avec soin nos matières, en privilégiant principalement des tissus 100% naturels, ainsi que des textiles issus de stocks dormants et de fins de séries. Cette démarche peut entraîner de légères variations d'une pièce à l'autre, mais nous veillons toujours à préserver une harmonie visuelle et une esthétique fidèle aux modèles présentés et proposés à la vente.",
        sustainabilityText: "Il nous arrive également d'utiliser des matières synthétiques, mais uniquement lorsqu'elles sont issues de filières de recyclage, afin de limiter notre impact et de valoriser l'existant. Notre approche repose ainsi sur une création responsable et engagée, où chaque pièce porte en elle l'histoire du textile auquel nous offrons une seconde vie."
      }
    },
    cart: {
      title: "Panier",
      empty: "Votre panier est vide",
      emptyDescription: "Découvrez notre collection",
      continueButton: "CONTINUER",
      clear: "Vider",
      color: "Couleur",
      size: "Taille",
      total: "Total",
      subtotal: "Sous-total",
      shipping: "Livraison",
      freeShipping: "Gratuite",
      tax: "TVA",
      checkout: "COMMANDER",
      processing: "TRAITEMENT...",
      securePayment: "Paiement sécurisé",
      continue: "Continuer les achats",
      quantity: "Quantité",
      remove: "Supprimer",
      summary: "Résumé"
    },
    favorites: {
      title: "Favoris",
      empty: "Aucun produit dans vos favoris",
      emptyDescription: "Ajoutez des produits à vos favoris pour les retrouver facilement",
      metaDescription: "Vos produits favoris Kamba Lhains"
    },
    checkout: {
      title: "Checkout",
      information: "Informations",
      shipping: "Livraison",
      payment: "Paiement",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email",
      phone: "Téléphone",
      phoneOptional: "Téléphone (optionnel)",
      address: "Adresse",
      address2: "Complément d'adresse",
      address2Optional: "Complément d'adresse (optionnel)",
      city: "Ville",
      postalCode: "Code postal",
      country: "Pays",
      processing: "TRAITEMENT...",
      order: "COMMANDER",
      securePayment: "Paiement sécurisé",
      items: "articles",
      item: "article",
      firstNameRequired: "Prénom requis",
      lastNameRequired: "Nom requis",
      emailRequired: "Email requis",
      emailInvalid: "Format email invalide",
      phoneRequired: "Téléphone requis",
      addressRequired: "Adresse requise",
      cityRequired: "Ville requise",
      postalCodeRequired: "Code postal requis",
      paymentError: "Erreur de paiement. Veuillez réessayer.",
      emptyCart: "Votre panier est vide",
      emptyDescription: "Découvrez notre collection",
      continueButton: "CONTINUER"
    },
    auth: {
      login: "Connexion",
      register: "Inscription",
      createAccount: "Créer un compte",
      loginSubtitle: "Accédez à votre espace personnel KAMBA LHAINS",
      registerSubtitle: "Rejoignez la communauté KAMBA LHAINS",
      firstName: "Prénom",
      firstNamePlaceholder: "Votre prénom",
      lastName: "Nom",
      lastNamePlaceholder: "Votre nom",
      email: "Email",
      emailPlaceholder: "votre@email.com",
      password: "Mot de passe",
      passwordPlaceholder: "••••••••",
      confirmPassword: "Confirmer le mot de passe",
      confirmPasswordPlaceholder: "••••••••",
      loginButton: "Se connecter",
      registerButton: "Créer mon compte",
      processing: "Traitement...",
      emailRequired: "L'email est requis",
      emailInvalid: "Format d'email invalide",
      passwordRequired: "Le mot de passe est requis",
      passwordMinLength: "Le mot de passe doit contenir au moins 6 caractères",
      passwordMinLength8: "Le mot de passe doit contenir au moins 8 caractères",
      passwordComplexity: "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un symbole",
      firstNameRequired: "Le prénom est requis",
      lastNameRequired: "Le nom est requis",
      confirmPasswordRequired: "Confirmez votre mot de passe",
      passwordsNotMatch: "Les mots de passe ne correspondent pas",
      genericError: "Une erreur est survenue. Veuillez réessayer.",
      registeredPleaseLogin: "Compte créé avec succès. Veuillez vous connecter.",
      forgotPassword: "Mot de passe oublié ?",
      noAccount: "Pas encore de compte ?",
      hasAccount: "Déjà un compte ?",
      or: "ou",
      continueWithGoogle: "Continuer avec Google",
      continueWithFacebook: "Continuer avec Facebook",
      continueWithApple: "Continuer avec Apple",
      termsAcceptance: "En continuant, vous acceptez nos",
      termsOfUse: "Conditions d'utilisation",
      and: "et notre",
      privacyPolicy: "Politique de confidentialité"
    },
    header: {
      search: "Rechercher",
      userAccount: "Compte utilisateur",
      favorites: "Favoris",
      cart: "Panier",
      searchPlaceholder: "Rechercher un produit...",
      clear: "Effacer",
      close: "Fermer",
      suggestions: "Suggestions",
      noProductsFound: "Aucun produit trouvé",
      tryOtherKeywords: "Essayez avec d'autres mots-clés",
      collectionEmpty: "Cette collection ne contient pas encore de produits"
    },
    searchSuggestions: {
      voileDeCorps: "Voile de Corps",
      veste: "Veste",
      denim: "Denim",
      chemise: "Chemise",
      pantalon: "Pantalon"
    },
    meta: {
      denim: "Découvrez notre collection Denim - Des pièces uniques en denim.",
      crepuscule: "Découvrez notre collection Crépuscule - La beauté de la fin de journée.",
      aube: "Découvrez notre collection Aube - Le début d'une nouvelle journée.",
      jupe: "Découvrez nos Jupes Zénith - L'apogée du style élégant et raffiné.",
      veste: "Découvrez nos vestes - L'apogée du style.",
      short: "Découvrez nos Shorts Zénith - L'apogée du style décontracté et raffiné."
    },
    collections: {
      denim: "Chez kamba Lhains, le jean retrouve sa noblesse première. Issu d'une démarche artisanale rigoureuse, le denim est travaillé pour révéler toute sa texture et son caractère. Chaque pièce, loin des codes éphémères, incarne une vision intemporelle où la matière brute rencontre la coupe architecturale. Une collection pensée pour celles et ceux qui recherchent l'essence plutôt que l'apparence.",
      denimSection2: "Chaque pièce s'ancre résolument dans le présent : coupes affûtées, lignes franches, allure urbaine sans concession. Le brut devient contemporain, et la mémoire textile se transforme en geste actuel, pensé pour durer, évoluer, accompagner.\nIci, le denim n'est pas un simple tissu — c'est un compagnon, une matière qui s'écrit à même la peau, une archive personnelle en devenir.",
      crepuscule: "Le Crépuscule célèbre l'instant fragile où le jour rencontre la nuit, où la lumière douce enveloppe toute chose d'une aura poétique. Cette collection incarne une élégance contemplative, une féminité assumée dans la sobriété. Les silhouettes épurées jouent avec les transparences et les matières fluides, créant un dialogue subtil entre révéler et suggérer. Le Crépuscule, c'est l'art de l'équilibre, une invitation à habiter le présent avec grâce.",
      crepusculeSection2: "Chaque création traduit cette transition subtile, mêlant une sophistication contemporaine à la beauté brute de la nature. Un hommage aux instants suspendus où tout semble possible, portés par une allure intemporelle.",
      aubeIntro: "Les essentiels qui illuminent votre style dès le premier instant\n\nL'Aube capture la magie des premiers rayons du jour, lorsque la lumière adoucit tout ce qu'elle touche. Notre collection s'inspire de cette clarté matinale pour proposer des pièces au style pur, délicat et naturellement élégant.",
      aubeDescription: "Confectionnés dans des matières authentiques et confortables, nos vêtements enveloppent la silhouette avec une douceur subtile. Les tailles hautes d'inspiration vintage se mêlent à des coupes contemporaines, créant un équilibre parfait entre intemporalité et modernité.\n\nChaque pièce est imaginée pour accompagner vos mouvements avec simplicité et aisance : des essentiels du quotidien qui subliment la silhouette sans effort et apportent cette sensation d'évidence dès que la journée commence.",
      allArticles: "Tous les articles"
    },
    newsletter: {
      pageTitle: "Newsletter - Kamba Lhains",
      metaDescription: "Inscrivez-vous à la newsletter Kamba Lhains pour recevoir nos dernières actualités, collections exclusives et conseils mode durable.",
      unsubscribeConfirmedTitle: "Désabonnement confirmé - Newsletter Kamba Lhains",
      subscribeConfirmedTitle: "Inscription confirmée - Newsletter Kamba Lhains",
      unsubscribeConfirmedMessage: "Vous avez été désabonné(e) de notre newsletter. Nous regrettons de vous voir partir.",
      subscribeConfirmedMessage: "Merci pour votre inscription ! Vous recevrez bientôt nos dernières actualités.",
      backToHomeButton: "RETOUR À L'ACCUEIL",
      newsletterTitle: "NEWSLETTER KAMBA LHAINS",
      newsletterDescription: "Restez informé(e) de nos dernières créations, événements exclusifs et conseils pour une mode plus responsable. Rejoignez notre communauté.",
      whatYouReceiveTitle: "CE QUE VOUS RECEVREZ",
      newCollectionsPreview: "Avant-premières des nouvelles collections",
      exclusiveOffers: "Offres exclusives et ventes privées",
      behindTheScenes: "Coulisses de la création",
      fashionSustainabilityTips: "Conseils mode et durabilité",
      specialEvents: "Invitations aux événements spéciaux",
      ourCommitmentTitle: "NOTRE ENGAGEMENT",
      qualityContent: "Contenu de qualité, jamais de spam",
      dataRespect: "Respect de vos données personnelles",
      oneClickUnsubscribe: "Désabonnement en un clic",
      frequencyRespected: "Fréquence d'envoi respectée",
      personalizedContent: "Contenu personnalisé selon vos intérêts",
      subscribeButton: "S'ABONNER",
      unsubscribeButton: "SE DÉSABONNER",
      subscriptionFormTitle: "ABONNEMENT",
      unsubscriptionFormTitle: "DÉSABONNEMENT",
      emailLabel: "Adresse email *",
      emailPlaceholder: "votre@email.com",
      firstNameLabel: "Prénom *",
      firstNamePlaceholder: "Votre prénom",
      interestsLabel: "Centres d'intérêt (optionnel)",
      interestNewCollections: "Nouvelles collections",
      interestExclusiveOffers: "Offres exclusives",
      interestBehindTheScenes: "Coulisses de la marque",
      interestSustainabilityTips: "Conseils durabilité",
      interestEvents: "Événements spéciaux",
      frequencyLabel: "Fréquence souhaitée",
      frequencyWeekly: "Hebdomadaire",
      frequencyBiweekly: "Bi-mensuelle",
      frequencyMonthly: "Mensuelle",
      frequencyEventsOnly: "Événements uniquement",
      submitSubscribe: "M'INSCRIRE",
      submitUnsubscribe: "ME DÉSABONNER",
      submittingSubscribe: "INSCRIPTION...",
      submittingUnsubscribe: "DÉSABONNEMENT...",
      emailRequired: "L'email est requis",
      emailInvalid: "Email invalide",
      firstNameRequired: "Le prénom est requis",
      submitError: "Une erreur est survenue",
      connectionError: "Erreur de connexion au serveur",
      acceptanceText: "En vous inscrivant, vous acceptez de recevoir des emails marketing de notre part. Vous pouvez vous désabonner à tout moment en cliquant sur le lien de désabonnement présent dans chaque email. Consultez notre",
      privacyPolicyLink: "/politique-confidentialite",
      privacyPolicyText: "politique de confidentialité",
      moreInfoText: "pour plus d'informations sur le traitement de vos données.",
      followUsTitle: "SUIVEZ-NOUS AUSSI SUR"
    },
    zenith: {
      metaTitle: "Zénith - Kamba Lhains",
      metaDescription: "Découvrez notre collection Zénith - L'apogée du style.",
      title: "Zénith",
      intro: "Quand la lumière atteint son apogée et révèle l'essence du style",
      description: "Le Zénith incarne ce moment de pleine intensité, lorsque le soleil culmine et que chaque détail se révèle avec éclat. Notre collection traduit cette énergie solaire à travers des pièces qui célèbrent la liberté, la sensualité et la puissance d'être soi.",
      section2Text: "Conçus en matières organiques et recyclées, nos vêtements allient conscience écologique et sophistication. Les coupes se déploient en deux mouvements harmonieux : des silhouettes vaporeuses et voluptueuses qui se laissent porter par l'air, et des lignes plus proches du corps, sensuelles et assumées, dessinant une allure naturellement sexy sans jamais sacrifier le confort.\n\nLes imprimés, originaux et inspirés d'un héritage précolonial africain, revisitent symboles et textures ancestrales pour créer des motifs vibrants, chargés d'histoire et de modernité. Ils donnent à chaque pièce une aura singulière, presque solaire.",
      allArticles: "Tous les articles"
    },
    kambavers: {
      metaTitle: "Kambavers - Kamba Lhains",
      metaDescription: "L'univers Kambavers incarne l'essence de la créativité africaine contemporaine, fusionnant héritage culturel et innovation moderne.",
      indexTitle: "KAMBAVERS",
      indexDescription: "L'inspiration de Kamba Lhains repose sur une dualité subtile, une opposition qui, loin de se contrarier, donne naissance à une création unique et singulière. Nous fusionnons des mondes apparemment opposés pour inventer un univers où l'héritage rencontre l'innovation, et où la modernité dialogue avec la tradition. Cette dynamique crée une esthétique sans égale, un équilibre parfait entre le passé et le futur, entre l'Afrique et l'Europe, une invitation à découvrir de nouvelles formes d'élégance.\n\nPour en savoir plus sur notre univers, nous vous invitons à découvrir l'histoire de Kamba Lhains a travers nos rubriques, <strong>La Marque</strong> ainsi que <strong>Nos valeurs</strong>.",
      menu: {
        brand: "LA MARQUE",
        values: "NOS VALEURS",
        collections: "COLLECTIONS",
        stores: "POINTS DE VENTE"
      },
      brand: {
        familyStoryTitle: "Une histoire de famille",
        familyStoryDescription: "Kamba Lhains est née du désir de Lhains Obel de célébrer sa mère, Kamba Abie, et l'héritage qu'elle lui a transmis. La maison puise dans la mémoire familiale et la beauté du quotidien pour créer des collections non genrées, inclusives et conscientes. Chaque pièce reflète l'importance de l'humain et de la planète, mêlant style, sens et durabilité.",
        familyStoryImageAlt: "Une histoire de famille - Kamba Lhains",
        historyImageAlt: "Histoire de Kamba Lhains",
        historyDescription: "En 2025, Tricia Obel prend les rênes de la maison, tandis que Lhains se consacre pleinement à la création. La maison puise son énergie dans la simplicité, la nature et l'art de vivre contemporain, fidèle aux valeurs héritées de la mère et de la grand-mère. Chaque vêtement raconte une histoire, relie passé et présent, et fait de l'être le cœur de son univers.<br />Kamba Lhains propose ainsi une mode intemporelle, consciente et inclusive, où style et héritage se rencontrent."
      },
      charte: {
        metaTitle: "Nos valeurs - Kambavers - Kamba Lhains",
        metaDescription: "Découvrez nos valeurs éthiques et nos engagements en matière de mode responsable, respect humain et protection environnementale.",
        title: "Nos valeurs",
        intro: "Chez Kamba Lhains, nous croyons que la mode peut et doit être porteuse de sens. Au-delà du style, nos créations reflètent un engagement profond envers l'humain, les animaux et la planète. Ces valeurs incarnent les fondements de notre marque et guident chacune de nos décisions.",
        section1Title: "1. Une mode éthique, centrée sur l'humain",
        section1Intro: "Nous nous engageons à :",
        section1Items: [
          "Garantir des conditions de travail justes, sûres et respectueuses pour toutes les personnes impliquées dans la fabrication de nos vêtements.",
          "Collaborer uniquement avec des partenaires et fournisseurs partageant nos exigences en matière de droits humains et de dignité au travail.",
          "Favoriser l'artisanat, les savoir-faire locaux et le commerce équitable."
        ],
        section2Title: "2. Le respect du bien-être animal",
        section2Intro: "Nous refusons l'exploitation animale à des fins de mode. Nous nous engageons à :",
        section2Items: [
          "N'utiliser aucune matière d'origine animale issue de pratiques cruelles (fourrure, cuir conventionnel, plumes non traçables…).",
          "Favoriser les alternatives responsables et vegan lorsqu'elles sont disponibles et pertinentes."
        ],
        section3Title: "3. Une démarche éco-responsable",
        section3Intro: "Nous mettons un point d'honneur à limiter notre impact environnemental à chaque étape du processus :",
        section3Items: [
          "Choix de matières premières durables, biologiques ou recyclées.",
          "Production raisonnée pour éviter le gaspillage et les invendus.",
          "Réduction des emballages superflus, avec des matériaux recyclables ou compostables."
        ],
        section4Title: "4. Des partenaires alignés avec nos valeurs",
        section4Intro: "Chaque collaboration est soigneusement sélectionnée. Nous exigeons de nos partenaires :",
        section4Items: [
          "Une transparence totale sur leurs pratiques.",
          "Une adhésion réelle à des principes sociaux, éthiques et écologiques exigeants.",
          "Un engagement continu à s'améliorer dans ces domaines."
        ],
        section5Title: "5. Une transparence sincère envers notre communauté",
        section5Intro: "Nous nous engageons à :",
        section5Items: [
          "Communiquer de manière claire sur nos choix, nos progrès et nos limites.",
          "Éduquer et sensibiliser à une mode plus responsable, sans greenwashing ni promesses irréalistes."
        ],
        conclusion: "Kamba Lhains n'est pas une mode de passage. C'est un engagement durable. Une alliance entre esthétique et conscience, pour une mode qui fait du bien — à ceux qui la portent, à ceux qui la fabriquent, et au monde qui nous entoure.",
        imageAlt1: "Nos valeurs - Kamba Lhains",
        imageAlt2: "Détails de nos valeurs - Kamba Lhains"
      }
    },
    contact: {
      metaTitle: "Contact - Kamba Lhains",
      metaDescription: "Contactez Kamba Lhains pour toute question sur nos collections.",
      title: "NOUS CONTACTER",
      firstName: "Prénom *",
      lastName: "Nom *",
      email: "Email *",
      phone: "Téléphone",
      category: "Catégorie",
      selectCategory: "Sélectionnez une catégorie",
      selectOption: "Sélectionnez une option",
      message: "Message",
      messagePlaceholder: "Écrivez ici votre message concernant une commande effectuée, n'oubliez pas d'indiquer son numéro",
      charactersRemaining: "400 caractère(s) restant(s)",
      attachFiles: "Joindre des fichiers (documents complémentaires)",
      chooseFiles: "Choisir un ou plusieurs fichiers",
      acceptedFormats: "Formats acceptés : PDF, DOC, DOCX, TXT (Max 5 Mo par fichier)",
      submit: "SOUMETTRE",
      submitting: "ENVOI EN COURS...",
      fieldRequired: "Ce champ est requis",
      successMessage: "Merci pour votre message ! Nous vous répondrons dans les plus brefs délais. Un email de confirmation vous a été envoyé.",
      errorMessage: "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
      categories: {
        order: "Commande",
        career: "Carrière",
        press: "Presse",
        other: "Autre"
      },
      orderSubCategories: {
        tracking: "Suivi",
        modification: "Modification",
        delivery: "Livraison",
        return: "Retour et échange",
        other: "Autre"
      },
      careerSubCategories: {
        application: "Candidature spontanée",
        other: "Autre"
      },
      pressSubCategories: {
        interview: "Demande d'interview",
        pressKit: "Demande de dossier de presse",
        other: "Autre"
      }
    },
    account: {
      title: "Mon Compte",
      metaDescription: "Gérez votre compte Kamba Lhains - Informations personnelles, adresses, commandes et préférences",
      welcome: "Bienvenue",
      edit: "Modifier",
      save: "Enregistrer",
      cancel: "Annuler",
      tabs: {
        informations: "Informations",
        addresses: "Adresses",
        orders: "Commandes",
        preferences: "Préférences",
        security: "Sécurité"
      },
      informations: {
        title: "Informations personnelles",
        firstName: "Prénom",
        lastName: "Nom",
        email: "Email",
        phone: "Téléphone",
        memberSince: "Membre depuis"
      },
      addresses: {
        title: "Adresses de livraison",
        addNew: "Ajouter une adresse",
        noAddresses: "Aucune adresse enregistrée"
      },
      orders: {
        title: "Historique des commandes",
        noOrders: "Vous n'avez pas encore passé de commande",
        startShopping: "Découvrir nos produits"
      },
      preferences: {
        title: "Préférences",
        language: "Langue",
        newsletter: "Recevoir la newsletter"
      },
      security: {
        title: "Sécurité",
        changePassword: "Changer le mot de passe",
        currentPassword: "Mot de passe actuel",
        newPassword: "Nouveau mot de passe",
        confirmNewPassword: "Confirmer le nouveau mot de passe",
        updatePassword: "Mettre à jour le mot de passe",
        logout: "Déconnexion",
        logoutDescription: "Vous serez déconnecté de votre compte",
        logoutButton: "Se déconnecter",
        deleteAccount: "Supprimer mon compte",
        deleteAccountDescription: "Cette action est irréversible. Toutes vos données seront définitivement supprimées.",
        deleteAccountButton: "Supprimer mon compte",
        deleteAccountConfirm: "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
        confirmDelete: "Oui, supprimer mon compte"
      },
      passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
      passwordChanged: "Votre mot de passe a été modifié avec succès"
    },
    sidebar: {
      category: "Catégorie",
      all: "TOUS",
      top: "HAUT",
      bottom: "BAS",
      accessories: "ACCESSOIRES",
      items: {
        tshirt: "T-SHIRT",
        shirt: "CHEMISE",
        sweatshirt: "SWEAT-SHIRT",
        bombers: "BOMBERS",
        jacket: "VESTE",
        denimJacket: "VESTE",
        pants: "PANTALON",
        denimPants: "PANTALON",
        baggyJeans: "BAGGY JEANS",
        shorts: "SHORT",
        skirt: "JUPE",
        cargoPants: "PANTALON CARGO",
        underwear: "SOUS-VÊTEMENTS",
        beanie: "BONNET",
        sportBag: "SAC DE SPORT"
      }
    },
    common: {
      loading: "Chargement...",
      saving: "Enregistrement...",
      deleting: "Suppression..."
    }
  },
  en: {
    navigation: {
      home: "Home",
      shop: "Shop",
      contact: "Contact",
      kambavers: "Kambavers",
      connection: "Login",
      aube: "Dawn",
      zenith: "Zenith",
      crepuscule: "Twilight",
      denim: "Denim"
    },
    hero: {
      title: "BLACK TO THE BASICS",
      tagline: "MADE FOR\nGENERATIONS"
    },
    homePage: {
      metaDescription: "Kamba Lhains - Fashion brand combining elegance and modernity. Discover our women's and men's collections."
    },
    sections: {
      femaleModel: "Female Model",
      maleModel: "Male Model",
      newCollection: "SHADOW BURST",
      shop: "SHOP"
    },
    language: {
      french: "Français",
      english: "English"
    },
    footer: {
      newsletter: {
        title: "Subscribe to newsletter",
        description: "Sign up to receive by email all information about our latest collections, our products, our fashion shows and our projects.",
        placeholder: "Email",
        subscribe: "Subscribe",
        subscribing: "Subscribing...",
        disclaimer: "I accept to receive the KAMBA LHAINS newsletter to be informed in advance of new collections, brand events and special offers. By subscribing, I accept the KAMBA LHAINS Privacy Policy.",
        errorGeneric: "An error occurred"
      },
      customerService: "Customer Service",
      customerServiceLinks: {
        contactForm: "Contact form",
        trackOrder: "Track an order",
        registerReturn: "Register a return",
        makeReturn: "Make a return",
        claim: "Claim"
      },
      countryRegion: "Country/Region",
      language: "Language",
      selectCountry: "Select a country",
      links: {
        legal: "Legal notices and cookies",
        faq: "HELP",
        company: "Company",
        follow: "Follow us",
        legalNotices: "Legal notices",
        salesConditions: "Terms of sale",
        privacyPolicy: "Privacy policy",
        termsOfUse: "Terms of use",
        accessibility: "Accessibility",
        account: "Account",
        deliveryInfo: "Delivery information",
        orders: "Orders",
        payments: "Payments",
        returns: "Returns & exchanges",
        sizeGuide: "Size guide",
        giftCard: "Gift Card",
        contactUs: "Contact us",
        stores: "Our stores",
        appointment: "Book an appointment in store",
        career: "Career",
        about: "About",
        ourValues: "Our values"
      }
    },
    products: {
      addToCart: "Add to cart",
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
      selectSize: "Select size",
      outOfStock: "Out of stock",
      inStock: "In stock",
      page: {
        colorLabel: "Color:",
        sizeLabel: "Size",
        addToCartButton: "ADD TO CART",
        descriptionBtn: "Description",
        sizeGuideBtn: "Size guide",
        careGuideBtn: "Care guide",
        deliveryTimeBtn: "Delivery times",
        returnPolicyBtn: "Return and refund",
        recommendedOptions: "OPTIONS TO EXPLORE",
        selectSizeColorAlert: "Please select a size and color",
        allProducts: "All products"
      },
      breadcrumb: {
        zenith: "Zenith",
        aube: "Dawn",
        crepuscule: "Twilight",
        denim: "Denim",
        haut: "Top",
        bas: "Bottom",
        veste: "Jacket",
        bombers: "Bombers",
        jupe: "Skirt",
        short: "Shorts",
        voileDeCorps: "Body veil"
      },
      sizeGuide: {
        title: "HOW TO USE THIS SIZE CHART",
        sizeEU: "EU Size",
        sizeUS: "US Size",
        chest: "Chest (cm)",
        waist: "Waist (cm)",
        hips: "Hips (cm)",
        measurementsTitle: "TAKING THE RIGHT MEASUREMENTS",
        chestMeasure: "Chest: Measure horizontally at the fullest part of the chest.",
        waistMeasure: "Waist: Measure at the narrowest point of the natural waist.",
        hipsMeasure: "Hips: Measure horizontally at the widest part of the hips.",
        chooseSizeTitle: "CHOOSING YOUR SIZE",
        chooseSizeText: "Compare your measurements with the chart above. If your measurements fall between two sizes, we recommend choosing the larger size for a more comfortable fit.",
        examplesTitle: "APPLICATION EXAMPLES",
        example1: "If your chest is 90 cm, waist 70 cm and hips 94 cm, size S is recommended.",
        example2: "If your measurements are: chest 95 cm, waist 75 cm and hips 99 cm, size M will fit perfectly.",
        example3: "If you measure: chest 92 cm, waist 73 cm and hips 97 cm (between S and M), we recommend size M for more comfort.",
        tipsTitle: "ADDITIONAL TIPS",
        tip1: "Our garments are designed for a regular fit. For a looser style, opt for the size up.",
        tip2: "If in doubt, don't hesitate to contact us for personalized advice.",
        tip3: "All measurements are given in centimeters and may vary by ±2 cm depending on the model."
      },
      careGuide: {
        title: "MATERIAL & CARE INSTRUCTIONS",
        materialLabel: "Material",
        cottonJersey: "100% Cotton - Jersey",
        waistband: "Waistband: 97% Cotton, 3% Elastane",
        washTemp: "Easy care at 30°C",
        nobleach: "Do not bleach",
        noDryer: "Do not tumble dry",
        ironLow: "Iron at low temperature",
        noDryCleaning: "No chemical dry cleaning",
        materialsIntro: "We carefully select our materials, primarily favoring 100% natural fabrics, as well as textiles from dormant stocks and end-of-series. This approach may result in slight variations from piece to piece, but we always ensure visual harmony and aesthetics faithful to the models presented and offered for sale.",
        sustainabilityText: "We also sometimes use synthetic materials, but only when they come from recycling channels, in order to limit our impact and valorize existing resources. Our approach is thus based on responsible and committed creation, where each piece carries within it the story of the textile to which we offer a second life."
      }
    },
    cart: {
      title: "Cart",
      empty: "Your cart is empty",
      emptyDescription: "Discover our collection",
      continueButton: "CONTINUE",
      clear: "Clear",
      color: "Color",
      size: "Size",
      total: "Total",
      subtotal: "Subtotal",
      shipping: "Shipping",
      freeShipping: "Free",
      tax: "Tax",
      checkout: "CHECKOUT",
      processing: "PROCESSING...",
      securePayment: "Secure payment",
      continue: "Continue shopping",
      quantity: "Quantity",
      remove: "Remove",
      summary: "Summary"
    },
    favorites: {
      title: "Favorites",
      empty: "No products in your favorites",
      emptyDescription: "Add products to your favorites to find them easily",
      metaDescription: "Your favorite Kamba Lhains products"
    },
    checkout: {
      title: "Checkout",
      information: "Information",
      shipping: "Shipping",
      payment: "Payment",
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      phone: "Phone",
      phoneOptional: "Phone (optional)",
      address: "Address",
      address2: "Address line 2",
      address2Optional: "Address line 2 (optional)",
      city: "City",
      postalCode: "Postal code",
      country: "Country",
      processing: "PROCESSING...",
      order: "ORDER",
      securePayment: "Secure payment",
      items: "items",
      item: "item",
      firstNameRequired: "First name required",
      lastNameRequired: "Last name required",
      emailRequired: "Email required",
      emailInvalid: "Invalid email format",
      phoneRequired: "Phone required",
      addressRequired: "Address required",
      cityRequired: "City required",
      postalCodeRequired: "Postal code required",
      paymentError: "Payment error. Please try again.",
      emptyCart: "Your cart is empty",
      emptyDescription: "Discover our collection",
      continueButton: "CONTINUE"
    },
    auth: {
      login: "Login",
      register: "Sign up",
      createAccount: "Create an account",
      loginSubtitle: "Access your KAMBA LHAINS personal space",
      registerSubtitle: "Join the KAMBA LHAINS community",
      firstName: "First name",
      firstNamePlaceholder: "Your first name",
      lastName: "Last name",
      lastNamePlaceholder: "Your last name",
      email: "Email",
      emailPlaceholder: "your@email.com",
      password: "Password",
      passwordPlaceholder: "••••••••",
      confirmPassword: "Confirm password",
      confirmPasswordPlaceholder: "••••••••",
      loginButton: "Log in",
      registerButton: "Create my account",
      processing: "Processing...",
      emailRequired: "Email is required",
      emailInvalid: "Invalid email format",
      passwordRequired: "Password is required",
      passwordMinLength: "Password must contain at least 6 characters",
      passwordMinLength8: "Password must contain at least 8 characters",
      passwordComplexity: "Password must contain an uppercase letter, a lowercase letter, a number and a symbol",
      firstNameRequired: "First name is required",
      lastNameRequired: "Last name is required",
      confirmPasswordRequired: "Confirm your password",
      passwordsNotMatch: "Passwords do not match",
      genericError: "An error occurred. Please try again.",
      registeredPleaseLogin: "Account created successfully. Please log in.",
      forgotPassword: "Forgot password?",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      or: "or",
      continueWithGoogle: "Continue with Google",
      continueWithFacebook: "Continue with Facebook",
      continueWithApple: "Continue with Apple",
      termsAcceptance: "By continuing, you accept our",
      termsOfUse: "Terms of Use",
      and: "and our",
      privacyPolicy: "Privacy Policy"
    },
    header: {
      search: "Search",
      userAccount: "User account",
      favorites: "Favorites",
      cart: "Cart",
      searchPlaceholder: "Search for a product...",
      clear: "Clear",
      close: "Close",
      suggestions: "Suggestions",
      noProductsFound: "No products found",
      tryOtherKeywords: "Try with other keywords",
      collectionEmpty: "This collection does not contain any products yet"
    },
    searchSuggestions: {
      voileDeCorps: "Body Veil",
      veste: "Jacket",
      denim: "Denim",
      chemise: "Shirt",
      pantalon: "Pants"
    },
    meta: {
      denim: "Discover our Denim collection - Unique denim pieces.",
      crepuscule: "Discover our Twilight collection - The beauty of the end of the day.",
      aube: "Discover our Dawn collection - The beginning of a new day.",
      jupe: "Discover our Zenith Skirts - The pinnacle of elegant and refined style.",
      veste: "Discover our jackets - The pinnacle of style.",
      short: "Discover our Zenith Shorts - The pinnacle of relaxed and refined style."
    },
    collections: {
      denim: "At kamba Lhains, denim regains its original nobility. Born from a rigorous artisanal approach, denim is worked to reveal all its texture and character. Each piece, far from ephemeral codes, embodies a timeless vision where raw material meets architectural cut. A collection designed for those seeking essence rather than appearance.",
      denimSection2: "Each piece is firmly rooted in the present: sharp cuts, clean lines, uncompromising urban style. The raw becomes contemporary, and textile memory transforms into a current gesture, designed to last, evolve, accompany.\nHere, denim is not just a fabric — it's a companion, a material that writes itself on the skin, a personal archive in the making.",
      crepuscule: "Twilight celebrates the fragile moment when day meets night, where soft light envelops everything with a poetic aura. This collection embodies contemplative elegance, femininity assumed in sobriety. The sleek silhouettes play with transparencies and fluid materials, creating a subtle dialogue between revealing and suggesting. Twilight is the art of balance, an invitation to inhabit the present with grace.",
      crepusculeSection2: "Each creation reflects this subtle transition, blending contemporary sophistication with the raw beauty of nature. A tribute to suspended moments where everything seems possible, carried by a timeless allure.",
      aubeIntro: "The essentials that illuminate your style from the very first moment\n\nDawn captures the magic of the first rays of the day, when light softens everything it touches. Our collection is inspired by this morning clarity to offer pieces with a pure, delicate and naturally elegant style.",
      aubeDescription: "Crafted from authentic and comfortable materials, our garments envelop the silhouette with subtle softness. High-waisted vintage-inspired cuts blend with contemporary lines, creating a perfect balance between timelessness and modernity.\n\nEach piece is designed to accompany your movements with simplicity and ease: everyday essentials that enhance the silhouette effortlessly and bring that feeling of obviousness as the day begins.",
      allArticles: "All articles"
    },
    newsletter: {
      pageTitle: "Newsletter - Kamba Lhains",
      metaDescription: "Subscribe to the Kamba Lhains newsletter to receive our latest news, exclusive collections and sustainable fashion tips.",
      unsubscribeConfirmedTitle: "Unsubscribe confirmed - Newsletter Kamba Lhains",
      subscribeConfirmedTitle: "Subscription confirmed - Newsletter Kamba Lhains",
      unsubscribeConfirmedMessage: "You have been unsubscribed from our newsletter. We're sorry to see you go.",
      subscribeConfirmedMessage: "Thank you for subscribing! You will soon receive our latest news.",
      backToHomeButton: "BACK TO HOME",
      newsletterTitle: "KAMBA LHAINS NEWSLETTER",
      newsletterDescription: "Stay informed about our latest creations, exclusive events and tips for a more responsible fashion. Join our community.",
      whatYouReceiveTitle: "WHAT YOU'LL RECEIVE",
      newCollectionsPreview: "Previews of new collections",
      exclusiveOffers: "Exclusive offers and private sales",
      behindTheScenes: "Behind the scenes of creation",
      fashionSustainabilityTips: "Fashion and sustainability tips",
      specialEvents: "Invitations to special events",
      ourCommitmentTitle: "OUR COMMITMENT",
      qualityContent: "Quality content, never spam",
      dataRespect: "Respect for your personal data",
      oneClickUnsubscribe: "One-click unsubscribe",
      frequencyRespected: "Sending frequency respected",
      personalizedContent: "Content personalized to your interests",
      subscribeButton: "SUBSCRIBE",
      unsubscribeButton: "UNSUBSCRIBE",
      subscriptionFormTitle: "SUBSCRIPTION",
      unsubscriptionFormTitle: "UNSUBSCRIPTION",
      emailLabel: "Email address *",
      emailPlaceholder: "your@email.com",
      firstNameLabel: "First name *",
      firstNamePlaceholder: "Your first name",
      interestsLabel: "Interests (optional)",
      interestNewCollections: "New collections",
      interestExclusiveOffers: "Exclusive offers",
      interestBehindTheScenes: "Behind the scenes",
      interestSustainabilityTips: "Sustainability tips",
      interestEvents: "Special events",
      frequencyLabel: "Desired frequency",
      frequencyWeekly: "Weekly",
      frequencyBiweekly: "Bi-weekly",
      frequencyMonthly: "Monthly",
      frequencyEventsOnly: "Events only",
      submitSubscribe: "SUBSCRIBE",
      submitUnsubscribe: "UNSUBSCRIBE",
      submittingSubscribe: "SUBSCRIBING...",
      submittingUnsubscribe: "UNSUBSCRIBING...",
      emailRequired: "Email is required",
      emailInvalid: "Invalid email",
      firstNameRequired: "First name is required",
      submitError: "An error occurred",
      connectionError: "Server connection error",
      acceptanceText: "By subscribing, you agree to receive marketing emails from us. You can unsubscribe at any time by clicking the unsubscribe link in each email. See our",
      privacyPolicyLink: "/privacy-policy",
      privacyPolicyText: "privacy policy",
      moreInfoText: "for more information on the processing of your data.",
      followUsTitle: "ALSO FOLLOW US ON"
    },
    zenith: {
      metaTitle: "Zenith - Kamba Lhains",
      metaDescription: "Discover our Zenith collection - The pinnacle of style.",
      title: "Zenith",
      intro: "When light reaches its peak and reveals the essence of style",
      description: "Zenith embodies that moment of full intensity, when the sun reaches its zenith and every detail is revealed with brilliance. Our collection translates this solar energy through pieces that celebrate freedom, sensuality and the power of being yourself.",
      section2Text: "Crafted from organic and recycled materials, our garments combine ecological consciousness and sophistication. The cuts unfold in two harmonious movements: vaporous and voluptuous silhouettes that let themselves be carried by the air, and lines closer to the body, sensual and assumed, drawing a naturally sexy allure without ever sacrificing comfort.\n\nThe prints, original and inspired by a pre-colonial African heritage, revisit ancestral symbols and textures to create vibrant patterns, charged with history and modernity. They give each piece a singular, almost solar aura.",
      allArticles: "All articles"
    },
    kambavers: {
      metaTitle: "Kambavers - Kamba Lhains",
      metaDescription: "The Kambavers universe embodies the essence of contemporary African creativity, merging cultural heritage and modern innovation.",
      indexTitle: "KAMBAVERS",
      indexDescription: "Kamba Lhains' inspiration is based on a subtle duality, an opposition that, far from conflicting, gives birth to a unique and singular creation. We merge seemingly opposite worlds to invent a universe where heritage meets innovation, and where modernity dialogues with tradition. This dynamic creates an unparalleled aesthetic, a perfect balance between past and future, between Africa and Europe, an invitation to discover new forms of elegance.\n\nTo learn more about our universe, we invite you to discover the history of Kamba Lhains through our sections, <strong>The Brand</strong> and <strong>Our Values</strong>.",
      menu: {
        brand: "THE BRAND",
        values: "OUR VALUES",
        collections: "COLLECTIONS",
        stores: "STORES"
      },
      brand: {
        familyStoryTitle: "A family story",
        familyStoryDescription: "Kamba Lhains was born from Lhains Obel's desire to celebrate his mother, Kamba Abie, and the heritage she passed on to him. The house draws from family memory and the beauty of everyday life to create non-gendered, inclusive and conscious collections. Each piece reflects the importance of people and the planet, blending style, meaning and sustainability.",
        familyStoryImageAlt: "A family story - Kamba Lhains",
        historyImageAlt: "History of Kamba Lhains",
        historyDescription: "In 2025, Tricia Obel takes the reins of the house, while Lhains devotes himself fully to creation. The house draws its energy from simplicity, nature and contemporary art of living, faithful to the values inherited from mother and grandmother. Each garment tells a story, connects past and present, and makes the human being the heart of its universe.<br />Kamba Lhains thus offers timeless, conscious and inclusive fashion, where style and heritage meet."
      },
      charte: {
        metaTitle: "Our Values - Kambavers - Kamba Lhains",
        metaDescription: "Discover our ethical values and commitments to responsible fashion, human respect and environmental protection.",
        title: "Our Values",
        intro: "At Kamba Lhains, we believe that fashion can and must be meaningful. Beyond style, our creations reflect a deep commitment to people, animals and the planet. These values embody the foundations of our brand and guide each of our decisions.",
        section1Title: "1. Ethical Fashion, Centered on People",
        section1Intro: "We are committed to:",
        section1Items: [
          "Guarantee fair, safe and respectful working conditions for all people involved in the manufacturing of our garments.",
          "Collaborate only with partners and suppliers who share our requirements in terms of human rights and dignity at work.",
          "Promote craftsmanship, local know-how and fair trade."
        ],
        section2Title: "2. Respect for Animal Welfare",
        section2Intro: "We refuse animal exploitation for fashion purposes. We are committed to:",
        section2Items: [
          "Not using any material of animal origin from cruel practices (fur, conventional leather, untraceable feathers...).",
          "Favor responsible and vegan alternatives when they are available and relevant."
        ],
        section3Title: "3. An Eco-Responsible Approach",
        section3Intro: "We make it a point of honor to limit our environmental impact at every stage of the process:",
        section3Items: [
          "Choice of sustainable, organic or recycled raw materials.",
          "Reasoned production to avoid waste and unsold items.",
          "Reduction of superfluous packaging, with recyclable or compostable materials."
        ],
        section4Title: "4. Partners Aligned with Our Values",
        section4Intro: "Each collaboration is carefully selected. We require from our partners:",
        section4Items: [
          "Total transparency about their practices.",
          "Real adherence to demanding social, ethical and ecological principles.",
          "Continuous commitment to improve in these areas."
        ],
        section5Title: "5. Sincere Transparency Towards Our Community",
        section5Intro: "We are committed to:",
        section5Items: [
          "Communicate clearly about our choices, our progress and our limitations.",
          "Educate and raise awareness about more responsible fashion, without greenwashing or unrealistic promises."
        ],
        conclusion: "Kamba Lhains is not a passing fashion. It's a lasting commitment. An alliance between aesthetics and consciousness, for fashion that does good — to those who wear it, to those who make it, and to the world around us.",
        imageAlt1: "Our values - Kamba Lhains",
        imageAlt2: "Our values details - Kamba Lhains"
      }
    },
    contact: {
      metaTitle: "Contact - Kamba Lhains",
      metaDescription: "Contact Kamba Lhains for any questions about our collections.",
      title: "CONTACT US",
      firstName: "First Name *",
      lastName: "Last Name *",
      email: "Email *",
      phone: "Phone",
      category: "Category",
      selectCategory: "Select a category",
      selectOption: "Select an option",
      message: "Message",
      messagePlaceholder: "Write your message here regarding a placed order, don't forget to mention its number",
      charactersRemaining: "400 character(s) remaining",
      attachFiles: "Attach files (supporting documents)",
      chooseFiles: "Choose one or more files",
      acceptedFormats: "Accepted formats: PDF, DOC, DOCX, TXT (Max 5 MB per file)",
      submit: "SUBMIT",
      submitting: "SENDING...",
      fieldRequired: "This field is required",
      successMessage: "Thank you for your message! We will respond to you as soon as possible. A confirmation email has been sent to you.",
      errorMessage: "An error occurred while sending the message. Please try again.",
      categories: {
        order: "Order",
        career: "Career",
        press: "Press",
        other: "Other"
      },
      orderSubCategories: {
        tracking: "Tracking",
        modification: "Modification",
        delivery: "Delivery",
        return: "Return and exchange",
        other: "Other"
      },
      careerSubCategories: {
        application: "Spontaneous application",
        other: "Other"
      },
      pressSubCategories: {
        interview: "Interview request",
        pressKit: "Press kit request",
        other: "Other"
      }
    },
    account: {
      title: "My Account",
      metaDescription: "Manage your Kamba Lhains account - Personal information, addresses, orders and preferences",
      welcome: "Welcome",
      edit: "Edit",
      save: "Save",
      cancel: "Cancel",
      tabs: {
        informations: "Information",
        addresses: "Addresses",
        orders: "Orders",
        preferences: "Preferences",
        security: "Security"
      },
      informations: {
        title: "Personal information",
        firstName: "First name",
        lastName: "Last name",
        email: "Email",
        phone: "Phone",
        memberSince: "Member since"
      },
      addresses: {
        title: "Delivery addresses",
        addNew: "Add address",
        noAddresses: "No saved addresses"
      },
      orders: {
        title: "Order history",
        noOrders: "You haven't placed any orders yet",
        startShopping: "Discover our products"
      },
      preferences: {
        title: "Preferences",
        language: "Language",
        newsletter: "Receive newsletter"
      },
      security: {
        title: "Security",
        changePassword: "Change password",
        currentPassword: "Current password",
        newPassword: "New password",
        confirmNewPassword: "Confirm new password",
        updatePassword: "Update password",
        logout: "Logout",
        logoutDescription: "You will be logged out of your account",
        logoutButton: "Log out",
        deleteAccount: "Delete my account",
        deleteAccountDescription: "This action is irreversible. All your data will be permanently deleted.",
        deleteAccountButton: "Delete my account",
        deleteAccountConfirm: "Are you sure you want to delete your account? This action is irreversible.",
        confirmDelete: "Yes, delete my account"
      },
      passwordsDoNotMatch: "Passwords do not match",
      passwordChanged: "Your password has been successfully changed"
    },
    sidebar: {
      category: "Category",
      all: "ALL",
      top: "TOP",
      bottom: "BOTTOM",
      accessories: "ACCESSORIES",
      items: {
        tshirt: "T-SHIRT",
        shirt: "SHIRT",
        sweatshirt: "SWEATSHIRT",
        bombers: "BOMBERS",
        jacket: "JACKET",
        denimJacket: "JACKET",
        pants: "PANTS",
        denimPants: "PANTS",
        baggyJeans: "BAGGY JEANS",
        shorts: "SHORTS",
        skirt: "SKIRT",
        cargoPants: "CARGO PANTS",
        underwear: "UNDERWEAR",
        beanie: "BEANIE",
        sportBag: "SPORT BAG"
      }
    },
    common: {
      loading: "Loading...",
      saving: "Saving...",
      deleting: "Deleting..."
    }
  }
};

export const getTranslation = (lang: Language, key: string): any => {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
};

// Color translations
const colorTranslations: Record<string, Record<Language, string>> = {
  'Noir': { fr: 'Noir', en: 'Black' },
  'Blanc': { fr: 'Blanc', en: 'White' },
  'Bordeaux': { fr: 'Bordeaux', en: 'Wine' },
  'Marron': { fr: 'Marron', en: 'Brown' },
  'Rose': { fr: 'Rose', en: 'Pink' },
  'Beige': { fr: 'Beige', en: 'Beige' },
  'Gris': { fr: 'Gris', en: 'Grey' },
  'Kaki': { fr: 'Kaki', en: 'Khaki' },
  'Café': { fr: 'Café', en: 'Coffee' },
  'Bleu indigo': { fr: 'Bleu indigo', en: 'Indigo Blue' },
  'Bleu nuit': { fr: 'Bleu nuit', en: 'Navy Blue' },
};

export const getColorTranslation = (colorName: string, lang: Language): string => {
  return colorTranslations[colorName]?.[lang] || colorName;
};
