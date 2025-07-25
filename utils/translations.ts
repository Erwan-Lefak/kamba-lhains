export type Language = 'fr' | 'en' | 'ko';

export interface NavigationTranslations {
  home: string;
  shop: string;
  contact: string;
  kambavers: string;
  connection: string;
}

export interface HeroTranslations {
  title: string;
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
  korean: string;
}

export interface NewsletterTranslations {
  title: string;
  description: string;
  placeholder: string;
  subscribe: string;
  disclaimer: string;
}

export interface CustomerServiceLinksTranslations {
  contactForm: string;
  trackOrder: string;
  registerReturn: string;
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
}

export interface FooterTranslations {
  newsletter: NewsletterTranslations;
  customerService: string;
  customerServiceLinks: CustomerServiceLinksTranslations;
  countryRegion: string;
  language: string;
  links: FooterLinksTranslations;
}

export interface ProductTranslations {
  addToCart: string;
  addToFavorites: string;
  removeFromFavorites: string;
  selectSize: string;
  outOfStock: string;
  inStock: string;
}

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
}

export interface FavoritesTranslations {
  title: string;
  empty: string;
  emptyDescription: string;
}

export interface LanguageTranslationSet {
  navigation: NavigationTranslations;
  hero: HeroTranslations;
  sections: SectionTranslations;
  language: LanguageTranslations;
  footer: FooterTranslations;
  products: ProductTranslations;
  cart: CartTranslations;
  favorites: FavoritesTranslations;
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
      connection: "Connexion"
    },
    hero: {
      title: "BLACK TO THE BASICS"
    },
    sections: {
      femaleModel: "Modèle féminin",
      maleModel: "Modèle masculin", 
      newCollection: "NOUVELLE COLLECTION",
      shop: "BOUTIQUE"
    },
    language: {
      french: "Français",
      english: "English", 
      korean: "한국어"
    },
    footer: {
      newsletter: {
        title: "S'abonner à la newsletter",
        description: "Inscrivez-vous pour recevoir par e-mail toutes les informations sur nos dernières collections, nos produits, nos défilés de mode et nos projets.",
        placeholder: "Email",
        subscribe: "S'inscrire",
        disclaimer: "J'accepte de recevoir la newsletter de KAMBA LHAINS pour être informé(e) en avant-première des nouvelles collections, des événements de la marque et des offres spéciales. En m'abonnant, j'accepte la Politique de confidentialité de KAMBA LHAINS."
      },
      customerService: "Service Client",
      customerServiceLinks: {
        contactForm: "Formulaire de contact",
        trackOrder: "Suivre une commande",
        registerReturn: "Enregistrer un retour"
      },
      countryRegion: "Pays/Région",
      language: "Langue",
      links: {
        legal: "Mentions légales et cookies",
        faq: "FAQ",
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
        career: "Carrière"
      }
    },
    products: {
      addToCart: "Ajouter au panier",
      addToFavorites: "Ajouter aux favoris",
      removeFromFavorites: "Retirer des favoris",
      selectSize: "Sélectionner la taille",
      outOfStock: "Rupture de stock",
      inStock: "En stock"
    },
    cart: {
      title: "Panier",
      empty: "Votre panier est vide",
      total: "Total",
      subtotal: "Sous-total",
      shipping: "Livraison",
      tax: "TVA",
      checkout: "Commander",
      continue: "Continuer les achats",
      quantity: "Quantité",
      remove: "Supprimer"
    },
    favorites: {
      title: "Favoris",
      empty: "Aucun produit dans vos favoris",
      emptyDescription: "Ajoutez des produits à vos favoris pour les retrouver facilement"
    }
  },
  en: {
    navigation: {
      home: "Home",
      shop: "Shop",
      contact: "Contact", 
      kambavers: "Kambavers",
      connection: "Login"
    },
    hero: {
      title: "BLACK TO THE BASICS"
    },
    sections: {
      femaleModel: "Female Model",
      maleModel: "Male Model",
      newCollection: "NEW COLLECTION", 
      shop: "SHOP"
    },
    language: {
      french: "Français",
      english: "English",
      korean: "한국어"
    },
    footer: {
      newsletter: {
        title: "Subscribe to newsletter",
        description: "Sign up to receive by email all information about our latest collections, our products, our fashion shows and our projects.",
        placeholder: "Email",
        subscribe: "Subscribe",
        disclaimer: "I accept to receive the KAMBA LHAINS newsletter to be informed in advance of new collections, brand events and special offers. By subscribing, I accept the KAMBA LHAINS Privacy Policy."
      },
      customerService: "Customer Service",
      customerServiceLinks: {
        contactForm: "Contact form",
        trackOrder: "Track an order",
        registerReturn: "Register a return"
      },
      countryRegion: "Country/Region",
      language: "Language",
      links: {
        legal: "Legal notices and cookies",
        faq: "FAQ",
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
        career: "Career"
      }
    },
    products: {
      addToCart: "Add to cart",
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites",
      selectSize: "Select size",
      outOfStock: "Out of stock",
      inStock: "In stock"
    },
    cart: {
      title: "Cart",
      empty: "Your cart is empty",
      total: "Total",
      subtotal: "Subtotal",
      shipping: "Shipping",
      tax: "Tax",
      checkout: "Checkout",
      continue: "Continue shopping",
      quantity: "Quantity",
      remove: "Remove"
    },
    favorites: {
      title: "Favorites",
      empty: "No products in your favorites",
      emptyDescription: "Add products to your favorites to find them easily"
    }
  },
  ko: {
    navigation: {
      home: "홈",
      shop: "쇼핑",  
      contact: "연락처",
      kambavers: "캄바버스",
      connection: "로그인"
    },
    hero: {
      title: "BLACK TO THE BASICS"
    },
    sections: {
      femaleModel: "여성 모델",
      maleModel: "남성 모델",
      newCollection: "신상품",
      shop: "쇼핑"
    },
    language: {
      french: "Français", 
      english: "English",
      korean: "한국어"
    },
    footer: {
      newsletter: {
        title: "뉴스레터 구독",
        description: "최신 컬렉션, 제품, 패션쇼 및 프로젝트에 대한 모든 정보를 이메일로 받으려면 가입하세요.",
        placeholder: "이메일",
        subscribe: "구독하기",
        disclaimer: "저는 새로운 컬렉션, 브랜드 이벤트 및 특별 혜택에 대한 사전 정보를 받기 위해 KAMBA LHAINS 뉴스레터를 받는 것에 동의합니다. 구독함으로써 KAMBA LHAINS 개인정보 보호정책에 동의합니다."
      },
      customerService: "고객 서비스",
      customerServiceLinks: {
        contactForm: "문의 양식",
        trackOrder: "주문 추적",
        registerReturn: "반품 등록"
      },
      countryRegion: "국가/지역",
      language: "언어",
      links: {
        legal: "법적 고지 및 쿠키",
        faq: "자주 묻는 질문",
        company: "회사",
        follow: "팔로우",
        legalNotices: "법적 고지",
        salesConditions: "판매 조건",
        privacyPolicy: "개인정보 보호정책",
        termsOfUse: "이용 약관",
        accessibility: "접근성",
        account: "계정",
        deliveryInfo: "배송 정보",
        orders: "주문",
        payments: "결제",
        returns: "반품 및 교환",
        sizeGuide: "사이즈 가이드",
        giftCard: "기프트 카드",
        contactUs: "문의하기",
        stores: "매장",
        appointment: "매장 예약하기",
        career: "채용"
      }
    },
    products: {
      addToCart: "장바구니에 추가",
      addToFavorites: "즐겨찾기에 추가",
      removeFromFavorites: "즐겨찾기에서 제거",
      selectSize: "사이즈 선택",
      outOfStock: "품절",
      inStock: "재고 있음"
    },
    cart: {
      title: "장바구니",
      empty: "장바구니가 비어있습니다",
      total: "총계",
      subtotal: "소계",
      shipping: "배송",
      tax: "세금",
      checkout: "결제하기",
      continue: "쇼핑 계속하기",
      quantity: "수량",
      remove: "제거"
    },
    favorites: {
      title: "즐겨찾기",
      empty: "즐겨찾기에 제품이 없습니다",
      emptyDescription: "쉽게 찾기 위해 제품을 즐겨찾기에 추가하세요"
    }
  }
};

export const getTranslation = (lang: Language, key: string): string => {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};