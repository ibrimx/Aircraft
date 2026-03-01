import { useState, useEffect } from 'react';

export function useTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || window.matchMedia?.('(pointer: coarse)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || isTouch) return;

    const onTouch = () => setIsTouch(true);
    window.addEventListener('touchstart', onTouch, { once: true, passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouch);
    };
  }, [isTouch]);

  return isTouch;
}
