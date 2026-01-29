import { createMocks } from 'node-mocks-http';
import { withAuth, withOptionalAuth } from '../../../lib/middleware/auth';

// Mock auth functions
jest.mock('../../../lib/auth', () => ({
  getUserFromToken: jest.fn(),
  getTokenFromRequest: jest.fn(),
}));

import { getUserFromToken, getTokenFromRequest } from '../../../lib/auth';

const mockGetUserFromToken = getUserFromToken as jest.MockedFunction<typeof getUserFromToken>;
const mockGetTokenFromRequest = getTokenFromRequest as jest.MockedFunction<typeof getTokenFromRequest>;

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('withAuth', () => {
    const mockHandler = jest.fn();

    beforeEach(() => {
      mockHandler.mockClear();
    });

    it('should call handler with authenticated user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'USER',
      };

      mockGetTokenFromRequest.mockReturnValue('valid-token');
      mockGetUserFromToken.mockResolvedValue(mockUser);
      mockHandler.mockResolvedValue(undefined);

      const { req, res } = createMocks({ method: 'GET' });
      const wrappedHandler = withAuth(mockHandler);

      await wrappedHandler(req, res);

      expect(mockGetTokenFromRequest).toHaveBeenCalledWith(req);
      expect(mockGetUserFromToken).toHaveBeenCalledWith('valid-token');
      expect(mockHandler).toHaveBeenCalledWith(
        expect.objectContaining({ user: mockUser }),
        res
      );
    });

    it('should return 401 when no token provided', async () => {
      mockGetTokenFromRequest.mockReturnValue(null);

      const { req, res } = createMocks({ method: 'GET' });
      const wrappedHandler = withAuth(mockHandler);

      await wrappedHandler(req, res);

      expect(res._getStatusCode()).toBe(401);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Token d\'authentification requis');
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', async () => {
      mockGetTokenFromRequest.mockReturnValue('invalid-token');
      mockGetUserFromToken.mockResolvedValue(null);

      const { req, res } = createMocks({ method: 'GET' });
      const wrappedHandler = withAuth(mockHandler);

      await wrappedHandler(req, res);

      expect(res._getStatusCode()).toBe(401);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Token invalide ou expiré');
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should return 403 for non-admin when adminOnly is true', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'USER',
      };

      mockGetTokenFromRequest.mockReturnValue('valid-token');
      mockGetUserFromToken.mockResolvedValue(mockUser);

      const { req, res } = createMocks({ method: 'GET' });
      const wrappedHandler = withAuth(mockHandler, { adminOnly: true });

      await wrappedHandler(req, res);

      expect(res._getStatusCode()).toBe(403);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Accès administrateur requis');
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should allow admin when adminOnly is true', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'admin@example.com',
        role: 'ADMIN',
      };

      mockGetTokenFromRequest.mockReturnValue('valid-token');
      mockGetUserFromToken.mockResolvedValue(mockUser);
      mockHandler.mockResolvedValue(undefined);

      const { req, res } = createMocks({ method: 'GET' });
      const wrappedHandler = withAuth(mockHandler, { adminOnly: true });

      await wrappedHandler(req, res);

      expect(mockHandler).toHaveBeenCalledWith(
        expect.objectContaining({ user: mockUser }),
        res
      );
    });

    it('should handle authentication errors', async () => {
      mockGetTokenFromRequest.mockReturnValue('valid-token');
      mockGetUserFromToken.mockRejectedValue(new Error('Auth service error'));

      const { req, res } = createMocks({ method: 'GET' });
      const wrappedHandler = withAuth(mockHandler);

      await wrappedHandler(req, res);

      expect(res._getStatusCode()).toBe(500);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.message).toBe('Erreur d\'authentification');
      expect(mockHandler).not.toHaveBeenCalled();
    });
  });

  describe('withOptionalAuth', () => {
    const mockHandler = jest.fn();

    beforeEach(() => {
      mockHandler.mockClear();
    });

    it('should call handler with user when authenticated', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'USER',
      };

      mockGetTokenFromRequest.mockReturnValue('valid-token');
      mockGetUserFromToken.mockResolvedValue(mockUser);
      mockHandler.mockResolvedValue(undefined);

      const { req, res } = createMocks({ method: 'GET' });
      const wrappedHandler = withOptionalAuth(mockHandler);

      await wrappedHandler(req, res);

      expect(mockHandler).toHaveBeenCalledWith(
        expect.objectContaining({ user: mockUser }),
        res
      );
    });

    it('should call handler without user when no token', async () => {
      mockGetTokenFromRequest.mockReturnValue(null);
      mockHandler.mockResolvedValue(undefined);

      const { req, res } = createMocks({ method: 'GET' });
      const wrappedHandler = withOptionalAuth(mockHandler);

      await wrappedHandler(req, res);

      expect(mockHandler).toHaveBeenCalledWith(
        expect.not.objectContaining({ user: expect.anything() }),
        res
      );
    });

    it('should call handler without user when token is invalid', async () => {
      mockGetTokenFromRequest.mockReturnValue('invalid-token');
      mockGetUserFromToken.mockResolvedValue(null);
      mockHandler.mockResolvedValue(undefined);

      const { req, res } = createMocks({ method: 'GET' });
      const wrappedHandler = withOptionalAuth(mockHandler);

      await wrappedHandler(req, res);

      expect(mockHandler).toHaveBeenCalledWith(
        expect.not.objectContaining({ user: expect.anything() }),
        res
      );
    });

    it('should handle auth errors gracefully and continue', async () => {
      mockGetTokenFromRequest.mockReturnValue('valid-token');
      mockGetUserFromToken.mockRejectedValue(new Error('Auth service error'));
      mockHandler.mockResolvedValue(undefined);

      const { req, res } = createMocks({ method: 'GET' });
      const wrappedHandler = withOptionalAuth(mockHandler);

      await wrappedHandler(req, res);

      // Should still call handler even when auth fails
      expect(mockHandler).toHaveBeenCalledWith(
        expect.not.objectContaining({ user: expect.anything() }),
        res
      );
    });
  });
});