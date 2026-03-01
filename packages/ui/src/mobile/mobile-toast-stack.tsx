// P61 — mobile-toast-stack.tsx
import { type CSSProperties, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Z_INDEX } from '@brimair/design-tokens';
import { MobileToast, type MobileToastProps } from './mobile-toast';

/* ── Types ─────────────────────────────────────────────── */

export type ToastData = Omit<MobileToastProps, 'onDismiss'>;

export type MobileToastStackProps = {
  maxVisible?: number;
};

/* ── Styles ────────────────────────────────────────────── */

const stackCSS: CSSProperties = {
  position: 'fixed',
  insetInlineStart: 16,
  insetInlineEnd: 16,
  insetBlockEnd: 16,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  zIndex: Z_INDEX.toast,
  pointerEvents: 'none',
};

const itemCSS: CSSProperties = {
  pointerEvents: 'auto',
};

/* ── Hook ──────────────────────────────────────────────── */

export function useToastStack(maxVisible = 3) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const push = useCallback(
    (toast: ToastData) => {
      setToasts((prev) => {
        const next = [...prev, toast];
        return next.length > maxVisible ? next.slice(-maxVisible) : next;
      });
    },
    [maxVisible],
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, push, dismiss };
}

/* ── Component ─────────────────────────────────────────── */

export function MobileToastStack({ maxVisible = 3 }: MobileToastStackProps) {
  const { toasts, dismiss } = useToastStack(maxVisible);

  return (
    <div style={stackCSS}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} style={itemCSS}>
            <MobileToast {...toast} onDismiss={dismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
