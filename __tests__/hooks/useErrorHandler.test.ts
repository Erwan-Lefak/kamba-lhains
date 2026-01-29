import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from '../../hooks/useErrorHandler';

describe('useErrorHandler', () => {
  it('should initialize with no error', () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle string errors', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError('Test error message');
    });

    expect(result.current.error).toEqual({
      message: 'Test error message',
      code: undefined,
      timestamp: expect.any(Date),
    });
  });

  it('should handle Error objects', () => {
    const { result } = renderHook(() => useErrorHandler());
    const testError = new Error('Test error object');

    act(() => {
      result.current.handleError(testError, 'TEST_CODE');
    });

    expect(result.current.error).toEqual({
      message: 'Test error object',
      code: 'TEST_CODE',
      timestamp: expect.any(Date),
    });
  });

  it('should clear errors', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError('Test error');
    });

    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('should execute async function with error handling', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const successFunction = jest.fn().mockResolvedValue('success');

    let promiseResult;
    await act(async () => {
      promiseResult = await result.current.executeWithErrorHandling(successFunction);
    });

    expect(promiseResult).toBe('success');
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle errors in async function execution', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const errorFunction = jest.fn().mockRejectedValue(new Error('Async error'));

    let promiseResult;
    await act(async () => {
      promiseResult = await result.current.executeWithErrorHandling(errorFunction);
    });

    expect(promiseResult).toBeNull();
    expect(result.current.error).toEqual({
      message: 'Async error',
      code: undefined,
      timestamp: expect.any(Date),
    });
    expect(result.current.isLoading).toBe(false);
  });
});