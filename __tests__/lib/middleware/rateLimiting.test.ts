import { rateLimit, RateLimitConfig } from '../../../lib/middleware/rateLimiting';

// Mock Next.js request and response objects
const mockRequest = (ip: string = '127.0.0.1') => ({
  ip,
  socket: { remoteAddress: ip },
  headers: { 'x-forwarded-for': ip },
  connection: { remoteAddress: ip }
} as any);

const mockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
  };
  return res as any;
};

const mockNext = jest.fn();

describe('rateLimiting middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear rate limit store before each test
    if (global.rateLimitStore) {
      global.rateLimitStore.clear();
    }
  });

  it('allows requests within rate limit', async () => {
    const config: RateLimitConfig = {
      windowMs: 60000,
      max: 5,
      message: 'Too many requests'
    };

    const middleware = rateLimit(config);
    const req = mockRequest();
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('blocks requests exceeding rate limit', async () => {
    const config: RateLimitConfig = {
      windowMs: 60000,
      max: 2,
      message: 'Rate limit exceeded'
    };

    const middleware = rateLimit(config);
    const req = mockRequest('192.168.1.1');
    const res = mockResponse();

    // Make requests up to the limit
    await middleware(req, res, mockNext);
    await middleware(req, res, mockNext);
    
    // This should be blocked
    await middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Rate limit exceeded'
    });
  });

  it('sets correct response headers', async () => {
    const config: RateLimitConfig = {
      windowMs: 60000,
      max: 10
    };

    const middleware = rateLimit(config);
    const req = mockRequest();
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 10);
    expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', expect.any(Number));
    expect(res.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', expect.any(Number));
  });

  it('handles different IP addresses separately', async () => {
    const config: RateLimitConfig = {
      windowMs: 60000,
      max: 1
    };

    const middleware = rateLimit(config);
    const req1 = mockRequest('192.168.1.1');
    const req2 = mockRequest('192.168.1.2');
    const res1 = mockResponse();
    const res2 = mockResponse();

    await middleware(req1, res1, mockNext);
    await middleware(req2, res2, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(2);
    expect(res1.status).not.toHaveBeenCalled();
    expect(res2.status).not.toHaveBeenCalled();
  });

  it('uses custom message when provided', async () => {
    const customMessage = 'Custom rate limit message';
    const config: RateLimitConfig = {
      windowMs: 60000,
      max: 1,
      message: customMessage
    };

    const middleware = rateLimit(config);
    const req = mockRequest();
    const res = mockResponse();

    // Exceed the limit
    await middleware(req, res, mockNext);
    await middleware(req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith({
      error: customMessage
    });
  });

  it('handles requests without IP gracefully', async () => {
    const config: RateLimitConfig = {
      windowMs: 60000,
      max: 5
    };

    const middleware = rateLimit(config);
    const req = { socket: {}, headers: {}, connection: {} } as any;
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('resets count after window expires', async () => {
    const config: RateLimitConfig = {
      windowMs: 100, // Very short window for testing
      max: 1
    };

    const middleware = rateLimit(config);
    const req = mockRequest();
    const res = mockResponse();

    // First request should pass
    await middleware(req, res, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);

    // Second request should be blocked
    await middleware(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(429);

    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, 150));

    // New request should pass again
    const newRes = mockResponse();
    await middleware(req, newRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(2);
  });

  it('handles concurrent requests correctly', async () => {
    const config: RateLimitConfig = {
      windowMs: 60000,
      max: 3
    };

    const middleware = rateLimit(config);
    const req = mockRequest('10.0.0.1');

    // Make multiple concurrent requests
    const promises = Array.from({ length: 5 }, () => {
      const res = mockResponse();
      return middleware(req, res, mockNext);
    });

    await Promise.all(promises);

    // Should have some blocked requests
    const blockedCount = mockResponse.prototype.status.mock.calls.filter(
      call => call[0] === 429
    ).length;

    expect(blockedCount).toBeGreaterThan(0);
  });

  it('handles edge case with zero max requests', async () => {
    const config: RateLimitConfig = {
      windowMs: 60000,
      max: 0
    };

    const middleware = rateLimit(config);
    const req = mockRequest();
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(mockNext).not.toHaveBeenCalled();
  });
});