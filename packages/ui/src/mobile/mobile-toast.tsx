// P61 — mobile-toast.tsx
import { type CSSProperties, useEffect, useCallback, useMemo } from 'react';
import { motion, useMotionValue, type PanInfo } from 'framer-motion';
import { useThemeTokens } from '@brimair/design-tokens';
import { Z_INDEX } from '@brimair/design-tokens';
import { SPRING_PRESETS } from '@brimair/ui';
import { GlassPanel } from '@brimair/ui';

/* ── Types ─────────────────────────────────────────────── */

type ToastVariant = 'info' | 'success' | 'error' | 'warning';

export type MobileToastProps = {
  id: string;
  message: string;
  variant?: ToastVariant;
  autoDismissMs?: number;
  onDismiss: (id: string) => void;
};

/* ── Constants ─────────────────────────────────────────── */

const DEFAULT_DISMISS = 4000;

const VARIANT_ICONS: Record<ToastVariant, string> = {
  info: 'ℹ️',
  success: '✅',
  error: '❌',
  warning: '⚠️',
};

/* ── Styles ────────────────────────────────────────────── */

const toastCSS: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  paddingBlock: 14,
  paddingInline: 18,
  borderRadius: 14,
  zIndex: Z_INDEX.toast,
  cursor: 'grab',
  touchAction: 'none',
  maxInlineSize: 'calc(100vw - 32px)',
};

const msgCSS: CSSProperties = {
  flex: 1,
  fontSize: 14,
  fontWeight: 500,
};

/* ── Component ─────────────────────────────────────────── */

export function MobileToast({
  id,
  message,
  variant = 'info',
  autoDismissMs = DEFAULT_DISMISS,
  onDismiss,
}: MobileToastProps) {
  const tokens = useThemeTokens();
  const x = useMotionValue(0);

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), autoDismissMs);
    return () => clearTimeout(timer);
  }, [id, autoDismissMs, onDismiss]);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (Math.abs(info.offset.x) > 100 || Math.abs(info.velocity.x) > 500) {
        onDismiss(id);
      }
    },
    [id, onDismiss],
  );

  const wrapStyle: CSSProperties = useMemo(
    () => ({ ...toastCSS }),
    [],
  );

  const textStyle: CSSProperties = useMemo(
    () => ({ ...msgCSS, color: tokens.textPrimary }),
    [tokens.textPrimary],
  );

  const DRAG_CONSTRAINTS = { left: 0, right: 0 };

  return (
    <motion.div
      layout
      style={wrapStyle}
      drag="x"
      dragConstraints={DRAG_CONSTRAINTS}
      dragElastic={0.5}
      onDragEnd={handleDragEnd}
      initial= opacity: 0, y: 40, scale: 0.9 
      animate= opacity: 1, y: 0, scale: 1 
      exit={{ opacity: 0, x: 200, transition: { duration: 0.2 } }}
      transition={SPRING_PRESETS.gentle}
    >
      <GlassPanel>
        <div style={wrapStyle}>
          <span>{VARIANT_ICONS[variant]}</span>
          <span style={textStyle}>{message}</span>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
