import { securityHeaders, SecurityConfig } from '../../../lib/middleware/security';

// Mock Next.js request and response objects
const mockRequest = (headers: Record<string, string> = {}, ip: string = '127.0.0.1') => ({
  headers,
  ip,
  url: '/test',
  method: 'GET',
  socket: { remoteAddress: ip }
} as any);

const mockResponse = () => {
  const res = {
    setHeader: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res as any;
};

const mockNext = jest.fn();

describe('security middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets default security headers', async () => {
    const middleware = securityHeaders();
    const req = mockRequest();
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(res.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
    expect(res.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
    expect(res.setHeader).toHaveBeenCalledWith('Referrer-Policy', 'strict-origin-when-cross-origin');
    expect(res.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
    expect(mockNext).toHaveBeenCalled();
  });

  it('sets HSTS header when enabled', async () => {
    const config: SecurityConfig = {
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    };

    const middleware = securityHeaders(config);
    const req = mockRequest();
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(res.setHeader).toHaveBeenCalledWith(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  });

  it('sets CSP header when provided', async () => {
    const config: SecurityConfig = {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"]
        }
      }
    };

    const middleware = securityHeaders(config);
    const req = mockRequest();
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Security-Policy',
      expect.stringContaining("default-src 'self'")
    );
  });

  it('detects suspicious user agents', async () => {
    const suspiciousUA = 'sqlmap/1.0';
    const middleware = securityHeaders();
    const req = mockRequest({ 'user-agent': suspiciousUA });
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Forbidden'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('blocks SQL injection attempts', async () => {
    const sqlInjection = 'SELECT * FROM users WHERE id=1 OR 1=1';
    const middleware = securityHeaders();
    const req = mockRequest({}, '192.168.1.1');
    req.url = `/search?q=${encodeURIComponent(sqlInjection)}`;

    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('allows legitimate requests', async () => {
    const middleware = securityHeaders();
    const req = mockRequest({
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('handles XSS attempts', async () => {
    const xssAttempt = '<script>alert("xss")</script>';
    const middleware = securityHeaders();
    const req = mockRequest();
    req.url = `/page?content=${encodeURIComponent(xssAttempt)}`;
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('blocks requests with suspicious file extensions', async () => {
    const middleware = securityHeaders();
    const req = mockRequest();
    req.url = '/uploads/malicious.php';
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('allows requests from trusted IPs when configured', async () => {
    const config: SecurityConfig = {
      trustedIPs: ['192.168.1.100']
    };

    const middleware = securityHeaders(config);
    const req = mockRequest({ 'user-agent': 'sqlmap/1.0' }, '192.168.1.100');
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('handles rate limiting for suspicious activity', async () => {
    const middleware = securityHeaders();
    const req = mockRequest({}, '10.0.0.1');
    const res = mockResponse();

    // Make multiple suspicious requests
    for (let i = 0; i < 6; i++) {
      req.url = `/search?q=<script>alert(${i})</script>`;
      await middleware(req, mockResponse(), jest.fn());
    }

    // Next request should be rate limited
    await middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('customizes headers based on configuration', async () => {
    const config: SecurityConfig = {
      frameOptions: 'SAMEORIGIN',
      contentTypeOptions: false,
      customHeaders: {
        'X-Custom-Header': 'custom-value'
      }
    };

    const middleware = securityHeaders(config);
    const req = mockRequest();
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(res.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'SAMEORIGIN');
    expect(res.setHeader).toHaveBeenCalledWith('X-Custom-Header', 'custom-value');
    expect(res.setHeader).not.toHaveBeenCalledWith('X-Content-Type-Options', expect.anything());
  });

  it('handles requests without user agent', async () => {
    const middleware = securityHeaders();
    const req = mockRequest({});
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('logs security events when logger is configured', async () => {
    const mockLogger = jest.fn();
    const config: SecurityConfig = {
      logger: mockLogger
    };

    const middleware = securityHeaders(config);
    const req = mockRequest({ 'user-agent': 'sqlmap/1.0' });
    const res = mockResponse();

    await middleware(req, res, mockNext);

    expect(mockLogger).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SUSPICIOUS_USER_AGENT',
        ip: '127.0.0.1'
      })
    );
  });
});