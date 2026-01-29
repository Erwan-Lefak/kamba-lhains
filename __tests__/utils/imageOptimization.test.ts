import {
  getOptimizedImagePath,
  generateSrcSet,
  generateSizes,
  shouldLoadWithPriority,
  IMAGE_OPTIMIZATION_PRESETS,
  getLazyLoadingConfig,
  generateImageMetadata,
  isValidImageFile,
  getOptimizationPreset,
  RESPONSIVE_BREAKPOINTS
} from '../../utils/imageOptimization';

describe('Image Optimization Utils', () => {
  describe('getOptimizedImagePath', () => {
    it('should generate correct WebP path for small image', () => {
      const result = getOptimizedImagePath('/images/test.jpg', 300);
      expect(result).toBe('/images/optimized/test-400w.webp');
    });

    it('should generate correct WebP path for medium image', () => {
      const result = getOptimizedImagePath('/images/test.jpg', 900);
      expect(result).toBe('/images/optimized/test-1200w.webp');
    });

    it('should generate correct WebP path for large image', () => {
      const result = getOptimizedImagePath('/images/test.jpg', 1500);
      expect(result).toBe('/images/optimized/test-1600w.webp');
    });

    it('should support JPEG format', () => {
      const result = getOptimizedImagePath('/images/test.jpg', 600, 'jpeg');
      expect(result).toBe('/images/optimized/test-800w.jpeg');
    });

    it('should handle nested paths', () => {
      const result = getOptimizedImagePath('/images/collection/product/test.png', 400);
      expect(result).toBe('/images/collection/product/optimized/test-400w.webp');
    });

    it('should handle files with multiple dots', () => {
      const result = getOptimizedImagePath('/images/test.product.v2.jpg', 800);
      expect(result).toBe('/images/optimized/test.product.v2-800w.webp');
    });
  });

  describe('generateSrcSet', () => {
    it('should generate complete srcSet for WebP', () => {
      const result = generateSrcSet('/images/test.jpg');
      const expected = [
        '/images/optimized/test-400w.webp 400w',
        '/images/optimized/test-800w.webp 800w',
        '/images/optimized/test-1200w.webp 1200w',
        '/images/optimized/test-1600w.webp 1600w'
      ].join(', ');
      expect(result).toBe(expected);
    });

    it('should generate srcSet for JPEG format', () => {
      const result = generateSrcSet('/images/test.jpg', 'jpeg');
      const expected = [
        '/images/optimized/test-400w.jpeg 400w',
        '/images/optimized/test-800w.jpeg 800w',
        '/images/optimized/test-1200w.jpeg 1200w',
        '/images/optimized/test-1600w.jpeg 1600w'
      ].join(', ');
      expect(result).toBe(expected);
    });

    it('should handle nested path in srcSet', () => {
      const result = generateSrcSet('/images/collection/hero.jpg');
      expect(result).toContain('/images/collection/optimized/hero-400w.webp 400w');
      expect(result).toContain('/images/collection/optimized/hero-1600w.webp 1600w');
    });
  });

  describe('generateSizes', () => {
    it('should generate default responsive sizes', () => {
      const result = generateSizes();
      expect(result).toBe('(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw');
    });

    it('should generate custom responsive sizes', () => {
      const customBreakpoints = [
        { maxWidth: '480px', width: '100vw' },
        { maxWidth: '768px', width: '50vw' },
        { maxWidth: '', width: '33vw' }
      ];
      const result = generateSizes(customBreakpoints);
      expect(result).toBe('(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw');
    });

    it('should handle single breakpoint', () => {
      const singleBreakpoint = [
        { maxWidth: '', width: '100vw' }
      ];
      const result = generateSizes(singleBreakpoint);
      expect(result).toBe('100vw');
    });
  });

  describe('shouldLoadWithPriority', () => {
    it('should prioritize first 3 images above fold', () => {
      expect(shouldLoadWithPriority(0, 'above-fold')).toBe(true);
      expect(shouldLoadWithPriority(1, 'above-fold')).toBe(true);
      expect(shouldLoadWithPriority(2, 'above-fold')).toBe(true);
      expect(shouldLoadWithPriority(3, 'above-fold')).toBe(false);
    });

    it('should not prioritize images below fold', () => {
      expect(shouldLoadWithPriority(0, 'below-fold')).toBe(false);
      expect(shouldLoadWithPriority(1, 'below-fold')).toBe(false);
      expect(shouldLoadWithPriority(2, 'below-fold')).toBe(false);
    });

    it('should default to below-fold behavior', () => {
      expect(shouldLoadWithPriority(0)).toBe(false);
      expect(shouldLoadWithPriority(1)).toBe(false);
    });
  });

  describe('IMAGE_OPTIMIZATION_PRESETS', () => {
    it('should have all required preset types', () => {
      expect(IMAGE_OPTIMIZATION_PRESETS.hero).toBeDefined();
      expect(IMAGE_OPTIMIZATION_PRESETS.gallery).toBeDefined();
      expect(IMAGE_OPTIMIZATION_PRESETS.thumbnail).toBeDefined();
      expect(IMAGE_OPTIMIZATION_PRESETS.card).toBeDefined();
    });

    it('should have correct hero preset configuration', () => {
      const heroPreset = IMAGE_OPTIMIZATION_PRESETS.hero;
      expect(heroPreset.quality).toBe(85);
      expect(heroPreset.sizes).toBe('100vw');
      expect(heroPreset.priority).toBe(true);
      expect(heroPreset.formats).toEqual(['webp', 'jpeg']);
    });

    it('should have correct gallery preset configuration', () => {
      const galleryPreset = IMAGE_OPTIMIZATION_PRESETS.gallery;
      expect(galleryPreset.quality).toBe(75);
      expect(galleryPreset.priority).toBe(false);
      expect(galleryPreset.formats).toEqual(['webp', 'jpeg']);
    });

    it('should have appropriate quality settings for each type', () => {
      expect(IMAGE_OPTIMIZATION_PRESETS.hero.quality).toBeGreaterThan(IMAGE_OPTIMIZATION_PRESETS.thumbnail.quality);
      expect(IMAGE_OPTIMIZATION_PRESETS.gallery.quality).toBeGreaterThan(IMAGE_OPTIMIZATION_PRESETS.thumbnail.quality);
    });
  });

  describe('getLazyLoadingConfig', () => {
    it('should return closer root margin for early images', () => {
      const config = getLazyLoadingConfig(3);
      expect(config.rootMargin).toBe('200px');
      expect(config.threshold).toBe(0.1);
    });

    it('should return standard root margin for later images', () => {
      const config = getLazyLoadingConfig(10);
      expect(config.rootMargin).toBe('100px');
      expect(config.threshold).toBe(0.1);
    });

    it('should use consistent threshold', () => {
      const config1 = getLazyLoadingConfig(0);
      const config2 = getLazyLoadingConfig(20);
      expect(config1.threshold).toBe(config2.threshold);
    });
  });

  describe('generateImageMetadata', () => {
    it('should generate correct structured data', () => {
      const metadata = generateImageMetadata('/images/product.jpg', 'Beautiful product');
      expect(metadata).toEqual({
        '@type': 'ImageObject',
        url: '/images/product.jpg',
        description: 'Beautiful product',
        width: '800',
        height: '600'
      });
    });

    it('should handle empty alt text', () => {
      const metadata = generateImageMetadata('/images/test.jpg', '');
      expect(metadata.description).toBe('');
      expect(metadata['@type']).toBe('ImageObject');
    });

    it('should preserve URL format', () => {
      const url = 'https://example.com/remote-image.jpg';
      const metadata = generateImageMetadata(url, 'Remote image');
      expect(metadata.url).toBe(url);
    });
  });

  describe('isValidImageFile', () => {
    it('should validate common image extensions', () => {
      expect(isValidImageFile('image.jpg')).toBe(true);
      expect(isValidImageFile('image.jpeg')).toBe(true);
      expect(isValidImageFile('image.png')).toBe(true);
      expect(isValidImageFile('image.webp')).toBe(true);
      expect(isValidImageFile('image.avif')).toBe(true);
    });

    it('should handle uppercase extensions', () => {
      expect(isValidImageFile('IMAGE.JPG')).toBe(true);
      expect(isValidImageFile('photo.PNG')).toBe(true);
      expect(isValidImageFile('graphic.WEBP')).toBe(true);
    });

    it('should reject invalid file types', () => {
      expect(isValidImageFile('document.pdf')).toBe(false);
      expect(isValidImageFile('video.mp4')).toBe(false);
      expect(isValidImageFile('audio.mp3')).toBe(false);
      expect(isValidImageFile('script.js')).toBe(false);
      expect(isValidImageFile('style.css')).toBe(false);
    });

    it('should handle files without extensions', () => {
      expect(isValidImageFile('filename')).toBe(false);
      expect(isValidImageFile('')).toBe(false);
    });

    it('should handle files with multiple dots', () => {
      expect(isValidImageFile('my.image.file.jpg')).toBe(true);
      expect(isValidImageFile('my.document.file.pdf')).toBe(false);
    });
  });

  describe('getOptimizationPreset', () => {
    it('should return correct preset for each type', () => {
      expect(getOptimizationPreset('hero')).toBe(IMAGE_OPTIMIZATION_PRESETS.hero);
      expect(getOptimizationPreset('gallery')).toBe(IMAGE_OPTIMIZATION_PRESETS.gallery);
      expect(getOptimizationPreset('thumbnail')).toBe(IMAGE_OPTIMIZATION_PRESETS.thumbnail);
      expect(getOptimizationPreset('card')).toBe(IMAGE_OPTIMIZATION_PRESETS.card);
    });
  });

  describe('RESPONSIVE_BREAKPOINTS', () => {
    it('should have correct breakpoint configuration', () => {
      expect(RESPONSIVE_BREAKPOINTS).toHaveLength(4);
      
      const [bp400, bp800, bp1200, bp1600] = RESPONSIVE_BREAKPOINTS;
      
      expect(bp400.width).toBe(400);
      expect(bp400.suffix).toBe('-400w');
      expect(bp400.quality).toBe(80);
      
      expect(bp800.width).toBe(800);
      expect(bp800.suffix).toBe('-800w');
      expect(bp800.quality).toBe(75);
      
      expect(bp1200.width).toBe(1200);
      expect(bp1200.suffix).toBe('-1200w');
      expect(bp1200.quality).toBe(70);
      
      expect(bp1600.width).toBe(1600);
      expect(bp1600.suffix).toBe('-1600w');
      expect(bp1600.quality).toBe(65);
    });

    it('should have decreasing quality with increasing size', () => {
      for (let i = 1; i < RESPONSIVE_BREAKPOINTS.length; i++) {
        expect(RESPONSIVE_BREAKPOINTS[i].quality).toBeLessThanOrEqual(RESPONSIVE_BREAKPOINTS[i - 1].quality);
      }
    });

    it('should have increasing widths', () => {
      for (let i = 1; i < RESPONSIVE_BREAKPOINTS.length; i++) {
        expect(RESPONSIVE_BREAKPOINTS[i].width).toBeGreaterThan(RESPONSIVE_BREAKPOINTS[i - 1].width);
      }
    });
  });
});