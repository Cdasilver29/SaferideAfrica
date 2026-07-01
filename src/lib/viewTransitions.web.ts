import { useEffect, useRef } from 'react';
import { useReduceMotion } from '@/hooks/useReduceMotion';

// Web-only progressive enhancement: wrap client-side route changes in the View
// Transitions API for a smooth cross-fade. Expo Router navigates by calling
// history.pushState, so we wrap it. Guards:
//   - Unsupported browsers (no document.startViewTransition) navigate normally.
//   - Reduce-motion (Phase 12 hook) disables the transition, read live.
//   - Any failure falls back to a plain pushState so navigation never breaks.
// DOM globals are accessed defensively so this file needs no DOM lib types and
// stays inert during Node static rendering (the effect never runs there).
export function useViewTransitions(): void {
  const reduceMotion = useReduceMotion();
  const reduceRef = useRef(reduceMotion);
  reduceRef.current = reduceMotion;

  useEffect(() => {
    const doc: any = typeof document !== 'undefined' ? document : undefined;
    const hist: any = typeof history !== 'undefined' ? history : undefined;
    const raf: any = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : undefined;
    if (!doc || !hist || !raf) return;
    if (typeof doc.startViewTransition !== 'function') return; // unsupported: normal nav
    if (hist.__srViewTransitions) return; // already patched

    const origPush: (...a: any[]) => any = hist.pushState.bind(hist);

    hist.pushState = function (...args: any[]) {
      if (reduceRef.current) {
        origPush(...args);
        return;
      }
      try {
        doc.startViewTransition(() => {
          origPush(...args);
          // Let React commit the new route across two frames before the browser
          // snapshots the new state for the cross-fade.
          return new Promise<void>((resolve) => raf(() => raf(() => resolve())));
        });
      } catch {
        origPush(...args);
      }
    };
    hist.__srViewTransitions = true;

    return () => {
      hist.pushState = origPush;
      hist.__srViewTransitions = false;
    };
  }, []);
}
