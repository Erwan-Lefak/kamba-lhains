import React, { useState, useRef, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  onLoadComplete?: () => void;
  onErrorComplete?: () => void;
  lazy?: boolean;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  showLoader?: boolean;
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  onLoadComplete,
  onErrorComplete,
  lazy = true,
  aspectRatio,
  objectFit = 'cover',
  showLoader = true,
  className = '',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || Boolean(props.priority));
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer pour le lazy loading avancé
  useEffect(() => {
    if (!lazy || props.priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Charger l'image 100px avant qu'elle soit visible
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, props.priority, isInView]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoadComplete?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
    onErrorComplete?.();
  };

  const generateBlurDataURL = (w = 400, h = 300) => {
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8fafc"/>
        <rect width="100%" height="100%" fill="url(#shimmer)"/>
        <defs>
          <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#f1f5f9;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#e2e8f0;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f1f5f9;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>`
    ).toString('base64')}`;
  };

  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-3 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
    </div>
  );

  const LoadingPlaceholder = () => (
    <div className="absolute inset-0">
      <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
      </div>
    </div>
  );

  const ErrorFallback = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
      <div className="text-center">
        <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-xs">Image non disponible</p>
      </div>
    </div>
  );

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        aspectRatio: aspectRatio || (props.width && props.height ? `${props.width}/${props.height}` : undefined)
      }}
    >
      {/* Placeholder de chargement */}
      {isLoading && showLoader && !hasError && <LoadingPlaceholder />}
      
      {/* Fallback d'erreur */}
      {hasError && imgSrc === fallbackSrc && <ErrorFallback />}

      {/* Image principale */}
      {isInView && (
        <Image
          {...props}
          src={imgSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading={props.priority ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL={props.blurDataURL || generateBlurDataURL()}
          quality={props.quality || 85}
          sizes={props.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          className={`transition-all duration-500 ${isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
          style={{
            ...props.style,
            objectFit,
            width: '100%',
            height: '100%',
          }}
        />
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
};

export default OptimizedImage;