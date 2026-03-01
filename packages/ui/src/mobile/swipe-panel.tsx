// P62 — swipe-panel.tsx
import {
  type ReactNode,
  type CSSProperties,
  useState,
  useCallback,
  useMemo,
  useRef,
  Children,
} from 'react';
import { motion, useMotionValue, animate, type PanInfo } from 'framer-motion';
import { useThemeTokens } from '@aircraft/design-tokens';
import { EASING, DURATION } from '@aircraft/design-tokens';

/* ── Types ─────────────────────────────────────────────── */

export type SwipePanelProps = {
  children: ReactNode;
  activeIndex?: number;
  onIndexChange?: (index: number) => void;
  snapVelocity?: number;
  rubberBandFactor?: number;
  showIndicator?: boolean;
  gap?: number;
};

/* ── Constants ─────────────────────────────────────────── */

const DEFAULT_SNAP_VELOCITY = 600;
const DEFAULT_RUBBER = 0.3;
const INDICATOR_SIZE = 6;
const INDICATOR_GAP = 6;

const SPRING_SNAP = { type: 'spring' as const, stiffness: 400, damping: 35, mass: 1 };

/* ── Styles ────────────────────────────────────────────── */

const wrapCSS: CSSProperties = {
  position: 'relative',
  inlineSize: '100%',
  overflow: 'hidden',
  touchAction: 'pan-y',
};

const trackBaseCSS: CSSProperties = {
  display: 'flex',
  willChange: 'transform',
};

const panelCSS: CSSProperties = {
  flexShrink: 0,
  inlineSize: '100%',
};

const indicatorBarCSS: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: INDICATOR_GAP,
  paddingBlock: 10,
};

/* ── Helpers ───────────────────────────────────────────── */

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function rubberBand(raw: number, boundary: number, factor: number): number {
  if (Math.abs(raw) <= Math.abs(boundary)) return raw;
  const over = raw - boundary;
  return boundary + over * factor;
}

/* ── Component ─────────────────────────────────────────── */

export function SwipePanel(props: SwipePanelProps) {
  const {
    children,
    activeIndex: controlledIndex,
    onIndexChange,
    snapVelocity = DEFAULT_SNAP_VELOCITY,
    rubberBandFactor = DEFAULT_RUBBER,
    showIndicator = true,
    gap = 0,
  } = props;

  const tokens = useThemeTokens();
  const count = Children.count(children);
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalIndex, setInternalIndex] = useState(0);
  const index = controlledIndex ?? internalIndex;
  const x = useMotionValue(0);

  const getWidth = useCallback((): number => {
    return containerRef.current?.offsetWidth ?? 0;
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const clamped = clamp(next, 0, count - 1);
      const w = getWidth();
      animate(x, -(clamped * (w + gap)), SPRING_SNAP);
      setInternalIndex(clamped);
      onIndexChange?.(clamped);
    },
    [count, gap, getWidth, onIndexChange, x],
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const w = getWidth();
      if (w === 0) return;
      const offset = info.offset.x;
      const velocity = info.velocity.x;
      let next = index;
      if (Math.abs(velocity) > snapVelocity) {
        next = velocity < 0 ? index + 1 : index - 1;
      } else if (Math.abs(offset) > w * 0.35) {
        next = offset < 0 ? index + 1 : index - 1;
      }
      goTo(next);
    },
    [getWidth, goTo, index, snapVelocity],
  );

  const handleDrag = useCallback(
    (_: unknown, info: PanInfo) => {
      const w = getWidth();
      if (w === 0) return;
      const base = -(index * (w + gap));
      const raw = base + info.offset.x;
      const minX = -((count - 1) * (w + gap));
      if (raw > 0) {
        x.set(raw * rubberBandFactor);
      } else if (raw < minX) {
        x.set(minX + (raw - minX) * rubberBandFactor);
      } else {
        x.set(raw);
      }
    },
    [count, gap, getWidth, index, rubberBandFactor, x],
  );

  const trackStyle: CSSProperties = useMemo(
    () => ({ ...trackBaseCSS, gap }),
    [gap],
  );

  // Merge motion value with track style — extracted to avoid inline double-brace
  const motionStyle = { ...trackStyle, x };

  const dotActiveCSS: CSSProperties = useMemo(
    () => ({
      inlineSize: INDICATOR_SIZE,
      blockSize: INDICATOR_SIZE,
      borderRadius: '50%',
      backgroundColor: tokens.accentPrimary,
      transition: `background-color ${DURATION.normal}ms ${EASING.easeInOut}`,
    }),
    [tokens.accentPrimary],
  );

  const dotInactiveCSS: CSSProperties = useMemo(
    () => ({
      inlineSize: INDICATOR_SIZE,
      blockSize: INDICATOR_SIZE,
      borderRadius: '50%',
      backgroundColor: tokens.border,
      transition: `background-color ${DURATION.normal}ms ${EASING.easeInOut}`,
    }),
    [tokens.border],
  );

  return (
    <div ref={containerRef} style={wrapCSS}>
      <motion.div
        style={motionStyle}
        drag="x"
        dragElastic={0}
        dragMomentum={false}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        {Children.map(children, (child, i) => (
          <div key={i} style={panelCSS}>
            {child}
          </div>
        ))}
      </motion.div>
      {showIndicator && count > 1 && (
        <div style={indicatorBarCSS}>
          {Array.from({ length: count }, (_, i) => (
            <div key={i} style={i === index ? dotActiveCSS : dotInactiveCSS} />
          ))}
        </div>
      )}
    </div>
  );
}
