// Mapping des images locales vers Cloudinary
import cloudinaryMapping from '../cloudinary-mapping.json';

/**
 * Convertit un chemin d'image local en URL Cloudinary
 * @param localPath - Chemin local de l'image (ex: "/images/bombers-cafe-tex2.jpg")
 * @returns URL Cloudinary ou le chemin local si non trouvé
 */
export function getCloudinaryUrl(localPath: string): string {
  // Extraire le nom du fichier sans extension
  const fileName = localPath
    .split('/').pop()
    ?.replace(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i, '');

  if (!fileName) return localPath;

  // Chercher dans le mapping Cloudinary
  const cloudinaryUrl = (cloudinaryMapping as Record<string, string>)[fileName];

  // Retourner l'URL Cloudinary ou le chemin local par défaut
  return cloudinaryUrl || localPath;
}

/**
 * Transforme une URL Cloudinary avec des paramètres
 * @param url - URL Cloudinary
 * @param transformations - Transformations à appliquer (ex: "w_500,h_500,c_fill")
 * @returns URL avec transformations
 */
export function transformCloudinaryUrl(url: string, transformations: string): string {
  if (!url.includes('cloudinary.com')) return url;

  return url.replace('/upload/', `/upload/${transformations}/`);
}
