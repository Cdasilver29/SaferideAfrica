import { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';

/**
 * Returns a ref to attach to a View and a boolean that flips to true the
 * first time that View scrolls into the viewport, then stays true.
 *
 * On web this uses IntersectionObserver against the underlying DOM node.
 * On native (no IntersectionObserver), it fires immediately on mount.
 */
export function useInView(threshold = 0.2) {
  const ref = useRef<View>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;

    if (Platform.OS !== 'web' || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const node = ref.current as unknown as Element | null;
    if (!node) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, threshold]);

  return { ref, inView };
}
