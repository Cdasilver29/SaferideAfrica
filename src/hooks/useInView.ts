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
    // Fall back to visible if there is no observable DOM node, so content is
    // never left stuck hidden behind a reveal that cannot attach.
    if (!node || typeof (node as { getBoundingClientRect?: unknown }).getBoundingClientRect !== 'function') {
      setInView(true);
      return;
    }

    try {
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
    } catch {
      setInView(true);
    }
  }, [inView, threshold]);

  return { ref, inView };
}
