import { Product } from '../types';

export const products: Product[] = [
  {
    id: "10",
    name: "BOMBERS ITOUA",
    price: 650,
    image: "/images/IMG_3567.jpeg",
    images: [
      "/images/IMG_3567.jpeg"
    ],
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
    featured: true
  },
  {
    id: "17",
    name: "SHORT URIEL",
    price: 280,
    image: "/images/IMG_3620.jpeg",
    images: [
      "/images/IMG_3620.jpeg"
    ],
    description: [
      "• Short moderne en coton premium",
      "• Coupe confortable et décontractée",
      "• Taille ajustable avec cordon",
      "• Poches fonctionnelles",
      "• Style estival raffiné"
    ],
    category: "homme",
    subCategory: "zenith",
    colors: ["#F5F5DC", "#000000", "#556B2F"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    featured: true
  },
  {
    id: "1",
    name: "ASABILI SWEATPANTS",
    price: 180,
    image: "/images/IMG_3775.jpeg",
    images: [
      "/images/IMG_3775.jpeg"
    ],
    description: [
      "Sweatpants à coupe baggy, taille haute élastiquée, inspiré du short de boxe.",
      "Logo frontal, poches plaquées à ouverture latérale et bas du vêtement à finition bord franc.",
      "Composition : 100 % coton"
    ],
    category: "femme",
    subCategory: "zenith",
    colors: ["#808080", "#800020", "#556B2F", "#F5F5DC"],
    sizes: ["S", "M"],
    inStock: true,
    featured: false
  },
  {
    id: "2",
    name: "JEAN TRF MOM FIT",
    price: 450,
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
    featured: false
  },
  {
    id: "3",
    name: "VOILE DE CORPS",
    price: 368,
    image: "/images/IMG_3731.jpeg",
    images: [
      "/images/IMG_3731.jpeg",
      "/images/IMG_3504.jpeg",
      "/images/59e68ef6-1758-4cf8-b860-bb6e98f37e78.jpg",
      "/images/1b4c53b1-403a-4834-998e-4226cbd1db87.jpg",
      "/images/0ca33ab3-b0f3-4a06-b40b-2fcf592ded3c.jpg",
      "/images/64fb19a1-f7fb-4032-8d1e-159acb7ba259.jpg",
      "/images/26dc157c-bd01-4abe-99ed-ff2726f4461a.jpg",
      "/images/cda451fc-8233-435b-9062-12adf61f279b.jpg",
      "/images/474bbbf9-e786-4884-ab0e-caa22275def1.jpg",
      "/images/71a9b3e4-e96d-4856-a278-af558840b914.jpg",
      "/images/df865631-0770-4a9a-a127-76018e1c7493.jpg",
      "/images/e061c517-25af-4407-bbd0-6b69f38f62f7.jpg"
    ],
    imagesByColor: {
      "#000000": [
        "/images/IMG_3504.jpeg",
        "/images/59e68ef6-1758-4cf8-b860-bb6e98f37e78.jpg",
        "/images/1b4c53b1-403a-4834-998e-4226cbd1db87.jpg",
        "/images/0ca33ab3-b0f3-4a06-b40b-2fcf592ded3c.jpg",
        "/images/64fb19a1-f7fb-4032-8d1e-159acb7ba259.jpg",
        "/images/26dc157c-bd01-4abe-99ed-ff2726f4461a.jpg",
        "/images/cda451fc-8233-435b-9062-12adf61f279b.jpg",
        "/images/474bbbf9-e786-4884-ab0e-caa22275def1.jpg",
        "/images/71a9b3e4-e96d-4856-a278-af558840b914.jpg",
        "/images/df865631-0770-4a9a-a127-76018e1c7493.jpg",
        "/images/e061c517-25af-4407-bbd0-6b69f38f62f7.jpg"
      ],
      "#8B4513": [
        "/images/DSC_1530.jpg",
        "/images/DSC_1533.jpg",
        "/images/DSC_1535.jpg",
        "/images/DSC_1537.jpg",
        "/images/DSC_1539.jpg",
        "/images/DSC_1541.jpg",
        "/images/DSC_1544.jpg",
        "/images/DSC_1545.jpg",
        "/images/DSC_1548.jpg"
      ],
      "#800020": [
        "/images/DSC_1551.jpg",
        "/images/DSC_1554.jpg",
        "/images/DSC_1555.jpg",
        "/images/DSC_1562.jpg",
        "/images/DSC_1569.jpg",
        "/images/DSC_1572.jpg",
        "/images/DSC_1580.jpg"
      ],
      "#FF69B4": [
        "/images/cropped_DSC_1459-Modifier.jpg",
        "/images/cropped_DSC_1462.jpg",
        "/images/cropped_DSC_1465.jpg",
        "/images/cropped_DSC_1467.jpg",
        "/images/cropped_DSC_1469.jpg",
        "/images/cropped_DSC_1473.jpg",
        "/images/cropped_DSC_1478.jpg",
        "/images/cropped_DSC_1482.jpg",
        "/images/cropped_DSC_1483.jpg",
        "/images/cropped_DSC_1484.jpg"
      ]
    },
    description: [
      "Voile de corps mi-mollet, à manches longues, doté d'un col large utilisable en capuche.",
      "Tailles : S, M, L, XL",
      "Composition : 97% polyamide 3% Lycra"
    ],
    category: "femme",
    subCategory: "crepuscule",
    colors: ["#8B4513", "#800020", "#556B2F", "#000000", "#FF69B4"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    featured: true
  },
  {
    id: "4",
    name: "VESTE AVEC COL EN CONTRASTE",
    price: 460,
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
    id: "5",
    name: "PANTALON KOFFI",
    price: 580,
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
    id: "6",
    name: "BLAZER AMARA",
    price: 890,
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
    id: "7",
    name: "CHEMISE URIEL",
    price: 390,
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
    id: "8",
    name: "VESTE KMOBOU",
    price: 590,
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
    id: "9",
    name: "VESTE JANE",
    price: 720,
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
    id: "11",
    name: "JUPE BINE",
    price: 420,
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
  },
  {
    id: "12",
    name: "PULL MARIN AUBE",
    price: 385,
    image: "/images/collection/IMG_2785.jpeg",
    images: [
      "/images/collection/IMG_2785.jpeg"
    ],
    description: [
      "Pull marin en maille fine pour la collection Aube",
      "Coupe ajustée et confortable",
      "Détails marines authentiques",
      "Parfait pour les matinées fraîches",
      "Fabrication européenne"
    ],
    category: "unisexe",
    subCategory: "aube",
    colors: ["#000080", "#FFFFFF"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    featured: false
  },
  {
    id: "13", 
    name: "CHEMISE AUBE CLASSIC",
    price: 295,
    image: "/images/collection/IMG_2796.jpeg",
    images: [
      "/images/collection/IMG_2796.jpeg"
    ],
    description: [
      "Chemise classique de la collection Aube",
      "Coupe droite intemporelle",
      "Col chemise traditionnel",
      "Tissu premium respirant",
      "Idéale pour toutes occasions"
    ],
    category: "unisexe",
    subCategory: "aube", 
    colors: ["#FFFFFF", "#F5F5DC"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    featured: false
  },
  {
    id: "14",
    name: "POLO AUBE PREMIUM",
    price: 245,
    image: "/images/collection/IMG_2798.jpeg", 
    images: [
      "/images/collection/IMG_2798.jpeg"
    ],
    description: [
      "Polo premium collection Aube",
      "Maille piquée de qualité supérieure",
      "Col polo ajustable",
      "Coupe moderne et élégante",
      "Parfait pour le sport-chic"
    ],
    category: "unisexe",
    subCategory: "aube",
    colors: ["#000000", "#8B7355"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    featured: false
  },
  {
    id: "15",
    name: "VESTE AUBE URBAN",
    price: 520,
    image: "/images/collection/IMG_2917.jpeg",
    images: [
      "/images/collection/IMG_2917.jpeg"
    ],
    description: [
      "Veste urbaine collection Aube",
      "Design contemporain et fonctionnel",
      "Matières techniques résistantes",
      "Poches multiples pratiques",
      "Style moderne et polyvalent"
    ],
    category: "unisexe",
    subCategory: "aube",
    colors: ["#000000", "#2F2F2F"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    featured: false
  },
  {
    id: "16",
    name: "SWEAT ESSENTIEL",
    price: 195,
    image: "/images/collection/IMG_2864.jpeg",
    images: [
      "/images/collection/IMG_2864.jpeg"
    ],
    description: [
      "Sweat essentiel pour un style décontracté",
      "Coton molletonné de qualité premium",
      "Coupe regular confortable",
      "Finitions soignées",
      "Parfait pour toutes saisons"
    ],
    category: "unisexe",
    subCategory: "general",
    colors: ["#000000", "#FFFFFF", "#808080"],
    sizes: ["S", "M", "L", "XL"],
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