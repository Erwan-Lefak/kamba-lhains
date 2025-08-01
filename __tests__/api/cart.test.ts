import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/cart/index';
import { prisma } from '../../lib/prisma';

// Mock Prisma
jest.mock('../../lib/prisma', () => ({
  prisma: {
    cartItem: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
  },
}));

// Mock auth middleware
jest.mock('../../lib/middleware/auth', () => ({
  withAuth: (handler: any) => (req: any, res: any) => {
    req.user = { id: 'user-123', email: 'test@example.com' };
    return handler(req, res);
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('/api/cart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/cart', () => {
    it('should return cart items for authenticated user', async () => {
      const mockCartItems = [
        {
          id: 'cart-1',
          userId: 'user-123',
          productId: 'product-1',
          quantity: 2,
          size: 'M',
          color: 'Blue',
          product: {
            id: 'product-1',
            name: 'Test Product',
            price: 100,
            image: 'test.jpg',
            inStock: true,
          },
        },
      ];

      mockPrisma.cartItem.findMany.mockResolvedValue(mockCartItems as any);

      const { req, res } = createMocks({ method: 'GET' });
      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data.items).toEqual(mockCartItems);
      expect(data.data.totalItems).toBe(2);
      expect(data.data.totalAmount).toBe('200.00');
    });

    it('should handle empty cart', async () => {
      mockPrisma.cartItem.findMany.mockResolvedValue([]);

      const { req, res } = createMocks({ method: 'GET' });
      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data.items).toEqual([]);
      expect(data.data.totalItems).toBe(0);
      expect(data.data.totalAmount).toBe('0.00');
    });

    it('should handle database errors', async () => {
      mockPrisma.cartItem.findMany.mockRejectedValue(new Error('Database error'));

      const { req, res } = createMocks({ method: 'GET' });
      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(500);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Erreur lors de la récupération du panier');
    });
  });

  describe('POST /api/cart', () => {
    it('should add product to cart successfully', async () => {
      const mockProduct = {
        id: 'product-1',
        name: 'Test Product',
        price: 100,
        inStock: true,
      };

      const mockCartItem = {
        id: 'cart-1',
        userId: 'user-123',
        productId: 'product-1',
        quantity: 1,
        size: 'M',
        color: 'Blue',
        product: mockProduct,
      };

      mockPrisma.product.findUnique.mockResolvedValue(mockProduct as any);
      mockPrisma.cartItem.findUnique.mockResolvedValue(null);
      mockPrisma.cartItem.create.mockResolvedValue(mockCartItem as any);

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          productId: 'product-1',
          quantity: 1,
          size: 'M',
          color: 'Blue',
        },
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.message).toBe('Produit ajouté au panier');
      expect(data.data.cartItem).toEqual(mockCartItem);
    });

    it('should update quantity if product already in cart', async () => {
      const mockProduct = {
        id: 'product-1',
        name: 'Test Product',
        price: 100,
        inStock: true,
      };

      const existingCartItem = {
        id: 'cart-1',
        userId: 'user-123',
        productId: 'product-1',
        quantity: 1,
        size: 'M',
        color: 'Blue',
      };

      const updatedCartItem = {
        ...existingCartItem,
        quantity: 2,
        product: mockProduct,
      };

      mockPrisma.product.findUnique.mockResolvedValue(mockProduct as any);
      mockPrisma.cartItem.findUnique.mockResolvedValue(existingCartItem as any);
      mockPrisma.cartItem.update.mockResolvedValue(updatedCartItem as any);

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          productId: 'product-1',
          quantity: 1,
          size: 'M',
          color: 'Blue',
        },
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data.cartItem.quantity).toBe(2);
    });

    it('should return 404 if product not found', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          productId: 'non-existent',
          quantity: 1,
        },
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(404);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Produit non trouvé');
    });

    it('should return 400 if product is out of stock', async () => {
      const mockProduct = {
        id: 'product-1',
        name: 'Test Product',
        price: 100,
        inStock: false,
      };

      mockPrisma.product.findUnique.mockResolvedValue(mockProduct as any);

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          productId: 'product-1',
          quantity: 1,
        },
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Produit en rupture de stock');
    });

    it('should return 400 for invalid data', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          productId: 'invalid-id',
          quantity: -1, // Invalid quantity
        },
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Données invalides');
    });
  });

  describe('DELETE /api/cart', () => {
    it('should clear cart successfully', async () => {
      mockPrisma.cartItem.deleteMany.mockResolvedValue({ count: 3 });

      const { req, res } = createMocks({ method: 'DELETE' });
      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.message).toBe('Panier vidé avec succès');
    });

    it('should handle database errors when clearing cart', async () => {
      mockPrisma.cartItem.deleteMany.mockRejectedValue(new Error('Database error'));

      const { req, res } = createMocks({ method: 'DELETE' });
      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(500);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Erreur lors de la suppression du panier');
    });
  });

  describe('Unsupported methods', () => {
    it('should return 405 for PUT method', async () => {
      const { req, res } = createMocks({ method: 'PUT' });
      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(405);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Méthode non autorisée');
    });
  });
});