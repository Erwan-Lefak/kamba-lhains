import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'));
    
    expect(result.current[0]).toBe('initial');
  });

  it('should return stored value from localStorage', () => {
    localStorageMock.setItem('test', JSON.stringify('stored'));
    
    const { result } = renderHook(() => useLocalStorage('test', 'initial'));
    
    expect(result.current[0]).toBe('stored');
  });

  it('should update localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test', JSON.stringify('updated'));
  });

  it('should support function updates', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));
    
    act(() => {
      result.current[1](prev => prev + 1);
    });
    
    expect(result.current[0]).toBe(1);
  });

  it('should remove value when removeValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    act(() => {
      result.current[2](); // removeValue
    });
    
    expect(result.current[0]).toBe('initial');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('test');
  });

  it('should handle complex objects', () => {
    const initialObject = { name: 'John', age: 30 };
    const updatedObject = { name: 'Jane', age: 25 };
    
    const { result } = renderHook(() => useLocalStorage('user', initialObject));
    
    act(() => {
      result.current[1](updatedObject);
    });
    
    expect(result.current[0]).toEqual(updatedObject);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(updatedObject));
  });

  it('should handle localStorage errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    
    const { result } = renderHook(() => useLocalStorage('test', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should handle invalid JSON in localStorage', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    localStorageMock.getItem.mockReturnValue('invalid json');
    
    const { result } = renderHook(() => useLocalStorage('test', 'initial'));
    
    expect(result.current[0]).toBe('initial');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});