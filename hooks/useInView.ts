import { useState, useEffect, useRef } from 'react';

interface UseInViewOptions {
  threshold?: number | number[];
  root?: Element | Document | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseInViewReturn {
  ref: React.RefObject<Element | null>;
  inView: boolean;
  entry: IntersectionObserverEntry | null;
}

export const useInView = (options: UseInViewOptions = {}): UseInViewReturn => {
  const [inView, setInView] = useState<boolean>(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef<Element | null>(null);

  const { threshold = 0, root = null, rootMargin = '0%', triggerOnce = false } = options;

  useEffect(() => {
    const node = ref?.current;

    if (!node || !window.IntersectionObserver) {
      // Fallback for browsers without Intersection Observer
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isInView = entry.isIntersecting;
        setInView(isInView);
        setEntry(entry);

        if (isInView && triggerOnce) {
          observer.unobserve(node);
        }
      },
      {
        threshold,
        root,
        rootMargin
      }
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, [threshold, root, rootMargin, triggerOnce]);

  return { ref, inView, entry };
};