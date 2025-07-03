import { apiService } from '../../services/api';

// Mock fetch
global.fetch = jest.fn();

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should make successful GET request', async () => {
    const mockData = { id: 1, name: 'Test' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await apiService.get('/test');

    expect(fetch).toHaveBeenCalledWith('/api/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(result).toEqual({
      success: true,
      data: mockData,
    });
  });

  it('should handle HTTP errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Not found' }),
    });

    const result = await apiService.get('/test');

    expect(result).toEqual({
      success: false,
      error: 'Not found',
    });
  });

  it('should handle network errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await apiService.get('/test');

    expect(result).toEqual({
      success: false,
      error: 'Network error',
    });
  });

  it('should make POST request with data', async () => {
    const mockData = { id: 1, name: 'Test' };
    const postData = { name: 'New item' };
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await apiService.post('/test', postData);

    expect(fetch).toHaveBeenCalledWith('/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    expect(result).toEqual({
      success: true,
      data: mockData,
    });
  });
});