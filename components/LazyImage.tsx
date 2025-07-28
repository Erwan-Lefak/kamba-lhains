import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { performanceManager } from '../lib/performance';

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  preloadOnHover?: boolean;
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 85,
  sizes,
  placeholder = 'blur',
  blurDataURL,
  objectFit = 'cover',
  onLoad,
  onError,
  fallbackSrc = '/images/placeholder.jpg',
  preloadOnHover = false
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isInView, setIsInView] = useState(priority);
  const [isHovered, setIsHovered] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer pour lazy loading optimisé
  useEffect(() => {
    if (priority || isInView) return;

    const observer = performanceManager.createIntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Préchargement au hover si activé
  useEffect(() => {
    if (preloadOnHover && isHovered && !isInView) {
      performanceManager.preloadResource(src, 'image');
    }
  }, [preloadOnHover, isHovered, isInView, src]);

  // Gestionnaires d'événements optimisés
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
    performanceManager.recordMetric('image_load_success', performance.now());
  };

  const handleError = () => {
    setHasError(true);
    
    // Fallback vers image de secours
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      onError?.();
    }
    
    performanceManager.recordMetric('image_load_error', performance.now());
  };

  // Génération du blur placeholder optimisé
  const generateBlurDataURL = (w: number, h: number) => {
    if (blurDataURL) return blurDataURL;
    
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f1f5f9"/>
        <rect width="100%" height="100%" fill="url(#shimmer)"/>
        <defs>
          <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#e2e8f0;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#cbd5e1;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>`
    ).toString('base64')}`;
  };

  const defaultBlurDataURL = generateBlurDataURL(width, height);
  const optimizedSizes = sizes || performanceManager.generateResponsiveSizes();

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className || ''}`}
      style={{ aspectRatio: `${width}/${height}` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Placeholder de chargement avancé */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-100">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-shimmer animate-pulse"></div>
        </div>
      )}

      {/* Image optimisée */}
      {(priority || isInView) && !hasError && (
        <Image
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          sizes={optimizedSizes}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={defaultBlurDataURL}
          className={`transition-all duration-500 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            objectFit,
            width: '100%',
            height: '100%'
          }}
        />
      )}

      {/* Fallback d'erreur */}
      {hasError && currentSrc === fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <div className="text-center">
            <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Image non disponible</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .bg-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}