import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/products/search';
import { prisma } from '../../lib/prisma';

// Mock Prisma
jest.mock('../../lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('/api/products/search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProducts = [
    {
      id: '1',
      name: 'Test Product 1',
      description: ['Description 1'],
      price: 100,
      image: 'test1.jpg',
      category: 'BENGA CLASSIC',
      colors: ['Red', 'Blue'],
      sizes: ['S', 'M', 'L'],
      inStock: true,
      featured: false,
      createdAt: new Date('2023-01-01'),
    },
    {
      id: '2',
      name: 'Test Product 2',
      description: ['Description 2'],
      price: 200,
      image: 'test2.jpg',
      category: 'OTA BENGA',
      colors: ['Green'],
      sizes: ['M', 'L'],
      inStock: true,
      featured: true,
      createdAt: new Date('2023-01-02'),
    },
  ];

  it('should search products successfully', async () => {
    mockPrisma.product.findMany.mockResolvedValue(mockProducts as any);
    mockPrisma.product.count.mockResolvedValue(2);

    const { req, res } = createMocks({
      method: 'GET',
      query: { query: 'test' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.data.products).toEqual(mockProducts);
    expect(data.data.pagination.totalCount).toBe(2);
  });

  it('should filter by category', async () => {
    const filteredProducts = [mockProducts[0]];
    mockPrisma.product.findMany.mockResolvedValue(filteredProducts as any);
    mockPrisma.product.count.mockResolvedValue(1);

    const { req, res } = createMocks({
      method: 'GET',
      query: { query: 'test', category: 'BENGA CLASSIC' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.data.products).toEqual(filteredProducts);
    expect(data.data.pagination.totalCount).toBe(1);
  });

  it('should filter by price range', async () => {
    const filteredProducts = [mockProducts[1]];
    mockPrisma.product.findMany.mockResolvedValue(filteredProducts as any);
    mockPrisma.product.count.mockResolvedValue(1);

    const { req, res } = createMocks({
      method: 'GET',
      query: { query: 'test', priceMin: '150', priceMax: '250' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.data.products).toEqual(filteredProducts);
  });

  it('should sort by price ascending', async () => {
    mockPrisma.product.findMany.mockResolvedValue(mockProducts as any);
    mockPrisma.product.count.mockResolvedValue(2);

    const { req, res } = createMocks({
      method: 'GET',
      query: { query: 'test', sortBy: 'price', sortOrder: 'asc' },
    });

    await handler(req, res);

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { price: 'asc' },
      })
    );
  });

  it('should handle pagination correctly', async () => {
    mockPrisma.product.findMany.mockResolvedValue([mockProducts[0]] as any);
    mockPrisma.product.count.mockResolvedValue(2);

    const { req, res } = createMocks({
      method: 'GET',
      query: { query: 'test', page: '2', limit: '1' },
    });

    await handler(req, res);

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 1, // (page - 1) * limit = (2 - 1) * 1 = 1
        take: 1,
      })
    );

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.data.pagination.currentPage).toBe(2);
    expect(data.data.pagination.totalPages).toBe(2);
    expect(data.data.pagination.hasNextPage).toBe(false);
    expect(data.data.pagination.hasPrevPage).toBe(true);
  });

  it('should filter by stock status', async () => {
    const inStockProducts = mockProducts.filter(p => p.inStock);
    mockPrisma.product.findMany.mockResolvedValue(inStockProducts as any);
    mockPrisma.product.count.mockResolvedValue(inStockProducts.length);

    const { req, res } = createMocks({
      method: 'GET',
      query: { query: 'test', inStock: 'true' },
    });

    await handler(req, res);

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          inStock: true,
        }),
      })
    );
  });

  it('should return 405 for non-GET methods', async () => {
    const { req, res } = createMocks({ method: 'POST' });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.message).toBe('Méthode non autorisée');
  });

  it('should return 400 for invalid query parameters', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { query: '', priceMin: 'invalid' }, // Empty query and invalid priceMin
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.message).toBe('Paramètres de recherche invalides');
  });

  it('should handle database errors', async () => {
    mockPrisma.product.findMany.mockRejectedValue(new Error('Database error'));

    const { req, res } = createMocks({
      method: 'GET',
      query: { query: 'test' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(false);
    expect(data.message).toBe('Erreur lors de la recherche');
  });

  it('should use default values for optional parameters', async () => {
    mockPrisma.product.findMany.mockResolvedValue(mockProducts as any);
    mockPrisma.product.count.mockResolvedValue(2);

    const { req, res } = createMocks({
      method: 'GET',
      query: { query: 'test' }, // Only required parameter
    });

    await handler(req, res);

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { name: 'asc' }, // Default sort
        skip: 0, // Default page 1
        take: 20, // Default limit
      })
    );

    const data = JSON.parse(res._getData());
    expect(data.data.searchParams.sortBy).toBe('name');
    expect(data.data.searchParams.sortOrder).toBe('asc');
  });
});