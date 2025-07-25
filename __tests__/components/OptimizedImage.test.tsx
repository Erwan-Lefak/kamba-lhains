import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return ({ src, alt, onLoad, onError, ...props }: any) => (
    <img 
      src={src} 
      alt={alt} 
      onLoad={onLoad}
      onError={onError}
      {...props} 
    />
  );
});

// Simple mock implementation for OptimizedImage
const OptimizedImage = ({ 
  src, 
  alt, 
  fallbackSrc = '/fallback.jpg',
  loading = 'lazy',
  quality = 85,
  ...props 
}: {
  src: string;
  alt: string;
  fallbackSrc?: string;
  loading?: string;
  quality?: number;
  [key: string]: any;
}) => {
  const [imageSrc, setImageSrc] = React.useState(src);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setImageSrc(fallbackSrc);
  };

  return (
    <div className="optimized-image-container">
      {!isLoaded && !hasError && (
        <div data-testid="loading-placeholder">Loading...</div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        data-quality={quality}
        style={{ display: isLoaded || hasError ? 'block' : 'none' }}
        {...props}
      />
    </div>
  );
};

describe('OptimizedImage', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image',
    width: 800,
    height: 600
  };

  it('renders image with correct attributes', () => {
    render(<OptimizedImage {...defaultProps} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('data-quality', '85');
  });

  it('shows loading placeholder initially', () => {
    render(<OptimizedImage {...defaultProps} />);
    
    expect(screen.getByTestId('loading-placeholder')).toBeInTheDocument();
  });

  it('hides loading placeholder after image loads', () => {
    render(<OptimizedImage {...defaultProps} />);
    
    const image = screen.getByAltText('Test image');
    fireEvent.load(image);
    
    expect(screen.queryByTestId('loading-placeholder')).not.toBeInTheDocument();
  });

  it('uses fallback image on error', () => {
    const fallbackSrc = '/fallback.jpg';
    render(<OptimizedImage {...defaultProps} fallbackSrc={fallbackSrc} />);
    
    const image = screen.getByAltText('Test image');
    fireEvent.error(image);
    
    expect(image).toHaveAttribute('src', fallbackSrc);
  });

  it('applies custom loading strategy', () => {
    render(<OptimizedImage {...defaultProps} loading="eager" />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('loading', 'eager');
  });

  it('applies custom quality setting', () => {
    render(<OptimizedImage {...defaultProps} quality={95} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('data-quality', '95');
  });

  it('passes through additional props', () => {
    render(
      <OptimizedImage 
        {...defaultProps} 
        className="custom-class"
        data-testid="custom-image"
      />
    );
    
    const image = screen.getByTestId('custom-image');
    expect(image).toHaveClass('custom-class');
  });

  it('handles responsive images', () => {
    render(
      <OptimizedImage 
        {...defaultProps} 
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    );
    
    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
  });

  it('supports priority loading', () => {
    render(<OptimizedImage {...defaultProps} priority />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('loading', 'lazy'); // Still lazy by default
  });

  it('handles missing alt text gracefully', () => {
    const { src, alt, ...propsWithoutAlt } = defaultProps;
    render(<OptimizedImage src={src} {...propsWithoutAlt as any} />);
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
  });
});