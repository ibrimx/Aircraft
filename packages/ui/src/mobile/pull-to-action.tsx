// P63 — pull-to-action.tsx
import {
  type ReactNode,
  useState,
  useCallback,
  useRef,
} from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { PullToActionIndicator } from './pull-to-action-indicator';

/* ── Types ─────────────────────────────────────────────── */

export type PullToActionProps = {
  children: ReactNode;
  onAction: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
  disabled?: boolean;
};

type PullState = 'idle' | 'pulling' | 'loading';

/* ── Constants ───────────────────────────────────────────── */

const DEFAULT_THRESHOLD = 80;
const DEFAULT_RESISTANCE = 0.4;
const SPRING_BACK = { type: 'spring' as const, stiffness: 400, damping: 30, mass: 1 };

/* ── Component ───────────────────────────────────────────── */

export function PullToAction(props: PullToActionProps) {
  const {
    children,
    onAction,
    threshold = DEFAULT_THRESHOLD,
    resistance = DEFAULT_RESISTANCE,
    disabled = false,
  } = props;

  const [state, setState] = useState<PullState>('idle');
  const pullY = useMotionValue(0);
  const startYRef = useRef(0);
  const indicatorOpacity = useTransform(pullY, [0, threshold], [0, 1]);
  const indicatorRotation = useTransform(pullY, [0, threshold], [0, 180]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || state === 'loading') return;
      startYRef.current = e.touches[0].clientY;
    },
    [disabled, state],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || state === 'loading') return;
      const delta = e.touches[0].clientY - startYRef.current;
      if (delta > 0) {
        pullY.set(delta * resistance);
        if (state !== 'pulling') setState('pulling');
      }
    },
    [disabled, pullY, resistance, state],
  );

  const handleTouchEnd = useCallback(async () => {
    if (disabled || state === 'loading') return;
    const current = pullY.get();
    if (current >= threshold) {
      setState('loading');
      animate(pullY.get(), threshold, SPRING_BACK);
      try {
        await onAction();
      } finally {
        animate(pullY.get(), 0, SPRING_BACK);
        setState('idle');
      }
    } else {
      animate(pullY.get(), 0, SPRING_BACK);
      setState('idle');
    }
  }, [disabled, onAction, pullY, state, threshold]);

  const wrapStyle = { position: 'relative' as const, overflow: 'hidden', touchAction: 'pan-x' };

  // Extract motion style to avoid inline double-brace corruption
  const contentMotionStyle = { y: pullY };

  return (
    <div
      style={wrapStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <PullToActionIndicator
        pullY={pullY}
        opacity={indicatorOpacity}
        rotation={indicatorRotation}
        isLoading={state === 'loading'}
      />
      <motion.div style={contentMotionStyle}>{children}</motion.div>
    </div>
  );
}
