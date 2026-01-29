import { 
  createProductSchema, 
  updateProductSchema, 
  addToCartSchema,
  updateCartItemSchema,
  searchProductsSchema
} from '../../../lib/validations/product';

describe('Product Validations', () => {
  describe('createProductSchema', () => {
    const validProduct = {
      name: 'Test Product',
      description: ['Great product description'],
      price: 99.99,
      image: 'https://example.com/image.jpg',
      category: 'BENGA CLASSIC',
      colors: ['Red', 'Blue'],
      sizes: ['S', 'M', 'L'],
      inStock: true,
      featured: false,
    };

    it('should validate a correct product', () => {
      const result = createProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('should require name', () => {
      const product = { ...validProduct, name: '' };
      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Le nom du produit est requis');
      }
    });

    it('should require at least one description', () => {
      const product = { ...validProduct, description: [] };
      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Au moins une description est requise');
      }
    });

    it('should require positive price', () => {
      const product = { ...validProduct, price: -10 };
      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Le prix doit être positif');
      }
    });

    it('should require valid image URL', () => {
      const product = { ...validProduct, image: 'not-a-url' };
      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('URL d\'image invalide');
      }
    });

    it('should require at least one color', () => {
      const product = { ...validProduct, colors: [] };
      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Au moins une couleur est requise');
      }
    });

    it('should require at least one size', () => {
      const product = { ...validProduct, sizes: [] };
      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Au moins une taille est requise');
      }
    });

    it('should allow optional fields', () => {
      const product = {
        name: 'Minimal Product',
        description: ['Simple description'],
        price: 50,
        image: 'https://example.com/simple.jpg',
        category: 'FEMME',
        colors: ['White'],
        sizes: ['M'],
      };
      const result = createProductSchema.safeParse(product);
      expect(result.success).toBe(true);
    });
  });

  describe('updateProductSchema', () => {
    it('should allow partial updates', () => {
      const partialUpdate = {
        name: 'Updated Name',
        price: 199.99,
      };
      const result = updateProductSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('should validate partial fields correctly', () => {
      const partialUpdate = {
        price: -50, // Invalid price
      };
      const result = updateProductSchema.safeParse(partialUpdate);
      expect(result.success).toBe(false);
    });

    it('should allow empty object for no updates', () => {
      const result = updateProductSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('addToCartSchema', () => {
    const validCartItem = {
      productId: 'clid123456789',
      quantity: 2,
      size: 'M',
      color: 'Blue',
    };

    it('should validate correct cart item', () => {
      const result = addToCartSchema.safeParse(validCartItem);
      expect(result.success).toBe(true);
    });

    it('should require valid product ID', () => {
      const cartItem = { ...validCartItem, productId: 'invalid-id' };
      const result = addToCartSchema.safeParse(cartItem);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('ID produit invalide');
      }
    });

    it('should require positive quantity', () => {
      const cartItem = { ...validCartItem, quantity: 0 };
      const result = addToCartSchema.safeParse(cartItem);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('La quantité doit être positive');
      }
    });

    it('should require integer quantity', () => {
      const cartItem = { ...validCartItem, quantity: 1.5 };
      const result = addToCartSchema.safeParse(cartItem);
      expect(result.success).toBe(false);
    });

    it('should allow optional size and color', () => {
      const cartItem = {
        productId: 'clid123456789',
        quantity: 1,
      };
      const result = addToCartSchema.safeParse(cartItem);
      expect(result.success).toBe(true);
    });
  });

  describe('updateCartItemSchema', () => {
    it('should validate quantity update', () => {
      const update = { quantity: 5 };
      const result = updateCartItemSchema.safeParse(update);
      expect(result.success).toBe(true);
    });

    it('should require positive quantity', () => {
      const update = { quantity: -1 };
      const result = updateCartItemSchema.safeParse(update);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('La quantité doit être positive');
      }
    });

    it('should require integer quantity', () => {
      const update = { quantity: 2.7 };
      const result = updateCartItemSchema.safeParse(update);
      expect(result.success).toBe(false);
    });
  });

  describe('searchProductsSchema', () => {
    it('should validate basic search', () => {
      const search = { query: 'test product' };
      const result = searchProductsSchema.safeParse(search);
      expect(result.success).toBe(true);
    });

    it('should require non-empty query', () => {
      const search = { query: '' };
      const result = searchProductsSchema.safeParse(search);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Terme de recherche requis');
      }
    });

    it('should validate with all optional filters', () => {
      const search = {
        query: 'shirt',
        category: 'HOMME',
        priceMin: 20,
        priceMax: 100,
        inStock: true,
        sortBy: 'price' as const,
        sortOrder: 'desc' as const,
        page: 2,
        limit: 10,
      };
      const result = searchProductsSchema.safeParse(search);
      expect(result.success).toBe(true);
    });

    it('should validate price range', () => {
      const search = {
        query: 'test',
        priceMin: -10, // Invalid negative price
      };
      const result = searchProductsSchema.safeParse(search);
      expect(result.success).toBe(false);
    });

    it('should validate sort options', () => {
      const search = {
        query: 'test',
        sortBy: 'invalid-sort' as any,
      };
      const result = searchProductsSchema.safeParse(search);
      expect(result.success).toBe(false);
    });

    it('should validate page and limit', () => {
      const search = {
        query: 'test',
        page: 0, // Should be at least 1
        limit: 200, // Should be max 100
      };
      const result = searchProductsSchema.safeParse(search);
      expect(result.success).toBe(false);
    });

    it('should allow minimal search with just query', () => {
      const search = { query: 'minimal search' };
      const result = searchProductsSchema.safeParse(search);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query).toBe('minimal search');
      }
    });
  });
});