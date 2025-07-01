import { useState, useEffect, useRef } from 'react';

export const useInView = (options = {}) => {
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState({});
  const ref = useRef(null);

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