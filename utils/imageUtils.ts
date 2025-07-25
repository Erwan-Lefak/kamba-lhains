/**
 * Utility functions for handling product images
 * Best practice: centralized image management
 */

export type ProductCategory = 'femme' | 'homme' | 'accessoires' | 'default';

interface FallbackImages {
  [key: string]: string;
}

/**
 * Get the image path for a product based on its name
 */
export function getProductImagePath(productName: string): string {
  if (!productName) return '/logo.png'; // Fallback image
  
  // Convert product name to image filename
  const imageName = productName
    .toLowerCase()
    .replace(/[àäâ]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[ïî]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/[ùûü]/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/ñ/g, 'n')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
  
  return `/${imageName}.png`;
}

/**
 * Get fallback image if main image fails to load
 */
export function getFallbackImage(category: ProductCategory = 'default'): string {
  const fallbacks: FallbackImages = {
    'femme': '/logo.png',
    'homme': '/logo.png',
    'accessoires': '/logo.png',
    'default': '/logo.png'
  };
  
  return fallbacks[category] || fallbacks.default;
}

/**
 * Handle image load error with fallback
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackSrc: string
): void {
  const target = event.target as HTMLImageElement;
  if (target.src !== fallbackSrc) {
    target.src = fallbackSrc;
  }
}