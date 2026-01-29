import React, { useState } from 'react';
import Image from 'next/image';

interface OptimizedCollectionImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
}

const OptimizedCollectionImage: React.FC<OptimizedCollectionImageProps> = ({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
  fill = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  quality = 75
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Générer le chemin de l'image optimisée
  const getOptimizedImagePath = (originalSrc: string, targetWidth: number): string => {
    // Extraire le nom de fichier sans extension
    const pathParts = originalSrc.split('/');
    const filename = pathParts[pathParts.length - 1];
    const nameWithoutExt = filename.split('.')[0];
    
    // Déterminer la meilleure taille selon la largeur cible
    let suffix = '-400w';
    if (targetWidth > 1200) suffix = '-1600w';
    else if (targetWidth > 800) suffix = '-1200w';
    else if (targetWidth > 400) suffix = '-800w';
    
    // Construire le chemin vers l'image optimisée
    const basePath = pathParts.slice(0, -1).join('/');
    return `${basePath}/optimized/${nameWithoutExt}${suffix}.webp`;
  };

  // Générer les sources responsive
  const generateSrcSet = (originalSrc: string): string => {
    const pathParts = originalSrc.split('/');
    const filename = pathParts[pathParts.length - 1];
    const nameWithoutExt = filename.split('.')[0];
    const basePath = pathParts.slice(0, -1).join('/');
    
    const srcSet = [
      `${basePath}/optimized/${nameWithoutExt}-400w.webp 400w`,
      `${basePath}/optimized/${nameWithoutExt}-800w.webp 800w`,
      `${basePath}/optimized/${nameWithoutExt}-1200w.webp 1200w`,
      `${basePath}/optimized/${nameWithoutExt}-1600w.webp 1600w`
    ];
    
    return srcSet.join(', ');
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Si l'image optimisée échoue, utiliser l'originale
  if (hasError) {
    return (
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={className}
        priority={priority}
        sizes={sizes}
        quality={quality}
        onLoad={handleLoad}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Image optimisée WebP avec fallback */}
      <picture>
        <source
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          type="image/webp"
        />
        <Image
          src={getOptimizedImagePath(src, width)}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          priority={priority}
          sizes={sizes}
          quality={quality}
          onLoad={handleLoad}
          onError={handleError}
        />
      </picture>

      {/* Placeholder de chargement */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-bounce"></div>
        </div>
      )}
    </div>
  );
};

export default OptimizedCollectionImage;