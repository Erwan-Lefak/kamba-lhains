import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: "VESTE JANÉ",
    price: "890,00 EUR",
    image: "/images/collection/IMG_3031.jpeg",
    images: [
      "/images/collection/IMG_3031.jpeg",
      "/images/collection/IMG_3033.jpeg",
      "/images/collection/IMG_3034.jpeg"
    ],
    description: [
      "Veste en coton recyclé à coupe classique",
      "Col chemise sans pied, fermeture à 6 boutons clous",
      "Manches longues, poignets fendus avec boutons clous",
      "Quatre poches plissées doublées à rabats, huit boutons pressions sur le devant",
      "Empiècement vertical et plis au dos",
      "Confection française"
    ],
    category: "femme",
    subCategory: "aube",
    colors: ["#000000", "#8B7355"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: "JEAN TRF MOM FIT",
    price: "450,00 EUR",
    image: "/images/collection/IMG_2885.jpeg",
    description: [
      "• Jean mom fit en denim premium",
      "• Taille haute confortable",
      "• Coupe décontractée moderne",
      "• Finitions vintage authentiques",
      "• Fabrication européenne"
    ],
    category: "femme",
    subCategory: "zenith",
    colors: ["#1E3A8A", "#000000"],
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
    featured: true
  },
  {
    id: 3,
    name: "BOXY FIT SHIRT",
    price: "320,00 EUR",
    image: "/images/collection/IMG_2797.jpeg",
    description: [
      "• Chemise coupe boxy en coton",
      "• Col classique moderne",
      "• Manches longues ajustables",
      "• Finitions soignées",
      "• Style contemporain décontracté"
    ],
    category: "femme",
    subCategory: "crepuscule",
    colors: ["#FFFFFF", "#F5F5DC"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    featured: true
  },
  {
    id: 4,
    name: "VESTE AVEC COL EN CONTRASTE",
    price: "460,00 EUR",
    image: "/images/collection/IMG_2877.jpeg",
    description: [
      "• Veste élégante avec col contrastant",
      "• Coupe moderne et sophistiquée",
      "• Finitions soignées",
      "• Style contemporain raffiné",
      "• Parfaite pour toutes occasions"
    ],
    category: "femme",
    subCategory: "aube",
    colors: ["#000000", "#F5F5DC"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    featured: false
  },
  {
    id: 5,
    name: "PANTALON KOFFI",
    price: "580,00 EUR",
    image: "/images/products/pantalon-koffi.png",
    description: [
      "• Pantalon droit en laine mérinos",
      "• Taille mi-haute confortable",
      "• Plis marqués devant",
      "• Poches italiennes",
      "• Fabrication européenne"
    ],
    category: "homme",
    subCategory: "zenith",
    colors: ["#1E3A8A", "#36454F"],
    sizes: ["46", "48", "50", "52", "54"],
    inStock: true,
    featured: false
  },
  {
    id: 6,
    name: "BLAZER AMARA",
    price: "890,00 EUR",
    image: "/images/products/blazer-amara.png",
    description: [
      "• Blazer non doublé en lin",
      "• Coupe déstructurée moderne",
      "• Revers crantés classiques",
      "• Poches plaquées",
      "• Idéal mi-saison"
    ],
    category: "homme",
    subCategory: "crepuscule",
    colors: ["#F5F5DC", "#1E3A8A"],
    sizes: ["46", "48", "50", "52"],
    inStock: true,
    featured: false
  },
  {
    id: 7,
    name: "CHEMISE URIEL",
    price: "390,00 EUR",
    image: "/images/products/chemise-uriel.png",
    description: [
      "• Chemise coupe droite en coton",
      "• Col boutonné moderne",
      "• Manches longues ajustables",
      "• Finitions soignées",
      "• Style contemporain"
    ],
    category: "homme",
    subCategory: "aube",
    colors: ["#FFFFFF", "#0EA5E9"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    featured: false
  },
  {
    id: 8,
    name: "VESTE KMOBOU",
    price: "590,00 EUR",
    image: "/images/products/veste-kmobou.png",
    description: [
      "• Veste légère en coton mélangé",
      "• Coupe moderne décontractée",
      "• Poches fonctionnelles",
      "• Fermeture boutonnée",
      "• Parfaite pour toutes saisons"
    ],
    category: "femme",
    subCategory: "zenith",
    colors: ["#F5F5DC", "#8B7355"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    featured: false
  },
  {
    id: 9,
    name: "VESTE JANE",
    price: "720,00 EUR",
    image: "/images/products/veste-jane.png",
    description: [
      "• Veste structurée en laine mélangée",
      "• Coupe moderne et élégante",
      "• Doublure soie premium",
      "• Fermeture boutonnée dorée",
      "• Style contemporain raffiné"
    ],
    category: "femme",
    subCategory: "crepuscule",
    colors: ["#000000", "#1E3A8A"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    featured: false
  },
  {
    id: 10,
    name: "BOMBERS ITOUA",
    price: "650,00 EUR",
    image: "/images/products/bombers-itoua.png",
    description: [
      "• Bombers moderne en nylon technique",
      "• Coupe oversize tendance",
      "• Fermeture éclair YKK",
      "• Poches cargo fonctionnelles",
      "• Style streetwear premium"
    ],
    category: "homme",
    subCategory: "aube",
    colors: ["#000000", "#556B2F"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    featured: false
  },
  {
    id: 11,
    name: "JUPE BINE",
    price: "420,00 EUR",
    image: "/images/products/jupe-bine.png",
    description: [
      "• Jupe midi en crêpe fluide",
      "• Taille haute confortable",
      "• Coupe évasée moderne",
      "• Fermeture invisible",
      "• Style féminin intemporel"
    ],
    category: "femme",
    subCategory: "zenith",
    colors: ["#000000", "#800020"],
    sizes: ["XS", "S", "M", "L", "XL"],
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