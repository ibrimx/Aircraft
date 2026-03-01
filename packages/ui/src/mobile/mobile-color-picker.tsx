// P57 — mobile-color-picker.tsx
import { type ReactNode, type CSSProperties, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeTokens } from '@brimair/design-tokens';
import { EASING, DURATION } from '@brimair/design-tokens';
import { BottomSheet } from '@brimair/ui';

/* ── Types ─────────────────────────────────────────────── */

type ColorMode = 'swatches' | 'spectrum' | 'sliders';

export type SwatchColor = {
  id: string;
  hex: string;
  label?: string;
};

export type MobileColorPickerProps = {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (color: string) => void;
  swatches?: SwatchColor[];
  slidersSlot?: ReactNode;
  snapPoints?: number[];
};

/* ── Constants ─────────────────────────────────────────── */

const SWATCH_COLS = 6;
const SWATCH_SIZE = 40;
const SWATCH_GAP = 10;
const CROSSHAIR_SIZE = 20;

/* ── Styles ────────────────────────────────────────────── */

const modeBarCSS: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: 12,
  paddingBlock: 12,
  paddingInline: 16,
};

const modeBtnCSS: CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 13,
  paddingBlock: 6,
  paddingInline: 12,
  borderRadius: 8,
};

const gridCSS: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `repeat(${SWATCH_COLS}, ${SWATCH_SIZE}px)`,
  gap: SWATCH_GAP,
  justifyContent: 'center',
  paddingBlock: 16,
  paddingInline: 16,
};

const swatchCSS: CSSProperties = {
  inlineSize: SWATCH_SIZE,
  blockSize: SWATCH_SIZE,
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
};

const spectrumWrapCSS: CSSProperties = {
  position: 'relative',
  marginInline: 16,
  marginBlock: 16,
  blockSize: 200,
  borderRadius: 12,
  overflow: 'hidden',
  touchAction: 'none',
};

const crosshairCSS: CSSProperties = {
  position: 'absolute',
  inlineSize: CROSSHAIR_SIZE,
  blockSize: CROSSHAIR_SIZE,
  borderRadius: '50%',
  border: '2px solid white',
  boxShadow: '0 0 4px rgba(0,0,0,0.3)',
  pointerEvents: 'none',
  transform: 'translate(-50%, -50%)',
};

const inputRowCSS: CSSProperties = {
  display: 'flex',
  gap: 8,
  paddingInline: 16,
  paddingBlock: 12,
  alignItems: 'center',
};

const hexInputCSS: CSSProperties = {
  flex: 1,
  paddingBlock: 8,
  paddingInline: 12,
  borderRadius: 8,
  border: '1px solid',
  fontSize: 14,
  fontFamily: 'monospace',
};

const previewCSS: CSSProperties = {
  inlineSize: 36,
  blockSize: 36,
  borderRadius: 8,
  flexShrink: 0,
};

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.fast, ease: EASING.easeInOut } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASING.easeInOut } },
};

/* ── Component ─────────────────────────────────────────── */

export function MobileColorPicker({
  open,
  onClose,
  value,
  onChange,
  swatches = [],
  slidersSlot,
  snapPoints = [0.9],
}: MobileColorPickerProps) {
  const tokens = useThemeTokens();
  const [mode, setMode] = useState<ColorMode>('swatches');

  const handleHexInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value.replace(/[^0-9a-fA-F#]/g, '').slice(0, 7);
      onChange(v.startsWith('#') ? v : `#${v}`);
    },
    [onChange],
  );

  const previewStyle: CSSProperties = useMemo(
    () => ({ ...previewCSS, backgroundColor: value }),
    [value],
  );

  const inputBorder: CSSProperties = useMemo(
    () => ({ ...hexInputCSS, borderColor: tokens.border, color: tokens.textPrimary, backgroundColor: tokens.surfacePrimary }),
    [tokens],
  );

  const MODES: ColorMode[] = ['swatches', 'spectrum', 'sliders'];

  return (
    <BottomSheet open={open} onClose={onClose} snapPoints={snapPoints}>
      <div style={modeBarCSS}>
        {MODES.map((m) => {
          const isActive = m === mode;
          const btnStyle: CSSProperties = {
            ...modeBtnCSS,
            color: isActive ? tokens.accentPrimary : tokens.textSecondary,
            backgroundColor: isActive ? tokens.surfaceSecondary : 'transparent',
          };
          return (
            <button key={m} type="button" style={btnStyle} onClick={() => setMode(m)}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'swatches' && (
          <motion.div key="swatches" variants={fadeVariants} initial="initial" animate="animate" exit="exit" style={gridCSS}>
            {swatches.map((s) => {
              const sStyle: CSSProperties = { ...swatchCSS, backgroundColor: s.hex };
              return <button key={s.id} type="button" style={sStyle} aria-label={s.label ?? s.hex} onClick={() => onChange(s.hex)} />;
            })}
          </motion.div>
        )}
        {mode === 'spectrum' && (
          <motion.div key="spectrum" variants={fadeVariants} initial="initial" animate="animate" exit="exit">
            <div style={spectrumWrapCSS}>
              <div style={crosshairCSS} />
            </div>
          </motion.div>
        )}
        {mode === 'sliders' && (
          <motion.div key="sliders" variants={fadeVariants} initial="initial" animate="animate" exit="exit">
            {slidersSlot}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={inputRowCSS}>
        <div style={previewStyle} />
        <input type="text" value={value} onChange={handleHexInput} style={inputBorder} placeholder="#000000" />
      </div>
    </BottomSheet>
  );
}
