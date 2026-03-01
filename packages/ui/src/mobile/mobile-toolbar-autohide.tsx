// P52
import { useEffect, useRef, useState, type RefObject } from 'react';

export interface AutohideOptions {
  readonly scrollRef: RefObject<HTMLElement>;
  readonly threshold?: number;
  readonly delay?: number;
}

export function useMobileToolbarAutohide({
  scrollRef,
  threshold = 10,
  delay = 1500,
}: AutohideOptions): { visible: boolean } {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const y = el.scrollTop;
      const dy = y - lastY.current;
      lastY.current = y;

      if (dy > threshold) {
        setVisible(false);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setVisible(true), delay);
      } else if (dy < 0) {
        setVisible(true);
        if (timer.current) clearTimeout(timer.current);
      }
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [scrollRef, threshold, delay]);

  return { visible };
}
