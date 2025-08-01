// Utilitaires pour l'optimisation et la gestion des images

export interface ResponsiveImageConfig {
  width: number;
  quality: number;
  suffix: string;
}

export const RESPONSIVE_BREAKPOINTS: ResponsiveImageConfig[] = [
  { width: 400, quality: 80, suffix: '-400w' },
  { width: 800, quality: 75, suffix: '-800w' },
  { width: 1200, quality: 70, suffix: '-1200w' },
  { width: 1600, quality: 65, suffix: '-1600w' }
];

/**
 * Génère le chemin d'une image optimisée selon la largeur cible
 */
export function getOptimizedImagePath(
  originalPath: string, 
  targetWidth: number,
  format: 'webp' | 'jpeg' = 'webp'
): string {
  const pathParts = originalPath.split('/');
  const filename = pathParts[pathParts.length - 1];
  const nameWithoutExt = filename.split('.')[0];
  
  // Déterminer la meilleure taille
  let bestConfig = RESPONSIVE_BREAKPOINTS[0];
  for (const config of RESPONSIVE_BREAKPOINTS) {
    if (targetWidth <= config.width) {
      bestConfig = config;
      break;
    }
    bestConfig = config;
  }
  
  const basePath = pathParts.slice(0, -1).join('/');
  return `${basePath}/optimized/${nameWithoutExt}${bestConfig.suffix}.${format}`;
}

/**
 * Génère un srcSet complet pour une image responsive
 */
export function generateSrcSet(
  originalPath: string,
  format: 'webp' | 'jpeg' = 'webp'
): string {
  const pathParts = originalPath.split('/');
  const filename = pathParts[pathParts.length - 1];
  const nameWithoutExt = filename.split('.')[0];
  const basePath = pathParts.slice(0, -1).join('/');
  
  return RESPONSIVE_BREAKPOINTS
    .map(config => 
      `${basePath}/optimized/${nameWithoutExt}${config.suffix}.${format} ${config.width}w`
    )
    .join(', ');
}

/**
 * Génère les tailles responsive pour l'attribut sizes
 */
export function generateSizes(breakpoints?: { maxWidth: string; width: string }[]): string {
  const defaultBreakpoints = [
    { maxWidth: '640px', width: '100vw' },
    { maxWidth: '768px', width: '50vw' },
    { maxWidth: '1024px', width: '33vw' },
    { maxWidth: '', width: '25vw' }
  ];
  
  const sizesArray = (breakpoints || defaultBreakpoints).map(bp => 
    bp.maxWidth ? `(max-width: ${bp.maxWidth}) ${bp.width}` : bp.width
  );
  
  return sizesArray.join(', ');
}

/**
 * Détermine si une image doit être chargée en priorité selon sa position
 */
export function shouldLoadWithPriority(
  index: number, 
  viewportPosition: 'above-fold' | 'below-fold' = 'below-fold'
): boolean {
  // Charger les 3 premières images en priorité si elles sont au-dessus du pli
  return viewportPosition === 'above-fold' && index < 3;
}

/**
 * Configuration d'optimisation selon le type de contenu
 */
export const IMAGE_OPTIMIZATION_PRESETS = {
  hero: {
    quality: 85,
    sizes: '100vw',
    priority: true,
    formats: ['webp', 'jpeg'] as const
  },
  gallery: {
    quality: 75,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    priority: false,
    formats: ['webp', 'jpeg'] as const
  },
  thumbnail: {
    quality: 70,
    sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px',
    priority: false,
    formats: ['webp', 'jpeg'] as const
  },
  card: {
    quality: 75,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
    priority: false,
    formats: ['webp', 'jpeg'] as const
  }
} as const;

/**
 * Calcule le lazy loading offset selon la position de l'élément
 */
export function getLazyLoadingConfig(index: number) {
  return {
    // Charger les images plus proches de la vue plus tôt
    rootMargin: index < 6 ? '200px' : '100px',
    threshold: 0.1
  };
}

/**
 * Génère les métadonnées d'image pour le SEO
 */
export function generateImageMetadata(src: string, alt: string) {
  return {
    '@type': 'ImageObject',
    url: src,
    description: alt,
    width: '800',
    height: '600'
  };
}

/**
 * Valide qu'un fichier image a une extension supportée
 */
export function isValidImageFile(filename: string): boolean {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
  const extension = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  return validExtensions.includes(extension);
}

/**
 * Retourne la configuration d'optimisation pour un type de composant
 */
export function getOptimizationPreset(type: keyof typeof IMAGE_OPTIMIZATION_PRESETS) {
  return IMAGE_OPTIMIZATION_PRESETS[type];
}