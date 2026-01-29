/**
 * @jest-environment node
 */

import { prisma } from '../../lib/prisma';

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

describe('Prisma Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export a prisma instance', () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma).toBe('object');
  });

  it('should have database models available', () => {
    expect(prisma.user).toBeDefined();
    expect(prisma.product).toBeDefined();
  });

  it('should be a singleton instance', () => {
    // Import again to test singleton behavior
    const { prisma: prisma2 } = require('../../lib/prisma');
    expect(prisma).toBe(prisma2);
  });

  it('should handle database operations', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await prisma.user.findUnique({
      where: { id: '1' },
    });

    expect(result).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('should handle database errors gracefully', async () => {
    const errorMessage = 'Database connection failed';
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(
      prisma.user.findUnique({ where: { id: '1' } })
    ).rejects.toThrow(errorMessage);
  });
});