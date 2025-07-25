import { renderHook, act } from '@testing-library/react';

// Mock implementation of usePerformance hook
const usePerformance = () => {
  const [metrics, setMetrics] = React.useState<{
    name: string;
    duration: number;
    timestamp: number;
  }[]>([]);

  const measureTime = React.useCallback((name: string, fn: () => void | Promise<void>) => {
    const start = performance.now();
    
    const finish = () => {
      const end = performance.now();
      const duration = end - start;
      
      setMetrics(prev => [...prev, {
        name,
        duration,
        timestamp: Date.now()
      }]);
      
      return duration;
    };

    try {
      const result = fn();
      if (result instanceof Promise) {
        return result.then(finish);
      } else {
        return finish();
      }
    } catch (error) {
      finish();
      throw error;
    }
  }, []);

  const clearMetrics = React.useCallback(() => {
    setMetrics([]);
  }, []);

  const getMetrics = React.useCallback(() => {
    return metrics;
  }, [metrics]);

  const getAverageTime = React.useCallback((name: string) => {
    const namedMetrics = metrics.filter(m => m.name === name);
    if (namedMetrics.length === 0) return 0;
    
    const total = namedMetrics.reduce((sum, m) => sum + m.duration, 0);
    return total / namedMetrics.length;
  }, [metrics]);

  return {
    measureTime,
    clearMetrics,
    getMetrics,
    getAverageTime,
    metrics
  };
};

// Add React import for the mock
const React = require('react');

// Mock performance.now
Object.defineProperty(global, 'performance', {
  writable: true,
  value: {
    now: jest.fn()
  }
});

describe('usePerformance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (performance.now as jest.Mock).mockReturnValue(1000);
  });

  it('initializes with empty metrics', () => {
    const { result } = renderHook(() => usePerformance());

    expect(result.current.metrics).toEqual([]);
    expect(result.current.getMetrics()).toEqual([]);
  });

  it('measures synchronous function performance', () => {
    const { result } = renderHook(() => usePerformance());
    
    (performance.now as jest.Mock)
      .mockReturnValueOnce(1000) // Start
      .mockReturnValueOnce(1500); // End

    act(() => {
      result.current.measureTime('test-operation', () => {
        // Simulate some work
      });
    });

    const metrics = result.current.getMetrics();
    expect(metrics).toHaveLength(1);
    expect(metrics[0].name).toBe('test-operation');
    expect(metrics[0].duration).toBe(500);
  });

  it('measures asynchronous function performance', async () => {
    const { result } = renderHook(() => usePerformance());
    
    (performance.now as jest.Mock)
      .mockReturnValueOnce(1000) // Start
      .mockReturnValueOnce(1200); // End

    await act(async () => {
      await result.current.measureTime('async-operation', async () => {
        return new Promise(resolve => setTimeout(resolve, 100));
      });
    });

    const metrics = result.current.getMetrics();
    expect(metrics).toHaveLength(1);
    expect(metrics[0].name).toBe('async-operation');
    expect(metrics[0].duration).toBe(200);
  });

  it('handles function errors gracefully', () => {
    const { result } = renderHook(() => usePerformance());
    
    (performance.now as jest.Mock)
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(1100);

    expect(() => {
      act(() => {
        result.current.measureTime('error-operation', () => {
          throw new Error('Test error');
        });
      });
    }).toThrow('Test error');

    // Should still record the metric
    const metrics = result.current.getMetrics();
    expect(metrics).toHaveLength(1);
    expect(metrics[0].name).toBe('error-operation');
  });

  it('calculates average time for named operations', () => {
    const { result } = renderHook(() => usePerformance());
    
    (performance.now as jest.Mock)
      .mockReturnValueOnce(1000).mockReturnValueOnce(1100) // 100ms
      .mockReturnValueOnce(1200).mockReturnValueOnce(1350) // 150ms
      .mockReturnValueOnce(1400).mockReturnValueOnce(1600); // 200ms

    act(() => {
      result.current.measureTime('repeated-operation', () => {});
      result.current.measureTime('repeated-operation', () => {});
      result.current.measureTime('repeated-operation', () => {});
    });

    expect(result.current.getAverageTime('repeated-operation')).toBe(150); // (100+150+200)/3
  });

  it('returns 0 for average of non-existent operations', () => {
    const { result } = renderHook(() => usePerformance());

    expect(result.current.getAverageTime('non-existent')).toBe(0);
  });

  it('clears all metrics', () => {
    const { result } = renderHook(() => usePerformance());
    
    (performance.now as jest.Mock)
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(1100);

    act(() => {
      result.current.measureTime('test', () => {});
    });

    expect(result.current.getMetrics()).toHaveLength(1);

    act(() => {
      result.current.clearMetrics();
    });

    expect(result.current.getMetrics()).toHaveLength(0);
  });

  it('stores timestamps for metrics', () => {
    const { result } = renderHook(() => usePerformance());
    const mockTimestamp = 1640995200000; // Mock timestamp
    
    jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
    (performance.now as jest.Mock)
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(1100);

    act(() => {
      result.current.measureTime('timestamped-operation', () => {});
    });

    const metrics = result.current.getMetrics();
    expect(metrics[0].timestamp).toBe(mockTimestamp);
  });

  it('handles multiple operations with different names', () => {
    const { result } = renderHook(() => usePerformance());
    
    (performance.now as jest.Mock)
      .mockReturnValueOnce(1000).mockReturnValueOnce(1100) // op1: 100ms
      .mockReturnValueOnce(1200).mockReturnValueOnce(1450); // op2: 250ms

    act(() => {
      result.current.measureTime('operation-1', () => {});
      result.current.measureTime('operation-2', () => {});
    });

    const metrics = result.current.getMetrics();
    expect(metrics).toHaveLength(2);
    expect(metrics[0].name).toBe('operation-1');
    expect(metrics[0].duration).toBe(100);
    expect(metrics[1].name).toBe('operation-2');
    expect(metrics[1].duration).toBe(250);
  });

  it('maintains metrics order', () => {
    const { result } = renderHook(() => usePerformance());
    
    (performance.now as jest.Mock)
      .mockReturnValue(1000).mockReturnValue(1100);

    act(() => {
      result.current.measureTime('first', () => {});
      result.current.measureTime('second', () => {});
      result.current.measureTime('third', () => {});
    });

    const metrics = result.current.getMetrics();
    expect(metrics.map(m => m.name)).toEqual(['first', 'second', 'third']);
  });

  it('handles edge case with very fast operations', () => {
    const { result } = renderHook(() => usePerformance());
    
    // Same timestamp for start and end (very fast operation)
    (performance.now as jest.Mock)
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(1000);

    act(() => {
      result.current.measureTime('fast-operation', () => {});
    });

    const metrics = result.current.getMetrics();
    expect(metrics[0].duration).toBe(0);
  });
});