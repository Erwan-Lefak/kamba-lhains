import { renderHook, act } from '@testing-library/react';

// Mock implementation of useGestures hook
const useGestures = (element: HTMLElement | null, options: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
} = {}) => {
  const [isGesturing, setIsGesturing] = React.useState(false);
  const [gestureData, setGestureData] = React.useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  React.useEffect(() => {
    if (!element) return;

    const threshold = options.threshold || 50;
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      setIsGesturing(true);
      setGestureData({
        startX,
        startY,
        currentX: startX,
        currentY: startY
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isGesturing) return;
      const touch = e.touches[0];
      setGestureData(prev => prev ? {
        ...prev,
        currentX: touch.clientX,
        currentY: touch.clientY
      } : null);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isGesturing) return;
      
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            options.onSwipeRight?.();
          } else {
            options.onSwipeLeft?.();
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0) {
            options.onSwipeDown?.();
          } else {
            options.onSwipeUp?.();
          }
        }
      }

      setIsGesturing(false);
      setGestureData(null);
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [element, options, isGesturing]);

  return {
    isGesturing,
    gestureData
  };
};

// Add React import for the mock
const React = require('react');

describe('useGestures', () => {
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    document.body.removeChild(mockElement);
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useGestures(mockElement));

    expect(result.current.isGesturing).toBe(false);
    expect(result.current.gestureData).toBe(null);
  });

  it('detects swipe left gesture', () => {
    const onSwipeLeft = jest.fn();
    const { result } = renderHook(() => useGestures(mockElement, { onSwipeLeft }));

    // Simulate touch events
    act(() => {
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 } as Touch]
      });
      mockElement.dispatchEvent(touchStart);
    });

    expect(result.current.isGesturing).toBe(true);

    act(() => {
      const touchEnd = new TouchEvent('touchend', {
        changedTouches: [{ clientX: 40, clientY: 100 } as Touch]
      });
      mockElement.dispatchEvent(touchEnd);
    });

    expect(onSwipeLeft).toHaveBeenCalled();
    expect(result.current.isGesturing).toBe(false);
  });

  it('detects swipe right gesture', () => {
    const onSwipeRight = jest.fn();
    renderHook(() => useGestures(mockElement, { onSwipeRight }));

    act(() => {
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 } as Touch]
      });
      mockElement.dispatchEvent(touchStart);
    });

    act(() => {
      const touchEnd = new TouchEvent('touchend', {
        changedTouches: [{ clientX: 160, clientY: 100 } as Touch]
      });
      mockElement.dispatchEvent(touchEnd);
    });

    expect(onSwipeRight).toHaveBeenCalled();
  });

  it('detects swipe up gesture', () => {
    const onSwipeUp = jest.fn();
    renderHook(() => useGestures(mockElement, { onSwipeUp }));

    act(() => {
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 } as Touch]
      });
      mockElement.dispatchEvent(touchStart);
    });

    act(() => {
      const touchEnd = new TouchEvent('touchend', {
        changedTouches: [{ clientX: 100, clientY: 40 } as Touch]
      });
      mockElement.dispatchEvent(touchEnd);
    });

    expect(onSwipeUp).toHaveBeenCalled();
  });

  it('detects swipe down gesture', () => {
    const onSwipeDown = jest.fn();
    renderHook(() => useGestures(mockElement, { onSwipeDown }));

    act(() => {
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 } as Touch]
      });
      mockElement.dispatchEvent(touchStart);
    });

    act(() => {
      const touchEnd = new TouchEvent('touchend', {
        changedTouches: [{ clientX: 100, clientY: 160 } as Touch]
      });
      mockElement.dispatchEvent(touchEnd);
    });

    expect(onSwipeDown).toHaveBeenCalled();
  });

  it('respects custom threshold', () => {
    const onSwipeLeft = jest.fn();
    renderHook(() => useGestures(mockElement, { onSwipeLeft, threshold: 100 }));

    act(() => {
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 } as Touch]
      });
      mockElement.dispatchEvent(touchStart);
    });

    // Small movement below threshold
    act(() => {
      const touchEnd = new TouchEvent('touchend', {
        changedTouches: [{ clientX: 80, clientY: 100 } as Touch]
      });
      mockElement.dispatchEvent(touchEnd);
    });

    expect(onSwipeLeft).not.toHaveBeenCalled();

    // Large movement above threshold
    act(() => {
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 } as Touch]
      });
      mockElement.dispatchEvent(touchStart);
    });

    act(() => {
      const touchEnd = new TouchEvent('touchend', {
        changedTouches: [{ clientX: -10, clientY: 100 } as Touch]
      });
      mockElement.dispatchEvent(touchEnd);
    });

    expect(onSwipeLeft).toHaveBeenCalled();
  });

  it('handles null element gracefully', () => {
    const onSwipeLeft = jest.fn();
    
    expect(() => {
      renderHook(() => useGestures(null, { onSwipeLeft }));
    }).not.toThrow();
  });

  it('updates gesture data during touch move', () => {
    const { result } = renderHook(() => useGestures(mockElement));

    act(() => {
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 } as Touch]
      });
      mockElement.dispatchEvent(touchStart);
    });

    expect(result.current.gestureData).toEqual({
      startX: 100,
      startY: 100,
      currentX: 100,
      currentY: 100
    });

    act(() => {
      const touchMove = new TouchEvent('touchmove', {
        touches: [{ clientX: 120, clientY: 110 } as Touch]
      });
      mockElement.dispatchEvent(touchMove);
    });

    expect(result.current.gestureData).toEqual({
      startX: 100,
      startY: 100,
      currentX: 120,
      currentY: 110
    });
  });

  it('clears gesture data on touch end', () => {
    const { result } = renderHook(() => useGestures(mockElement));

    act(() => {
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 } as Touch]
      });
      mockElement.dispatchEvent(touchStart);
    });

    expect(result.current.gestureData).toBeTruthy();

    act(() => {
      const touchEnd = new TouchEvent('touchend', {
        changedTouches: [{ clientX: 100, clientY: 100 } as Touch]
      });
      mockElement.dispatchEvent(touchEnd);
    });

    expect(result.current.gestureData).toBe(null);
  });
});