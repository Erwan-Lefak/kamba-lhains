import { Product } from '../types';

export const products: Product[] = [
  {
    id: "gilet-1957",
    name: "GILET 1957",
    nameEn: "VEST 1957",
    price: 450,
    image: "/images/gilet-1957-face.jpg?v=5",
    images: [
      "/images/gilet-1957-face.jpg?v=5",
      "/images/gilet-1957-droit.jpg?v=5",
      "/images/gilet-1957-gauche.jpg?v=5",
      "/images/gilet-1957-dos.jpg?v=5",
      "/images/gilet-1957-tex1.jpg?v=5",
      "/images/gilet-1957-tex2.jpg?v=5",
      "/images/gilet-1957-tex3.jpg?v=5"
    ],
    imagesByColor: {
      "Bleu nuit": [
        "/images/gilet-1957-face.jpg?v=5",
        "/images/gilet-1957-droit.jpg?v=5",
        "/images/gilet-1957-gauche.jpg?v=5",
        "/images/gilet-1957-dos.jpg?v=5",
        "/images/gilet-1957-tex1.jpg?v=5",
        "/images/gilet-1957-tex2.jpg?v=5",
        "/images/gilet-1957-tex3.jpg?v=5"
      ]
    },
    description: [
      "Veste en denim, dotée de quatre poches plaquées plissées à rabat, avec boutons-pression, deux poches passepoilés intérieurs. Boutons à \"cloud\" sur le devant.",
      "Empiècement au dos avec logo brodé et dos plissé pour une silhouette structurée.",
      "Surpiqûres marron orangé sur l'ensemble de la pièce.",
      "",
      "Composition : 100 % coton",
      "Tailles : S, M, L, XL (sold out)",
      "Couleur : Bleu nuit",
      "Denim / Haut / Veste / Coton"
    ],
    category: "homme",
    subCategory: "denim",
    colors: ["Bleu nuit"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: false,
    featured: false
  },
  {
    id: "jean-1957",
    name: "BAGGY 1957",
    nameEn: "BAGGY 1957",
    price: 490,
    image: "/images/jean-1957-face.jpg?v=5",
    images: [
      "/images/jean-1957-face.jpg?v=5",
      "/images/jean-1957-droit.jpg?v=5",
      "/images/jean-1957-gauche.jpg?v=5",
      "/images/jean-1957-dos.jpg?v=5",
      "/images/jean-1957-tex1.jpg?v=5",
      "/images/jean-1957-tex2.jpg?v=5",
      "/images/jean-1957-tex3.jpg?v=5"
    ],
    imagesByColor: {
      "#191970": [
        "/images/jean-1957-face.jpg?v=5",
        "/images/jean-1957-droit.jpg?v=5",
        "/images/jean-1957-gauche.jpg?v=5",
        "/images/jean-1957-dos.jpg?v=5",
        "/images/jean-1957-tex1.jpg?v=5",
        "/images/jean-1957-tex2.jpg?v=5",
        "/images/jean-1957-tex3.jpg?v=5"
      ]
    },
    description: [
      "Jean en denim à coupe baggy, doté de boutons \"cloud\", d'un empiècement au dos et de poches plaquées à pli.",
      "Surpiqûres marron orangé sur l'ensemble de la pièce, agrémenté d'un patch logo brodé sur la ceinture.",
      "",
      "Composition : 100 % coton",
      "Tailles : S, M, L, XL (sold out)",
      "Couleur : Bleu nuit",
      "Zénith / Bas / Pantalon / Denim / Coton"
    ],
    category: "homme",
    subCategory: "denim",
    colors: ["Bleu nuit"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: false,
    featured: false
  },
  {
    id: "pantalon-jane",
    name: "PANTALON JANE",
    nameEn: "JANE PANTS",
    price: 490,
    image: "/images/pantalon-jane-face.jpg?v=3",
    images: [
      "/images/pantalon-jane-face.jpg?v=3",
      "/images/pantalon-jane-droit.jpg?v=3",
      "/images/pantalon-jane-gauche.jpg?v=3",
      "/images/pantalon-jane-dos.jpg?v=3",
      "/images/pantalon-jane-tex1.jpg?v=3",
      "/images/pantalon-jane-tex2.jpg?v=3",
      "/images/pantalon-jane-tex3.jpg?v=3"
    ],
    imagesByColor: {
      "Bleu indigo": [
        "/images/pantalon-jane-face.jpg?v=3",
        "/images/pantalon-jane-droit.jpg?v=3",
        "/images/pantalon-jane-gauche.jpg?v=3",
        "/images/pantalon-jane-dos.jpg?v=3",
        "/images/pantalon-jane-tex1.jpg?v=3",
        "/images/pantalon-jane-tex2.jpg?v=3",
        "/images/pantalon-jane-tex3.jpg?v=3"
      ]
    },
    description: [
      "Allure vintage, silhouette généreuse. Ce pantalon taille haute oversize puise dans l'esthétique rétro. À l'avant, des poches plaquées avec ouverture latérale pour un twist moderne. À l'arrière, deux poches plaquées et plissées affirment le volume, rehaussées d'un empiècement dos structurant. Passants à la ceinture et fermeture bouton clou + zip pour une finition soignée.",
      "",
      "DÉTAILS :",
      "",
      "Coupe : Taille haute oversize, inspiration rétro",
      "Poches avant : Plaquées avec ouverture latérale",
      "Poches arrière : Plaquées et plissées",
      "Dos : Empiècement structurant",
      "Ceinture : Passants",
      "Fermeture : Bouton clou et zip",
      "Style : Allure vintage, volumes assumés",
      "",
      "Composition : 100 % coton",
      "Couleur : Bleu indigo",
      "Zénith / Bas / Pantalon / Denim / Coton"
    ],
    category: "femme",
    subCategory: "denim",
    colors: ["Bleu indigo"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: false,
    featured: false
  },
  {
    id: "calecon-champion",
    name: "CALEÇON CHAMPION",
    nameEn: "CHAMPION UNDERPANTS",
    price: 109,
    image: "/images/calecon-blanc-face.jpg?v=3",
    images: [
      "/images/calecon-blanc-face.jpg?v=3",
      "/images/calecon-blanc-droit.jpg?v=3",
      "/images/calecon-blanc-gauche.jpg?v=3",
      "/images/calecon-blanc-dos.jpg?v=3",
      "/images/calecon-blanc-tex1.jpg?v=3",
      "/images/calecon-blanc-tex2.jpg?v=3",
      "/images/calecon-blanc-tex3.jpg?v=3"
    ],
    imagesByColor: {
      "Blanc": [
        "/images/calecon-blanc-face.jpg?v=3",
        "/images/calecon-blanc-droit.jpg?v=3",
        "/images/calecon-blanc-gauche.jpg?v=3",
        "/images/calecon-blanc-dos.jpg?v=3",
        "/images/calecon-blanc-tex1.jpg?v=3",
        "/images/calecon-blanc-tex2.jpg?v=3",
        "/images/calecon-blanc-tex3.jpg?v=3"
      ]
    },
    description: [
      "Caleçon en percale, taille haute élastiquée, revisitant la coupe emblématique du short de boxe.",
      "Détail logo apposé sur le devant.",
      "",
      "Composition : 100 % coton",
      "Tailles : S, M, L, XL (disponible : S, M)",
      "Couleur : Blanc",
      "Aube / Bas / Sous-vêtement / Coton"
    ],
    category: "homme",
    subCategory: "aube",
    colors: ["Blanc"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
    featured: false
  },
  {
    id: "bombers-itoua-zenith",
    name: "BOMBERS ITOUA",
    nameEn: "ITOUA BOMBER",
    price: 1120,
    image: "/images/bombers-cafe-face.jpg?v=2",
    images: [
      "/images/bombers-cafe-face.jpg?v=2",
      "/images/bombers-cafe-droit.jpg?v=2",
      "/images/bombers-cafe-gauche.jpg?v=2",
      "/images/bombers-cafe-dos.jpg?v=2",
      "/images/bombers-cafe-tex2.jpg?v=2",
      "/images/bombers-cafe-tex3.jpg?v=2",
      "/images/bombers-cafe-tex4.jpg?v=3"
    ],
    imagesByColor: {
      "Café": [
        "/images/bombers-cafe-face.jpg?v=2",
        "/images/bombers-cafe-droit.jpg?v=2",
        "/images/bombers-cafe-gauche.jpg?v=2",
        "/images/bombers-cafe-dos.jpg?v=2",
        "/images/bombers-cafe-tex2.jpg?v=2",
        "/images/bombers-cafe-tex3.jpg?v=2",
        "/images/bombers-cafe-tex4.jpg?v=3"
      ],
      "Gris": [
        "/images/bombers-gris-face.jpg?v=2",
        "/images/bombers-gris-droit.jpg?v=2",
        "/images/bombers-gris-gauche.jpg?v=2",
        "/images/bombers-gris-dos.jpg?v=2",
        "/images/bombers-gris-tex1.jpg?v=2",
        "/images/bombers-gris-tex2.jpg?v=2",
        "/images/bombers-gris-tex3.jpg?v=2"
      ]
    },
    description: [
      "Bomber extra oversize zippé, doté de quatre poches frontales, deux poches latérales et de poches passepoilées intérieures.",
      "Dos plissé, finitions élastiquées à la taille et aux poignets pour un ajustement parfait.",
      "",
      "Matière : 100 % coton Panama brut",
      "Doublure : 100 % coton",
      "",
      "Tailles : S, M, L (toutes disponibles)",
      "Couleurs : Café, Gris (tous deux disponibles)",
      "Zénith / Haut / Veste / Coton",
      "",
      "• Blouson bombers extra-oversized",
      "• Dos plissé et empiècement structuré brodé de l'emblème de la marque",
      "• Huit poches au total : quatre à l'avant à soufflets fermées par rabats à boutons de pressions, deux latérales, deux intérieures",
      "• Fermeture zippée sur le devant",
      "• Col structuré",
      "• Motif Itoua à l'esprit rustique",
      "• Poignets et ourlet élastiqués",
      "• Fabriqué en France",
      "",
      "ENTRETIEN :",
      "• Lavage délicat à 30°C",
      "• Pas de blanchiment",
      "• Repassage à basse température, sans vapeur",
      "• Nettoyage à sec possible",
      "• Ne pas sécher en machine"
    ],
    category: "homme",
    subCategory: "zenith",
    colors: ["Café", "Gris"],
    sizes: ["S", "M", "L"],
    availableSizes: ["S", "M", "L"],
    inStock: true,
    featured: true
  },
  {
    id: "17",
    name: "SHORT URIEL",
    nameEn: "URIEL SHORTS",
    price: 309,
    image: "/images/short-uriel-rouge-face.jpg?v=2",
    images: [
      "/images/short-uriel-rouge-face.jpg?v=2",
      "/images/short-uriel-rouge-droit.jpg?v=2",
      "/images/short-uriel-rouge-gauche.jpg?v=2",
      "/images/short-uriel-rouge-dos.jpg?v=2",
      "/images/short-uriel-rouge-tex1.jpg?v=2",
      "/images/short-uriel-rouge-tex2.jpg?v=2",
      "/images/short-uriel-rouge-tex3.jpg?v=2"
    ],
    imagesByColor: {
      "Rouge": [
        "/images/short-uriel-rouge-face.jpg?v=2",
        "/images/short-uriel-rouge-droit.jpg?v=2",
        "/images/short-uriel-rouge-gauche.jpg?v=2",
        "/images/short-uriel-rouge-dos.jpg?v=2",
        "/images/short-uriel-rouge-tex1.jpg?v=2",
        "/images/short-uriel-rouge-tex2.jpg?v=2",
        "/images/short-uriel-rouge-tex3.jpg?v=2"
      ]
    },
    description: [
      "• Short moderne en coton premium",
      "• Coupe confortable et décontractée",
      "• Taille ajustable avec cordon",
      "• Poches fonctionnelles",
      "• Style estival raffiné",
      "",
      "Zénith / Bas / Short / Coton"
    ],
    category: "homme",
    subCategory: "zenith",
    colors: ["Rouge"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
    featured: false
  },
  {
    id: "asabili-sweatpants",
    name: "BAS DE SURVÊTEMENT ASABILI",
    nameEn: "ASABILI SWEATPANTS",
    price: 190,
    image: "/images/sweatpant-bordeaux-face.jpg?v=3",
    images: [
      "/images/sweatpant-bordeaux-face.jpg?v=3",
      "/images/sweatpant-bordeaux-droit.jpg?v=3",
      "/images/sweatpant-bordeaux-gauche.jpg?v=3",
      "/images/sweatpant-bordeaux-dos.jpg?v=3",
      "/images/sweatpant-bordeaux-tex1.jpg?v=3",
      "/images/sweatpant-bordeaux-tex2.jpg?v=3"
    ],
    imagesByColor: {
      "Bordeaux": [
        "/images/sweatpant-bordeaux-face.jpg?v=3",
        "/images/sweatpant-bordeaux-droit.jpg?v=3",
        "/images/sweatpant-bordeaux-gauche.jpg?v=3",
        "/images/sweatpant-bordeaux-dos.jpg?v=3",
        "/images/sweatpant-bordeaux-tex1.jpg?v=3",
        "/images/sweatpant-bordeaux-tex2.jpg?v=3"
      ],
      "Beige": [
        "/images/sweatpant-beige-face.jpg?v=4",
        "/images/sweatpant-beige-droit.jpg?v=4",
        "/images/sweatpant-beige-gauche.jpg?v=4",
        "/images/sweatpant-beige-dos.jpg?v=4",
        "/images/sweatpant-beige-tex1.jpg?v=4",
        "/images/sweatpant-beige-tex2.jpg?v=4"
      ],
      "Gris": [
        "/images/sweatpant-gris-face.jpg?v=3",
        "/images/sweatpant-gris-droit.jpg?v=3",
        "/images/sweatpant-gris-gauche.jpg?v=3",
        "/images/sweatpant-gris-dos.jpg?v=3",
        "/images/sweatpant-gris-tex1.jpg?v=3",
        "/images/sweatpant-gris-tex2.jpg?v=3"
      ],
      "Kaki": [
        "/images/sweatpant-kaki-face.jpg?v=3",
        "/images/sweatpant-kaki-droit.jpg?v=3",
        "/images/sweatpant-kaki-gauche.jpg?v=3",
        "/images/sweatpant-kaki-dos.jpg?v=3",
        "/images/sweatpant-kaki-tex1.jpg?v=3",
        "/images/sweatpant-kaki-tex2.jpg?v=3"
      ]
    },
    description: [
      "Sweatpants à coupe baggy, taille haute élastiquée, inspiré du short de boxe.",
      "Logo frontal, poches plaquées à ouverture latérale et bas du vêtement à finition bord franc.",
      "",
      "Tailles : S, M, L, XL",
      "Couleurs : Gris, bordeaux, kaki, blanc cassé",
      "",
      "Composition : 100 % coton",
      "Aube / Bas / Pantalon / Coton"
    ],
    category: "femme",
    subCategory: "aube",
    colors: ["Bordeaux", "Beige", "Gris", "Kaki"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
    featured: true
  },
  {
    id: "3",
    name: "VOILE DE CORPS",
    nameEn: "BODY VEIL",
    price: 348,
    image: "/images/voile-bordeaux-face.jpg?v=4",
    images: [
      "/images/voile-bordeaux-face.jpg?v=4",
      "/images/voile-bordeaux-droit.jpg?v=4",
      "/images/voile-bordeaux-gauche.jpg?v=4",
      "/images/voile-bordeaux-dos.jpg?v=4",
      "/images/voile-bordeaux-tex1.jpg?v=4",
      "/images/voile-bordeaux-tex2.jpg?v=4"
    ],
    imagesByColor: {
      "Bordeaux": [
        "/images/voile-bordeaux-face.jpg?v=4",
        "/images/voile-bordeaux-droit.jpg?v=4",
        "/images/voile-bordeaux-gauche.jpg?v=4",
        "/images/voile-bordeaux-dos.jpg?v=4",
        "/images/voile-bordeaux-tex1.jpg?v=4",
        "/images/voile-bordeaux-tex2.jpg?v=4"
      ],
      "Marron": [
        "/images/voile-marron-face.jpg?v=4",
        "/images/voile-marron-droit.jpg?v=4",
        "/images/voile-marron-gauche.jpg?v=4",
        "/images/voile-marron-dos.jpg?v=4",
        "/images/voile-marron-tex1.jpg?v=4",
        "/images/voile-marron-tex2.jpg?v=4"
      ],
      "Noir": [
        "/images/voile-noir-new-1.jpg?v=5",
        "/images/voile-noir-new-2.jpg?v=5",
        "/images/voile-noir-new-3.jpg?v=5",
        "/images/voile-noir-new-4.jpg?v=5",
        "/images/voile-noir-new-5.jpg?v=5",
        "/images/voile-noir-new-6.jpg?v=5",
        "/images/voile-noir-new-7.jpg?v=5"
      ],
      "Rose": [
        "/images/voile-rose-new-1.jpg?v=5",
        "/images/voile-rose-new-2.jpg?v=5",
        "/images/voile-rose-new-3.jpg?v=5",
        "/images/voile-rose-new-4.jpg?v=5",
        "/images/voile-rose-new-5.jpg?v=5",
        "/images/voile-rose-new-6.jpg?v=5",
        "/images/voile-rose-new-7.jpg?v=5"
      ]
    },
    imagesByColorAndSize: {
      "Noir": {
        "M": [
          "https://res.cloudinary.com/diibzuu9j/image/upload/v1765124060/kamba-lhains/products/voile-noir-m-face.jpg",
          "https://res.cloudinary.com/diibzuu9j/image/upload/v1765124064/kamba-lhains/products/voile-noir-m-droit.jpg",
          "https://res.cloudinary.com/diibzuu9j/image/upload/v1765124069/kamba-lhains/products/voile-noir-m-gauche.jpg",
          "https://res.cloudinary.com/diibzuu9j/image/upload/v1765124073/kamba-lhains/products/voile-noir-m-dos.jpg",
          "https://res.cloudinary.com/diibzuu9j/image/upload/v1765124106/kamba-lhains/products/voile-noir-m-tex1.jpg",
          "https://res.cloudinary.com/diibzuu9j/image/upload/v1765124108/kamba-lhains/products/voile-noir-m-tex2.jpg"
        ]
      }
    },
    description: [
      ""
    ],
    category: "femme",
    subCategory: "crepuscule",
    colors: ["Bordeaux", "Marron", "Noir", "Rose"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
    featured: true
  },
  {
    id: "7",
    name: "CHEMISE URIEL MANCHE LONGUE",
    nameEn: "URIEL LONG SLEEVE SHIRT",
    price: 390,
    image: "/images/chemise-uriel-vert-face.jpg?v=2",
    images: [
      "/images/chemise-uriel-vert-face.jpg?v=2",
      "/images/chemise-uriel-vert-droit.jpg?v=2",
      "/images/chemise-uriel-vert-gauche.jpg?v=2",
      "/images/chemise-uriel-vert-dos.jpg?v=2",
      "/images/chemise-uriel-vert-tex1.jpg?v=2",
      "/images/chemise-uriel-vert-tex2.jpg?v=2"
    ],
    imagesByColor: {
      "Kaki": [
        "/images/chemise-uriel-vert-face.jpg?v=2",
        "/images/chemise-uriel-vert-droit.jpg?v=2",
        "/images/chemise-uriel-vert-gauche.jpg?v=2",
        "/images/chemise-uriel-vert-dos.jpg?v=2",
        "/images/chemise-uriel-vert-tex1.jpg?v=2",
        "/images/chemise-uriel-vert-tex2.jpg?v=2"
      ],
      "Rouge": [
        "/images/chemise-uriel-rouge-face.jpg?v=2",
        "/images/chemise-uriel-rouge-droit.jpg?v=2",
        "/images/chemise-uriel-rouge-gauche.jpg?v=2",
        "/images/chemise-uriel-rouge-dos.jpg?v=2",
        "/images/chemise-uriel-rouge-tex1.jpg?v=2",
        "/images/chemise-uriel-rouge-tex2.jpg?v=2"
      ],
      "Gris": [
        "/images/chemise-uriel-gris-face.jpg?v=2",
        "/images/chemise-uriel-gris-droit.jpg?v=2",
        "/images/chemise-uriel-gris-gauche.jpg?v=2",
        "/images/chemise-uriel-gris-dos.jpg?v=2"
      ]
    },
    description: [
      "• Chemise coupe droite en coton",
      "• Col boutonné moderne",
      "• Manches longues ajustables",
      "• Finitions soignées",
      "• Style contemporain",
      "",
      "Zénith / Haut / Chemise / Coton"
    ],
    category: "homme",
    subCategory: "zenith",
    colors: ["Kaki", "Rouge", "Gris"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
    featured: false
  },
  {
    id: "7-ml",
    name: "CHEMISE URIEL MANCHES COURTES",
    nameEn: "URIEL SHORT SLEEVE SHIRT",
    price: 340,
    image: "/images/chemise-uriel-mc-1.jpg?v=5",
    images: [
      "/images/chemise-uriel-mc-1.jpg?v=5",
      "/images/chemise-uriel-mc-2.jpg?v=5",
      "/images/chemise-uriel-mc-3.jpg?v=5",
      "/images/chemise-uriel-mc-4.jpg?v=5",
      "/images/chemise-uriel-mc-5.jpg?v=5"
    ],
    imagesByColor: {
      "Rouge": [
        "/images/chemise-uriel-mc-1.jpg?v=5",
        "/images/chemise-uriel-mc-2.jpg?v=5",
        "/images/chemise-uriel-mc-3.jpg?v=5",
        "/images/chemise-uriel-mc-4.jpg?v=5",
        "/images/chemise-uriel-mc-5.jpg?v=5"
      ]
    },
    description: [
      "• Chemise coupe droite en coton",
      "• Col boutonné moderne",
      "• Manches courtes",
      "• Finitions soignées",
      "• Style contemporain",
      "",
      "Zénith / Haut / Chemise / Coton"
    ],
    category: "homme",
    subCategory: "zenith",
    colors: ["Rouge"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
    featured: true
  },
  {
    id: "veste-jane",
    name: "VESTE JANE",
    nameEn: "JANE JACKET",
    price: 580,
    image: "/images/veste-jane-face.jpg?v=3",
    images: [
      "/images/veste-jane-face.jpg?v=3",
      "/images/veste-jane-droit.jpg?v=3",
      "/images/veste-jane-gauche.jpg?v=3",
      "/images/veste-jane-dos.jpg?v=3",
      "/images/veste-jane-tex1.jpg?v=3",
      "/images/veste-jane-tex2.jpg?v=3",
      "/images/veste-jane-tex3.jpg?v=3"
    ],
    imagesByColor: {
      "#191970": [
        "/images/veste-jane-face.jpg?v=3",
        "/images/veste-jane-droit.jpg?v=3",
        "/images/veste-jane-gauche.jpg?v=3",
        "/images/veste-jane-dos.jpg?v=3",
        "/images/veste-jane-tex1.jpg?v=3",
        "/images/veste-jane-tex2.jpg?v=3",
        "/images/veste-jane-tex3.jpg?v=3"
      ]
    },
    description: [
      "Veste en denim, dotée de quatre poches plaquées plissées à rabat, avec boutons-pression, deux poches passepoilés intérieurs. Boutons à \"cloud\" sur le devant.",
      "Empiècement au dos avec logo brodé et dos plissé pour une silhouette structurée.",
      "Surpiqûres bleu gris sur l'ensemble de la pièce.",
      "",
      "Composition : 100 % coton",
      "Tailles : S, M, L, XL (sold out)",
      "Couleur : Bleu nuit",
      "Denim / Haut / Veste / Coton"
    ],
    category: "femme",
    subCategory: "denim",
    colors: ["Bleu nuit"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: false,
    featured: false
  },
  {
    id: "11",
    name: "JUPE BINE",
    nameEn: "BINE SKIRT",
    price: 520,
    image: "/images/jupe-face.jpg?v=3",
    images: [
      "/images/jupe-face.jpg?v=3",
      "/images/jupe-droit.jpg?v=3",
      "/images/jupe-gauche.jpg?v=3",
      "/images/jupe-dos.jpg?v=3",
      "/images/jupe-tex1.jpg?v=3",
      "/images/jupe-tex2.jpg?v=3",
      "/images/jupe-tex3.jpg?v=3"
    ],
    imagesByColor: {
      "Rouge": [
        "/images/jupe-face.jpg?v=3",
        "/images/jupe-droit.jpg?v=3",
        "/images/jupe-gauche.jpg?v=3",
        "/images/jupe-dos.jpg?v=3",
        "/images/jupe-tex1.jpg?v=3",
        "/images/jupe-tex2.jpg?v=3",
        "/images/jupe-tex3.jpg?v=3"
      ]
    },
    description: [
      "• Jupe midi en crêpe fluide",
      "• Taille haute confortable",
      "• Coupe évasée moderne",
      "• Fermeture invisible",
      "• Style féminin intemporel",
      "",
      "Zénith / Bas / Jupe / Crêpe"
    ],
    category: "femme",
    subCategory: "zenith",
    colors: ["Rouge"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
    featured: false
  },
  {
    id: "surchemise-grand-boubou",
    name: "SURCHEMISE GRAND BOUBOU",
    nameEn: "GRAND BOUBOU OVERSHIRT",
    price: 640,
    image: "/images/surchemise-boubou-face.jpg?v=2",
    images: [
      "/images/surchemise-boubou-face.jpg?v=2",
      "/images/surchemise-boubou-droit.jpg?v=2",
      "/images/surchemise-boubou-gauche.jpg?v=2",
      "/images/surchemise-boubou-dos.jpg?v=2"
    ],
    imagesByColor: {
      "Gris": [
        "/images/surchemise-boubou-face.jpg?v=2",
        "/images/surchemise-boubou-droit.jpg?v=2",
        "/images/surchemise-boubou-gauche.jpg?v=2",
        "/images/surchemise-boubou-dos.jpg?v=2"
      ]
    },
    description: [
      "Surchemise grand boubou à coupe ample et fluide inspirée du boubou traditionnel.",
      "Motifs géométriques africains, col chemise structuré.",
      "Manches amples pour un confort optimal, pièce statement alliant tradition et modernité.",
      "",
      "Composition : 100 % popeline de coton",
      "Tailles : S, M, L, XL",
      "Couleur : Gris",
      "Zénith / Haut / Chemise / Coton"
    ],
    category: "homme",
    subCategory: "zenith",
    colors: ["Gris"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
    featured: false
  }
];

export const categories = [
  { id: 'all', name: 'Tout', slug: 'all' },
  { id: 'femme', name: 'Femme', slug: 'femme' },
  { id: 'homme', name: 'Homme', slug: 'homme' },
  { id: 'accessoires', name: 'Accessoires', slug: 'accessoires' },
  { id: 'collections', name: 'Collections', slug: 'collections' }
];

export const featuredProducts: Product[] = products.filter(product => product.featured);