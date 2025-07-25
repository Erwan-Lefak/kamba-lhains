import { useRef, useCallback, MutableRefObject } from 'react';

interface GestureState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startTime: number;
  isDragging: boolean;
  initialDistance?: number;
  scale?: number;
}

interface GestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onLongPress?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
}

interface GestureOptions {
  swipeThreshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
  pinchThreshold?: number;
}

export function useGestures<T extends HTMLElement>(
  handlers: GestureHandlers,
  options: GestureOptions = {}
) {
  const {
    swipeThreshold = 50,
    longPressDelay = 500,
    doubleTapDelay = 300,
    pinchThreshold = 0.1
  } = options;

  const elementRef = useRef<T>(null);
  const gestureState = useRef<GestureState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    startTime: 0,
    isDragging: false
  });

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const lastTapTime = useRef<number>(0);

  // Calculer la distance entre deux points (pour pinch)
  const getDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const state = gestureState.current;
    
    state.startX = touch.clientX;
    state.startY = touch.clientY;
    state.currentX = touch.clientX;
    state.currentY = touch.clientY;
    state.startTime = Date.now();
    state.isDragging = false;

    // Multi-touch pour pinch
    if (e.touches.length === 2) {
      state.initialDistance = getDistance(e.touches);
      state.scale = 1;
    }

    // Long press timer
    if (handlers.onLongPress) {
      longPressTimer.current = setTimeout(() => {
        if (!state.isDragging) {
          handlers.onLongPress!();
        }
      }, longPressDelay);
    }
  }, [handlers.onLongPress, longPressDelay]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const state = gestureState.current;
    
    state.currentX = touch.clientX;
    state.currentY = touch.clientY;
    state.isDragging = true;

    // Annuler long press si mouvement
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    // Gestion du pinch
    if (e.touches.length === 2 && state.initialDistance && handlers.onPinch) {
      const currentDistance = getDistance(e.touches);
      const scale = currentDistance / state.initialDistance;
      
      if (Math.abs(scale - (state.scale || 1)) > pinchThreshold) {
        state.scale = scale;
        handlers.onPinch(scale);
      }
    }
  }, [handlers.onPinch, pinchThreshold]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const state = gestureState.current;
    const deltaX = state.currentX - state.startX;
    const deltaY = state.currentY - state.startY;
    const deltaTime = Date.now() - state.startTime;

    // Annuler long press
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    // Détection du swipe
    if (Math.abs(deltaX) > swipeThreshold || Math.abs(deltaY) > swipeThreshold) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Swipe horizontal
        if (deltaX > 0 && handlers.onSwipeRight) {
          handlers.onSwipeRight();
        } else if (deltaX < 0 && handlers.onSwipeLeft) {
          handlers.onSwipeLeft();
        }
      } else {
        // Swipe vertical
        if (deltaY > 0 && handlers.onSwipeDown) {
          handlers.onSwipeDown();
        } else if (deltaY < 0 && handlers.onSwipeUp) {
          handlers.onSwipeUp();
        }
      }
    } else if (!state.isDragging && deltaTime < 300) {
      // Tap ou double tap
      const now = Date.now();
      if (now - lastTapTime.current < doubleTapDelay && handlers.onDoubleTap) {
        handlers.onDoubleTap();
        lastTapTime.current = 0; // Reset pour éviter triple tap
      } else {
        lastTapTime.current = now;
        // Délai pour vérifier si c'est un double tap
        setTimeout(() => {
          if (lastTapTime.current === now && handlers.onTap) {
            handlers.onTap();
          }
        }, doubleTapDelay);
      }
    }

    // Reset state
    state.isDragging = false;
    state.initialDistance = undefined;
    state.scale = undefined;
  }, [handlers, swipeThreshold, doubleTapDelay]);

  // Attacher les événements
  const attachGestures = useCallback((element: T | null) => {
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    elementRef: elementRef as MutableRefObject<T | null>,
    attachGestures,
    gestureState: gestureState.current
  };
}