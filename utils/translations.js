export const translations = {
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
    }
  }
};

export const getTranslation = (lang, key) => {
  const keys = key.split('.');
  let value = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};