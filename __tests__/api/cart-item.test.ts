import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/cart/[itemId]';
import { prisma } from '../../lib/prisma';

// Mock Prisma
jest.mock('../../lib/prisma', () => ({
  prisma: {
    cartItem: {
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

describe('/api/cart/[itemId]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PUT /api/cart/[itemId]', () => {
    it('should update cart item quantity successfully', async () => {
      const mockExistingItem = {
        id: 'cart-item-1',
        userId: 'user-123',
        productId: 'product-1',
        quantity: 2,
      };

      const mockUpdatedItem = {
        ...mockExistingItem,
        quantity: 5,
        product: {
          id: 'product-1',
          name: 'Test Product',
          price: 100,
          image: 'test.jpg',
          inStock: true,
        },
      };

      mockPrisma.cartItem.findFirst.mockResolvedValue(mockExistingItem as any);
      mockPrisma.cartItem.update.mockResolvedValue(mockUpdatedItem as any);

      const { req, res } = createMocks({
        method: 'PUT',
        query: { itemId: 'cart-item-1' },
        body: { quantity: 5 },
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.message).toBe('Quantité mise à jour');
      expect(data.data.cartItem.quantity).toBe(5);

      expect(mockPrisma.cartItem.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'cart-item-1',
          userId: 'user-123',
        },
      });

      expect(mockPrisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'cart-item-1' },
        data: { quantity: 5 },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
              inStock: true,
            },
          },
        },
      });
    });

    it('should return 404 when cart item not found', async () => {
      mockPrisma.cartItem.findFirst.mockResolvedValue(null);

      const { req, res } = createMocks({
        method: 'PUT',
        query: { itemId: 'non-existent' },
        body: { quantity: 3 },
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(404);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Item de panier non trouvé');
    });

    it('should return 400 for invalid quantity', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        query: { itemId: 'cart-item-1' },
        body: { quantity: -1 }, // Invalid negative quantity
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Données invalides');
    });

    it('should handle database errors during update', async () => {
      const mockExistingItem = {
        id: 'cart-item-1',
        userId: 'user-123',
        productId: 'product-1',
        quantity: 2,
      };

      mockPrisma.cartItem.findFirst.mockResolvedValue(mockExistingItem as any);
      mockPrisma.cartItem.update.mockRejectedValue(new Error('Database error'));

      const { req, res } = createMocks({
        method: 'PUT',
        query: { itemId: 'cart-item-1' },
        body: { quantity: 3 },
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(500);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Erreur lors de la mise à jour');
    });
  });

  describe('DELETE /api/cart/[itemId]', () => {
    it('should remove cart item successfully', async () => {
      const mockExistingItem = {
        id: 'cart-item-1',
        userId: 'user-123',
        productId: 'product-1',
        quantity: 2,
      };

      mockPrisma.cartItem.findFirst.mockResolvedValue(mockExistingItem as any);
      mockPrisma.cartItem.delete.mockResolvedValue(mockExistingItem as any);

      const { req, res } = createMocks({
        method: 'DELETE',
        query: { itemId: 'cart-item-1' },
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.message).toBe('Produit retiré du panier');

      expect(mockPrisma.cartItem.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'cart-item-1',
          userId: 'user-123',
        },
      });

      expect(mockPrisma.cartItem.delete).toHaveBeenCalledWith({
        where: { id: 'cart-item-1' },
      });
    });

    it('should return 404 when trying to delete non-existent item', async () => {
      mockPrisma.cartItem.findFirst.mockResolvedValue(null);

      const { req, res } = createMocks({
        method: 'DELETE',
        query: { itemId: 'non-existent' },
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(404);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Item de panier non trouvé');

      expect(mockPrisma.cartItem.delete).not.toHaveBeenCalled();
    });

    it('should handle database errors during deletion', async () => {
      const mockExistingItem = {
        id: 'cart-item-1',
        userId: 'user-123',
        productId: 'product-1',
        quantity: 2,
      };

      mockPrisma.cartItem.findFirst.mockResolvedValue(mockExistingItem as any);
      mockPrisma.cartItem.delete.mockRejectedValue(new Error('Database error'));

      const { req, res } = createMocks({
        method: 'DELETE',
        query: { itemId: 'cart-item-1' },
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(500);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Erreur lors de la suppression');
    });
  });

  describe('Invalid methods and missing itemId', () => {
    it('should return 405 for unsupported methods', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { itemId: 'cart-item-1' },
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(405);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Méthode non autorisée');
    });

    it('should return 400 when itemId is missing', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        query: {}, // No itemId
        body: { quantity: 3 },
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('ID d\'item requis');
    });

    it('should return 400 when itemId is not a string', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        query: { itemId: ['array', 'value'] }, // Array instead of string
        body: { quantity: 3 },
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('ID d\'item requis');
    });
  });

  describe('Authorization checks', () => {
    it('should only allow users to modify their own cart items', async () => {
      // Mock an item that belongs to a different user
      const mockOtherUserItem = {
        id: 'cart-item-1',
        userId: 'other-user',
        productId: 'product-1',
        quantity: 2,
      };

      mockPrisma.cartItem.findFirst.mockResolvedValue(null); // No item found for current user

      const { req, res } = createMocks({
        method: 'PUT',
        query: { itemId: 'cart-item-1' },
        body: { quantity: 5 },
      });

      await handler(req as any, res as any);

      expect(res._getStatusCode()).toBe(404);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Item de panier non trouvé');

      // Should search with both itemId AND userId
      expect(mockPrisma.cartItem.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'cart-item-1',
          userId: 'user-123', // Current user's ID
        },
      });
    });
  });
});