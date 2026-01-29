import { useEffect, useRef, useCallback } from 'react';
import { useAccessibility } from '../components/Accessibility/AccessibilityProvider';

interface KeyboardNavigationOptions {
  enableArrowKeys?: boolean;
  enableHomeEnd?: boolean;
  enableTypeahead?: boolean;
  loop?: boolean;
  orientation?: 'horizontal' | 'vertical' | 'both';
  selector?: string;
  onSelect?: (element: HTMLElement, index: number) => void;
  onEscape?: () => void;
}

export const useKeyboardNavigation = (
  containerRef: React.RefObject<HTMLElement>,
  options: KeyboardNavigationOptions = {}
) => {
  const {
    enableArrowKeys = true,
    enableHomeEnd = true,
    enableTypeahead = true,
    loop = false,
    orientation = 'both',
    selector = '[role="button"], button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    onSelect,
    onEscape,
  } = options;

  const { announce } = useAccessibility();
  const currentIndexRef = useRef(0);
  const typeaheadStringRef = useRef('');
  const typeaheadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    return Array.from(containerRef.current.querySelectorAll(selector));
  }, [selector]);

  const focusElement = useCallback((index: number) => {
    const elements = getFocusableElements();
    if (elements.length === 0) return;

    let targetIndex = index;
    if (loop) {
      targetIndex = ((index % elements.length) + elements.length) % elements.length;
    } else {
      targetIndex = Math.max(0, Math.min(index, elements.length - 1));
    }

    const element = elements[targetIndex];
    if (element) {
      element.focus();
      currentIndexRef.current = targetIndex;
      
      // Announce the focused element to screen readers
      const label = element.getAttribute('aria-label') || 
                   element.getAttribute('title') || 
                   element.textContent?.trim() || 
                   'Element';
      announce(`${label}, ${targetIndex + 1} de ${elements.length}`);
      
      onSelect?.(element, targetIndex);
    }
  }, [getFocusableElements, loop, announce, onSelect]);

  const handleTypeahead = useCallback((key: string) => {
    if (!enableTypeahead) return false;

    const elements = getFocusableElements();
    if (elements.length === 0) return false;

    // Clear previous timeout
    if (typeaheadTimeoutRef.current) {
      clearTimeout(typeaheadTimeoutRef.current);
    }

    // Add to typeahead string
    typeaheadStringRef.current += key.toLowerCase();

    // Find matching element
    const startIndex = (currentIndexRef.current + 1) % elements.length;
    let matchIndex = -1;

    // Search from current position forward
    for (let i = 0; i < elements.length; i++) {
      const index = (startIndex + i) % elements.length;
      const element = elements[index];
      const text = (
        element.getAttribute('aria-label') ||
        element.textContent ||
        element.getAttribute('title') ||
        ''
      ).toLowerCase();

      if (text.startsWith(typeaheadStringRef.current)) {
        matchIndex = index;
        break;
      }
    }

    if (matchIndex !== -1) {
      focusElement(matchIndex);
    }

    // Clear typeahead string after delay
    typeaheadTimeoutRef.current = setTimeout(() => {
      typeaheadStringRef.current = '';
    }, 1000);

    return matchIndex !== -1;
  }, [enableTypeahead, getFocusableElements, focusElement]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!containerRef.current?.contains(event.target as Node)) return;

    const elements = getFocusableElements();
    if (elements.length === 0) return;

    const currentElement = event.target as HTMLElement;
    const currentIndex = elements.indexOf(currentElement);
    
    if (currentIndex === -1) return;
    
    currentIndexRef.current = currentIndex;

    let handled = false;

    switch (event.key) {
      case 'ArrowUp':
        if (enableArrowKeys && (orientation === 'vertical' || orientation === 'both')) {
          event.preventDefault();
          focusElement(currentIndex - 1);
          handled = true;
        }
        break;

      case 'ArrowDown':
        if (enableArrowKeys && (orientation === 'vertical' || orientation === 'both')) {
          event.preventDefault();
          focusElement(currentIndex + 1);
          handled = true;
        }
        break;

      case 'ArrowLeft':
        if (enableArrowKeys && (orientation === 'horizontal' || orientation === 'both')) {
          event.preventDefault();
          focusElement(currentIndex - 1);
          handled = true;
        }
        break;

      case 'ArrowRight':
        if (enableArrowKeys && (orientation === 'horizontal' || orientation === 'both')) {
          event.preventDefault();
          focusElement(currentIndex + 1);
          handled = true;
        }
        break;

      case 'Home':
        if (enableHomeEnd) {
          event.preventDefault();
          focusElement(0);
          handled = true;
        }
        break;

      case 'End':
        if (enableHomeEnd) {
          event.preventDefault();
          focusElement(elements.length - 1);
          handled = true;
        }
        break;

      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape();
          handled = true;
        }
        break;

      default:
        // Handle typeahead for printable characters
        if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
          handled = handleTypeahead(event.key);
          if (handled) {
            event.preventDefault();
          }
        }
        break;
    }

    return handled;
  }, [
    getFocusableElements,
    focusElement,
    handleTypeahead,
    enableArrowKeys,
    enableHomeEnd,
    orientation,
    onEscape,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      if (typeaheadTimeoutRef.current) {
        clearTimeout(typeaheadTimeoutRef.current);
      }
    };
  }, [handleKeyDown]);

  // Public API
  return {
    focusElement,
    focusFirst: () => focusElement(0),
    focusLast: () => {
      const elements = getFocusableElements();
      focusElement(elements.length - 1);
    },
    focusNext: () => focusElement(currentIndexRef.current + 1),
    focusPrevious: () => focusElement(currentIndexRef.current - 1),
    getCurrentIndex: () => currentIndexRef.current,
    getElementCount: () => getFocusableElements().length,
  };
};

// Hook for roving tabindex pattern
export const useRovingTabIndex = (
  containerRef: React.RefObject<HTMLElement>,
  options: Omit<KeyboardNavigationOptions, 'selector'> & { 
    itemSelector?: string;
    defaultIndex?: number;
  } = {}
) => {
  const {
    itemSelector = '[role="gridcell"], [role="option"], [role="tab"], [role="menuitem"]',
    defaultIndex = 0,
    ...navigationOptions
  } = options;

  const navigation = useKeyboardNavigation(containerRef, {
    ...navigationOptions,
    selector: itemSelector,
  });

  const updateTabIndex = useCallback((activeIndex: number) => {
    if (!containerRef.current) return;

    const items = Array.from(containerRef.current.querySelectorAll(itemSelector));
    items.forEach((item, index) => {
      const element = item as HTMLElement;
      element.tabIndex = index === activeIndex ? 0 : -1;
    });
  }, [itemSelector]);

  useEffect(() => {
    updateTabIndex(defaultIndex);
  }, [updateTabIndex, defaultIndex]);

  const focusElement = useCallback((index: number) => {
    navigation.focusElement(index);
    updateTabIndex(index);
  }, [navigation, updateTabIndex]);

  return {
    ...navigation,
    focusElement,
    updateTabIndex,
  };
};

// Hook for focus trapping
export const useFocusTrap = (
  containerRef: React.RefObject<HTMLElement>,
  isActive: boolean = true
) => {
  const { announce } = useAccessibility();

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Focus the first element when trap is activated
    firstElement.focus();
    announce('Focus piégé dans cette zone. Utilisez Tab et Shift+Tab pour naviguer.');

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive, announce]);
};

export default useKeyboardNavigation;