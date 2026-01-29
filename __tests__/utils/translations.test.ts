import { getTranslation, translations, Language } from '../../utils/translations';

describe('translations', () => {
  describe('translations object', () => {
    it('contains all required languages', () => {
      expect(translations.fr).toBeDefined();
      expect(translations.en).toBeDefined();
      expect(translations.ko).toBeDefined();
    });

    it('has consistent structure across languages', () => {
      const languages = ['fr', 'en', 'ko'];
      const requiredSections = [
        'navigation',
        'hero',
        'sections',
        'language',
        'footer',
        'products',
        'cart',
        'favorites'
      ];

      languages.forEach(lang => {
        requiredSections.forEach(section => {
          expect(translations[lang][section]).toBeDefined();
        });
      });
    });

    it('has navigation translations for all languages', () => {
      const languages = ['fr', 'en', 'ko'];
      const navItems = ['home', 'shop', 'contact', 'kambavers', 'connection'];

      languages.forEach(lang => {
        navItems.forEach(item => {
          expect(translations[lang].navigation[item]).toBeDefined();
          expect(typeof translations[lang].navigation[item]).toBe('string');
        });
      });
    });

    it('has product-related translations', () => {
      const languages = ['fr', 'en', 'ko'];
      const productKeys = [
        'addToCart',
        'addToFavorites',
        'removeFromFavorites',
        'selectSize',
        'outOfStock',
        'inStock'
      ];

      languages.forEach(lang => {
        productKeys.forEach(key => {
          expect(translations[lang].products[key]).toBeDefined();
          expect(typeof translations[lang].products[key]).toBe('string');
        });
      });
    });

    it('has footer newsletter translations', () => {
      const languages = ['fr', 'en', 'ko'];
      const newsletterKeys = [
        'title',
        'description',
        'placeholder',
        'subscribe',
        'disclaimer'
      ];

      languages.forEach(lang => {
        newsletterKeys.forEach(key => {
          expect(translations[lang].footer.newsletter[key]).toBeDefined();
          expect(typeof translations[lang].footer.newsletter[key]).toBe('string');
        });
      });
    });
  });

  describe('getTranslation', () => {
    it('returns correct translation for simple keys', () => {
      expect(getTranslation('fr', 'navigation.home')).toBe('Accueil');
      expect(getTranslation('en', 'navigation.home')).toBe('Home');
      expect(getTranslation('ko', 'navigation.home')).toBe('홈');
    });

    it('returns correct translation for nested keys', () => {
      expect(getTranslation('fr', 'footer.newsletter.title')).toBe("S'abonner à la newsletter");
      expect(getTranslation('en', 'footer.newsletter.title')).toBe('Subscribe to newsletter');
      expect(getTranslation('ko', 'footer.newsletter.title')).toBe('뉴스레터 구독');
    });

    it('returns key when translation not found', () => {
      expect(getTranslation('fr', 'nonexistent.key')).toBe('nonexistent.key');
      expect(getTranslation('en', 'navigation.nonexistent')).toBe('navigation.nonexistent');
    });

    it('returns key when language not found', () => {
      expect(getTranslation('es' as Language, 'navigation.home')).toBe('navigation.home');
    });

    it('handles empty key gracefully', () => {
      expect(getTranslation('fr', '')).toBe('');
    });

    it('handles deeply nested keys', () => {
      expect(getTranslation('fr', 'footer.customerServiceLinks.contactForm')).toBe('Formulaire de contact');
      expect(getTranslation('en', 'footer.customerServiceLinks.contactForm')).toBe('Contact form');
    });

    it('returns original key for malformed key paths', () => {
      expect(getTranslation('fr', 'navigation.')).toBe('navigation.');
      expect(getTranslation('fr', '.navigation')).toBe('.navigation');
      expect(getTranslation('fr', 'navigation..home')).toBe('navigation..home');
    });

    it('handles undefined values in translation path', () => {
      expect(getTranslation('fr', 'navigation.home.nonexistent')).toBe('navigation.home.nonexistent');
    });

    it('works with all supported languages', () => {
      const testKey = 'products.addToCart';
      
      expect(getTranslation('fr', testKey)).toBe('Ajouter au panier');
      expect(getTranslation('en', testKey)).toBe('Add to cart');
      expect(getTranslation('ko', testKey)).toBe('장바구니에 추가');
    });

    it('maintains translation consistency', () => {
      // Test that common keys exist across all languages
      const commonKeys = [
        'navigation.home',
        'navigation.shop',
        'products.addToCart',
        'cart.title',
        'favorites.title'
      ];

      const languages: Language[] = ['fr', 'en', 'ko'];

      commonKeys.forEach(key => {
        languages.forEach(lang => {
          const translation = getTranslation(lang, key);
          expect(translation).not.toBe(key); // Should not return the key itself
          expect(translation.length).toBeGreaterThan(0); // Should have actual content
        });
      });
    });
  });
});