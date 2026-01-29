/**
 * Génère un slug URL-friendly à partir d'un nom de produit
 * Ex: "BOMBERS ITOUA" → "bombers-itoua"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')                // Décomposer les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/ç/g, 'c')              // Remplacer ç par c
    .replace(/œ/g, 'oe')             // Remplacer œ par oe
    .replace(/æ/g, 'ae')             // Remplacer æ par ae
    .replace(/\s+/g, '-')            // Remplacer les espaces par des tirets
    .replace(/[^a-z0-9-]/g, '')      // Supprimer les caractères spéciaux
    .replace(/-+/g, '-')             // Remplacer les tirets multiples par un seul
    .replace(/^-|-$/g, '');          // Supprimer les tirets au début et à la fin
}

/**
 * Trouve un produit par son slug
 */
export function findProductBySlug(products: any[], slug: string) {
  return products.find(product => generateSlug(product.name) === slug);
}
