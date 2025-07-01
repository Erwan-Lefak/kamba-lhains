/**
 * Utility functions for handling product images
 * Best practice: centralized image management
 */

/**
 * Get the image path for a product based on its name
 * @param {string} productName - The product name
 * @returns {string} - The image path
 */
export function getProductImagePath(productName) {
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
 * @param {string} category - Product category
 * @returns {string} - Fallback image path
 */
export function getFallbackImage(category = 'default') {
  const fallbacks = {
    'femme': '/logo.png',
    'homme': '/logo.png',
    'accessoires': '/logo.png',
    'default': '/logo.png'
  };
  
  return fallbacks[category] || fallbacks.default;
}

/**
 * Handle image load error with fallback
 * @param {Event} event - Image error event
 * @param {string} fallbackSrc - Fallback image source
 */
export function handleImageError(event, fallbackSrc) {
  if (event.target.src !== fallbackSrc) {
    event.target.src = fallbackSrc;
  }
}