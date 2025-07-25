import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

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
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 95,
  sizes,
  placeholder = 'blur',
  blurDataURL
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer pour lazy loading
  useEffect(() => {
    if (!imgRef.current || priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Préchargement 50px avant d'être visible
        threshold: 0.1
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // Génération du blur placeholder automatique
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null;
    if (!canvas) return '';
    
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#f0f0f0');
    gradient.addColorStop(1, '#e0e0e0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    
    return canvas.toDataURL();
  };

  const defaultBlurDataURL = blurDataURL || generateBlurDataURL(20, 20);

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className || ''}`}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      {(priority || isInView) && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          sizes={sizes}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={defaultBlurDataURL}
          className={`transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          }}
        />
      )}
      
      {/* Skeleton loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      )}
    </div>
  );
}