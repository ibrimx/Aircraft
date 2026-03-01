// P56 — mobile-layers-swipe.tsx
import { type ReactNode, type CSSProperties, useRef, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { useThemeTokens } from '@brimair/design-tokens';
import { SPRING_PRESETS } from '@brimair/ui';

/* ── Types ─────────────────────────────────────────────── */

export type MobileLayersSwipeProps = {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  threshold?: number;
  velocityThreshold?: number;
};

/* ── Constants ─────────────────────────────────────────── */

const DEFAULT_THRESHOLD = 0.3;
const DEFAULT_VELOCITY = 800;
const DRAG_CONSTRAINTS = { left: 0, right: 0 };

/* ── Styles ────────────────────────────────────────────── */

const wrapCSS: CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
};

const actionCSS: CSSProperties = {
  position: 'absolute',
  insetBlock: 0,
  display: 'flex',
  alignItems: 'center',
  paddingInline: 16,
};

const leftActionCSS: CSSProperties = { ...actionCSS, insetInlineStart: 0 };
const rightActionCSS: CSSProperties = { ...actionCSS, insetInlineEnd: 0 };

/* ── Component ─────────────────────────────────────────── */

export function MobileLayersSwipe({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  threshold = DEFAULT_THRESHOLD,
  velocityThreshold = DEFAULT_VELOCITY,
}: MobileLayersSwipeProps) {
  const tokens = useThemeTokens();
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const leftOpacity = useTransform(x, [0, 80], [0, 1]);
  const rightOpacity = useTransform(x, [-80, 0], [1, 0]);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const w = containerRef.current?.offsetWidth ?? 1;
      const pct = Math.abs(info.offset.x) / w;
      const vel = Math.abs(info.velocity.x);
      if (info.offset.x > 0 && (pct >= threshold || vel >= velocityThreshold)) {
        onSwipeRight?.();
      } else if (info.offset.x < 0 && (pct >= threshold || vel >= velocityThreshold)) {
        onSwipeLeft?.();
      }
    },
    [threshold, velocityThreshold, onSwipeLeft, onSwipeRight],
  );

  const contentCSS: CSSProperties = { position: 'relative', backgroundColor: tokens.surfacePrimary };

  const leftStyle = useMemo(
    () => ({ ...leftActionCSS, opacity: leftOpacity }),
    [leftOpacity],
  );
  const rightStyle = useMemo(
    () => ({ ...rightActionCSS, opacity: rightOpacity }),
    [rightOpacity],
  );

  return (
    <div ref={containerRef} style={wrapCSS}>
      {leftAction && <motion.div style={leftStyle}>{leftAction}</motion.div>}
      {rightAction && <motion.div style={rightStyle}>{rightAction}</motion.div>}
      <motion.div
        style={contentCSS}
        drag="x"
        dragConstraints={DRAG_CONSTRAINTS}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        transition={SPRING_PRESETS.gentle}
      >
        {children}
      </motion.div>
    </div>
  );
}
