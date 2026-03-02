// P54 — mobile-inspector-stepper.tsx
import { type CSSProperties, useRef, useCallback } from 'react';
import { useThemeTokens } from '@aircraft/design-tokens';
import { MOBILE_TOUCH_TARGET } from '@aircraft/design-tokens';

/* ── Types ─────────────────────────────────────────────── */

export type MobileInspectorStepperProps = {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  onChange: (value: number) => void;
};

/* ── Constants ─────────────────────────────────────────── */

const LONG_PRESS_DELAY = 400;
const REPEAT_INITIAL = 200;
const REPEAT_MIN = 50;
const ACCEL_FACTOR = 0.85;

/* ── Styles ────────────────────────────────────────────── */

const wrapCSS: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const btnCSS: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minInlineSize: MOBILE_TOUCH_TARGET.minSize,
  minBlockSize: MOBILE_TOUCH_TARGET.minSize,
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  fontSize: 18,
  fontWeight: 700,
  userSelect: 'none',
  touchAction: 'manipulation',
};

const valueCSS: CSSProperties = {
  minInlineSize: 40,
  textAlign: 'center',
  fontVariantNumeric: 'tabular-nums',
  fontSize: 14,
  fontWeight: 600,
};

/* ── Component ─────────────────────────────────────────── */

export function MobileInspectorStepper({
  value,
  min = -Infinity,
  max = Infinity,
  step = 1,
  label,
  onChange,
}: MobileInspectorStepperProps) {
  const tokens = useThemeTokens();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const stopRepeat = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearTimeout(intervalRef.current);
    timerRef.current = null;
    intervalRef.current = null;
  }, []);

  const startRepeat = useCallback(
    (delta: number) => {
      let delay = REPEAT_INITIAL;
      const tick = () => {
        onChange(clamp(value + delta));
        delay = Math.max(REPEAT_MIN, delay * ACCEL_FACTOR);
        intervalRef.current = setTimeout(tick, delay);
      };
      timerRef.current = setTimeout(tick, LONG_PRESS_DELAY);
    },
    [value, onChange, min, max],
  );

  const decBtnCSS: CSSProperties = {
    ...btnCSS,
    backgroundColor: tokens.surfaceSecondary,
    color: tokens.textPrimary,
  };
  const incBtnCSS: CSSProperties = {
    ...btnCSS,
    backgroundColor: tokens.accentPrimary,
    color: tokens.textOnAccent,
  };
  const valStyle: CSSProperties = { ...valueCSS, color: tokens.textPrimary };

  return (
    <div style={wrapCSS} role="group" aria-label={label ?? 'Stepper'}>
      <button
        type="button"
        style={decBtnCSS}
        aria-label="Decrease"
        onClick={() => onChange(clamp(value - step))}
        onPointerDown={() => startRepeat(-step)}
        onPointerUp={stopRepeat}
        onPointerLeave={stopRepeat}
      >
        −
      </button>
      <span style={valStyle}>{value}</span>
      <button
        type="button"
        style={incBtnCSS}
        aria-label="Increase"
        onClick={() => onChange(clamp(value + step))}
        onPointerDown={() => startRepeat(step)}
        onPointerUp={stopRepeat}
        onPointerLeave={stopRepeat}
      >
        +
      </button>
    </div>
  );
}
