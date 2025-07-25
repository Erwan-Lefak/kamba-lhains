/**
 * @jest-environment node
 */

// Mock API endpoint functionality
const handleProducts = (req, res) => {
  const { method, query } = req;

  switch (method) {
    case 'GET':
      // Mock product data
      const mockProducts = [
        {
          id: 1,
          name: 'Test Product 1',
          price: '50,00 EUR',
          category: 'femme',
          featured: true,
          inStock: true
        },
        {
          id: 2,
          name: 'Test Product 2', 
          price: '75,00 EUR',
          category: 'homme',
          featured: false,
          inStock: true
        }
      ];

      let filteredProducts = mockProducts;

      // Apply filters
      if (query.category) {
        filteredProducts = filteredProducts.filter(p => p.category === query.category);
      }

      if (query.featured === 'true') {
        filteredProducts = filteredProducts.filter(p => p.featured);
      }

      if (query.inStock === 'true') {
        filteredProducts = filteredProducts.filter(p => p.inStock);
      }

      return res.status(200).json({
        success: true,
        data: filteredProducts,
        total: filteredProducts.length
      });

    case 'POST':
      // Mock product creation
      const newProduct = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
      };

      return res.status(201).json({
        success: true,
        data: newProduct
      });

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({
        success: false,
        error: `Method ${method} not allowed`
      });
  }
};

// Mock request and response objects
const mockRequest = (method = 'GET', query = {}, body = {}) => ({
  method,
  query,
  body,
  headers: {}
});

const mockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
  };
  return res;
};

describe('/api/products endpoint', () => {
  it('returns all products on GET request', () => {
    const req = mockRequest('GET');
    const res = mockResponse();

    handleProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.any(String)
        })
      ]),
      total: 2
    });
  });

  it('filters products by category', () => {
    const req = mockRequest('GET', { category: 'femme' });
    const res = mockResponse();

    handleProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.arrayContaining([
        expect.objectContaining({
          category: 'femme'
        })
      ]),
      total: 1
    });
  });

  it('filters featured products', () => {
    const req = mockRequest('GET', { featured: 'true' });
    const res = mockResponse();

    handleProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.arrayContaining([
        expect.objectContaining({
          featured: true
        })
      ]),
      total: 1
    });
  });

  it('filters in-stock products', () => {
    const req = mockRequest('GET', { inStock: 'true' });
    const res = mockResponse();

    handleProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.arrayContaining([
        expect.objectContaining({
          inStock: true
        })
      ]),
      total: 2
    });
  });

  it('creates new product on POST request', () => {
    const newProductData = {
      name: 'New Product',
      price: '100,00 EUR',
      category: 'accessoires',
      featured: false,
      inStock: true
    };

    const req = mockRequest('POST', {}, newProductData);
    const res = mockResponse();

    handleProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.objectContaining({
        ...newProductData,
        id: expect.any(Number),
        createdAt: expect.any(String)
      })
    });
  });

  it('returns 405 for unsupported methods', () => {
    const req = mockRequest('DELETE');
    const res = mockResponse();

    handleProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.setHeader).toHaveBeenCalledWith('Allow', ['GET', 'POST']);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Method DELETE not allowed'
    });
  });

  it('handles multiple query filters', () => {
    const req = mockRequest('GET', { category: 'femme', featured: 'true' });
    const res = mockResponse();

    handleProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.arrayContaining([
        expect.objectContaining({
          category: 'femme',
          featured: true
        })
      ]),
      total: 1
    });
  });

  it('returns empty array when no products match filters', () => {
    const req = mockRequest('GET', { category: 'nonexistent' });
    const res = mockResponse();

    handleProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [],
      total: 0
    });
  });

  it('handles empty POST body', () => {
    const req = mockRequest('POST', {}, {});
    const res = mockResponse();

    handleProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.objectContaining({
        id: expect.any(Number),
        createdAt: expect.any(String)
      })
    });
  });

  it('preserves original product structure in responses', () => {
    const req = mockRequest('GET');
    const res = mockResponse();

    handleProducts(req, res);

    const responseCall = res.json.mock.calls[0][0];
    const product = responseCall.data[0];

    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('category');
    expect(product).toHaveProperty('featured');
    expect(product).toHaveProperty('inStock');
  });
});