import { useState, useEffect, useRef } from 'react';
import { usePlatform } from './use-platform';

export type KeyboardState = {
  isVisible: boolean;
  keyboardHeight: number;
};

const SSR_STATE: KeyboardState = { isVisible: false, keyboardHeight: 0 };
const MIN_KEYBOARD_HEIGHT = 100;
const DEBOUNCE_MS = 100;

export function useKeyboardVisible(): KeyboardState {
  const [state, setState] = useState<KeyboardState>(SSR_STATE);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const platform = usePlatform();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const vv = window.visualViewport;

    if (vv) {
      const handler = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          const diff = window.innerHeight - vv.height;
          const visible = diff > MIN_KEYBOARD_HEIGHT;
          setState({ isVisible: visible, keyboardHeight: visible ? diff : 0 });
        }, DEBOUNCE_MS);
      };
      vv.addEventListener('resize', handler);
      return () => {
        vv.removeEventListener('resize', handler);
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    /* Fallback: focusin / focusout */
    const onFocusIn = (e: FocusEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        setState({ isVisible: true, keyboardHeight: platform.isIOS ? 300 : 250 });
      }
    };
    const onFocusOut = () => setState(SSR_STATE);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [platform.isIOS]);

  return state;
}
