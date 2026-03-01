// P63 — pull-to-action-indicator.tsx
import { type CSSProperties, useMemo } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { useThemeTokens } from '@brimair/design-tokens';

/* ── Types ─────────────────────────────────────────────── */

export type PullToActionIndicatorProps = {
  pullY: MotionValue<number>;
  opacity: MotionValue<number>;
  rotation: MotionValue<number>;
  isLoading: boolean;
};

/* ── Constants ───────────────────────────────────────────── */

const INDICATOR_SIZE = 28;
const SPINNER_SPRING = { type: 'spring' as const, stiffness: 80, damping: 12, mass: 1 };

/* ── Component ───────────────────────────────────────────── */

export function PullToActionIndicator(props: PullToActionIndicatorProps) {
  const { opacity, rotation, isLoading } = props;
  const tokens = useThemeTokens();

  const wrapStyle: CSSProperties = useMemo(
    () => ({
      display: 'flex',
      justifyContent: 'center',
      paddingBlock: 8,
      position: 'absolute' as const,
      insetInlineStart: 0,
      insetInlineEnd: 0,
      top: -40,
    }),
    [],
  );

  const dotStyle: CSSProperties = useMemo(
    () => ({
      inlineSize: INDICATOR_SIZE,
      blockSize: INDICATOR_SIZE,
      borderRadius: '50%',
      border: `2px solid ${tokens.border}`,
      borderTopColor: tokens.accentPrimary,
    }),
    [tokens.border, tokens.accentPrimary],
  );

  const spinAnimate = isLoading
    ? { rotate: 360 }
    : { rotate: rotation };

  const spinTransition = isLoading
    ? { repeat: Infinity, duration: 0.8, ease: 'linear' as const }
    : SPINNER_SPRING;

  // Extract motion style to avoid inline double-brace corruption
  const indicatorMotionStyle = { ...wrapStyle, opacity };

  return (
    <motion.div style={indicatorMotionStyle}>
      <motion.div
        style={dotStyle}
        animate={spinAnimate}
        transition={spinTransition}
      />
    </motion.div>
  );
}
