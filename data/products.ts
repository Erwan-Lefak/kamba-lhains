import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: "BOMBERS ITOUA",
    price: "1090,00 €",
    image: "/bombers-itoua.png",
    description: [
      "• Bomber en coton biologique certifié GOTS",
      "• Coupe moderne et ajustée",
      "• Fermeture éclair dorée",
      "• Détails brodés traditionnels",
      "• Doublure en soie naturelle"
    ],
    category: "femme",
    colors: ["Noir", "Kaki"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: "JUPE BINË",
    price: "620,00 €",
    image: "/jupe-bine.png",
    description: [
      "• Jupe midi en lin biologue",
      "• Taille haute ajustable",
      "• Coupe évasée élégante",
      "• Motifs géométriques traditionnels",
      "• Fabrication artisanale"
    ],
    category: "femme",
    colors: ["Beige", "Terracotta"],
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
    featured: true
  },
  {
    id: 3,
    name: "VESTE JANÉ",
    price: "780,00 €",
    image: "/veste-jane.png",
    description: [
      "• Veste structurée en coton premium",
      "• Col châle sophistiqué",
      "• Poches passepoilées",
      "• Finitions main exceptionnelles",
      "• Design intemporel"
    ],
    category: "femme",
    colors: ["Blanc", "Écru"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    featured: true
  },
  {
    id: 4,
    name: "CHEMISE NGOZI",
    price: "450,00 €",
    image: "/chemise-ngozi.png",
    description: [
      "• Chemise en popeline de coton",
      "• Col classique français",
      "• Coupe moderne cintrée",
      "• Boutons nacre véritable",
      "• Repassage facile"
    ],
    category: "homme",
    colors: ["Blanc", "Bleu clair"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    featured: false
  },
  {
    id: 5,
    name: "PANTALON KOFFI",
    price: "580,00 €",
    image: "/pantalon-koffi.png",
    description: [
      "• Pantalon droit en laine mérinos",
      "• Taille mi-haute confortable",
      "• Plis marqués devant",
      "• Poches italiennes",
      "• Fabrication européenne"
    ],
    category: "homme",
    colors: ["Navy", "Charcoal"],
    sizes: ["46", "48", "50", "52", "54"],
    inStock: true,
    featured: false
  },
  {
    id: 6,
    name: "BLAZER AMARA",
    price: "890,00 €",
    image: "/blazer-amara.png",
    description: [
      "• Blazer non doublé en lin",
      "• Coupe déstructurée moderne",
      "• Revers crantés classiques",
      "• Poches plaquées",
      "• Idéal mi-saison"
    ],
    category: "homme",
    colors: ["Beige", "Navy"],
    sizes: ["46", "48", "50", "52"],
    inStock: true,
    featured: false
  },
  {
    id: 7,
    name: "CHEMISE URIEL",
    price: "390,00 €",
    image: "/chemise-uriel.png",
    description: [
      "• Chemise coupe droite en coton",
      "• Col boutonné moderne",
      "• Manches longues ajustables",
      "• Finitions soignées",
      "• Style contemporain"
    ],
    category: "homme",
    colors: ["Blanc", "Bleu"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    featured: false
  },
  {
    id: 8,
    name: "VESTE KMOBOU",
    price: "590,00 €",
    image: "/veste-kmobou.png",
    description: [
      "• Veste légère en coton mélangé",
      "• Coupe moderne décontractée",
      "• Poches fonctionnelles",
      "• Fermeture boutonnée",
      "• Parfaite pour toutes saisons"
    ],
    category: "femme",
    colors: ["Beige", "Kaki"],
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