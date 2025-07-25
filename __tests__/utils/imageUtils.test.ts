import { 
  getProductImagePath, 
  getFallbackImage, 
  handleImageError,
  ProductCategory 
} from '../../utils/imageUtils';

describe('imageUtils', () => {
  describe('getProductImagePath', () => {
    it('returns logo.png for empty product name', () => {
      expect(getProductImagePath('')).toBe('/logo.png');
    });

    it('converts product name to proper image filename', () => {
      expect(getProductImagePath('VESTE JANÉ')).toBe('/veste-jane.png');
      expect(getProductImagePath('T-SHIRT BÁSICO')).toBe('/t-shirt-bsico.png');
    });

    it('handles accented characters correctly', () => {
      expect(getProductImagePath('Créé àvëc dës àccénts')).toBe('/cree-avec-des-accents.png');
      expect(getProductImagePath('Niño español')).toBe('/nino-espanol.png');
    });

    it('removes special characters and normalizes spacing', () => {
      expect(getProductImagePath('Product!@# Name   with...spaces')).toBe('/product-name-withspaces.png');
      expect(getProductImagePath('  --Product--Name--  ')).toBe('/product-name.png');
    });

    it('handles mixed case conversion', () => {
      expect(getProductImagePath('MiXeD CaSe PrOdUcT')).toBe('/mixed-case-product.png');
    });

    it('handles numbers correctly', () => {
      expect(getProductImagePath('Product 123 Version 2.0')).toBe('/product-123-version-20.png');
    });
  });

  describe('getFallbackImage', () => {
    it('returns correct fallback for each category', () => {
      expect(getFallbackImage('femme')).toBe('/logo.png');
      expect(getFallbackImage('homme')).toBe('/logo.png');
      expect(getFallbackImage('accessoires')).toBe('/logo.png');
    });

    it('returns default fallback for unknown category', () => {
      expect(getFallbackImage('unknown' as ProductCategory)).toBe('/logo.png');
    });

    it('returns default fallback when no category provided', () => {
      expect(getFallbackImage()).toBe('/logo.png');
    });

    it('handles undefined category gracefully', () => {
      expect(getFallbackImage(undefined as any)).toBe('/logo.png');
    });
  });

  describe('handleImageError', () => {
    let mockEvent: any;
    let mockTarget: HTMLImageElement;

    beforeEach(() => {
      mockTarget = {
        src: '/original-image.jpg'
      } as HTMLImageElement;

      mockEvent = {
        target: mockTarget
      };
    });

    it('sets fallback src when different from current src', () => {
      const fallbackSrc = '/fallback-image.jpg';
      
      handleImageError(mockEvent, fallbackSrc);
      
      expect(mockTarget.src).toBe(fallbackSrc);
    });

    it('does not change src when already using fallback', () => {
      const fallbackSrc = '/fallback-image.jpg';
      mockTarget.src = fallbackSrc;
      
      handleImageError(mockEvent, fallbackSrc);
      
      expect(mockTarget.src).toBe(fallbackSrc);
    });

    it('handles empty fallback src', () => {
      const fallbackSrc = '';
      
      handleImageError(mockEvent, fallbackSrc);
      
      expect(mockTarget.src).toBe(fallbackSrc);
    });

    it('works with different image formats', () => {
      const fallbackSrc = '/fallback.webp';
      
      handleImageError(mockEvent, fallbackSrc);
      
      expect(mockTarget.src).toBe(fallbackSrc);
    });
  });
});