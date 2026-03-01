// P50
import { useEffect, useRef, type RefObject } from 'react';

export interface ScrollLockOptions {
  readonly enabled: boolean;
  readonly sheetRef: RefObject<HTMLElement>;
}

let lockCount = 0;

export function useBottomSheetScrollLock({ enabled, sheetRef }: ScrollLockOptions): void {
  const scrollY = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    if (typeof document === 'undefined') return;

    lockCount += 1;
    if (lockCount === 1) {
      scrollY.current = window.scrollY;
      const prev = document.body.style.cssText;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.inlineSize = '100%';
      document.body.style.top = `-${scrollY.current}px`;

      const onTouch = (e: TouchEvent) => {
        const target = e.target as Node | null;
        if (sheetRef.current?.contains(target)) return;
        e.preventDefault();
      };

      document.addEventListener('touchmove', onTouch, { passive: false });

      return () => {
        lockCount -= 1;
        if (lockCount === 0) {
          document.body.style.cssText = prev;
          window.scrollTo(0, scrollY.current);
        }
        document.removeEventListener('touchmove', onTouch);
      };
    }

    return () => {
      lockCount -= 1;
    };
  }, [enabled, sheetRef]);
}

export function BottomSheetScrollLock({ enabled, sheetRef }: ScrollLockOptions): null {
  useBottomSheetScrollLock({ enabled, sheetRef });
  return null;
}
