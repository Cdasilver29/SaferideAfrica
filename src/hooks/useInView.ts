import { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';

/**
 * Returns a ref to attach to a View and a boolean that flips to true the
 * first time that View scrolls into the viewport, then stays true.
 *
 * On web this uses IntersectionObserver against the underlying DOM node.
 * On native (no IntersectionObserver), it fires immediately on mount.
 */

/**
 * How far into the viewport an element's leading edge must come before it is
 * treated as in view. Replaces the old ratio threshold, which tall sections
 * could never satisfy. See the note in the observer below.
 */
const REVEAL_OFFSET_PX = 60;

/**
 * `threshold` is accepted for call-site compatibility and is intentionally
 * unused: every caller now reveals on the same pixel offset above.
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
      // Deliberately NOT a ratio. A section taller than the viewport can never
      // reach a ratio threshold: 11 service cards stacked on a phone run past
      // 4000px, so in a 480px window the most that is ever visible is about
      // 0.11, and asking for 0.12 left the section stuck at opacity 0 while
      // still occupying its full layout height. That is what rendered as a
      // blank page you had to scroll through.
      //
      // Measuring the element and clamping the ratio does not fix it either:
      // on mount the height is read before images lay out, so the clamp is
      // computed from the wrong number. Trigger on any pixel instead, and use
      // rootMargin to hold the reveal until the element is genuinely entering.
      // This cannot deadlock at any element height.
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0, rootMargin: `0px 0px -${REVEAL_OFFSET_PX}px 0px` },
      );
      observer.observe(node);
      return () => observer.disconnect();
    } catch {
      setInView(true);
    }
  }, [inView, threshold]);

  return { ref, inView };
}
