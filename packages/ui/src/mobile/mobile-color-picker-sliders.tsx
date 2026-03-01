// P58 — mobile-color-picker-sliders.tsx
import { type CSSProperties, useState, useCallback, useMemo } from 'react';
import { useThemeTokens } from '@aircraft/design-tokens';

/* ── Types ─────────────────────────────────────────────── */

type SliderMode = 'hsl' | 'rgb';

export type ColorChannels = {
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  l: number;
  a: number;
};

export type MobileColorPickerSlidersProps = {
  channels: ColorChannels;
  onChange: (channels: ColorChannels) => void;
};

/* ── Styles ────────────────────────────────────────────── */

const wrapCSS: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  paddingInline: 16,
  paddingBlock: 12,
};

const modeToggleCSS: CSSProperties = {
  display: 'flex',
  gap: 8,
  justifyContent: 'center',
  paddingBlockEnd: 4,
};

const modeTabCSS: CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 12,
  paddingBlock: 4,
  paddingInline: 10,
  borderRadius: 6,
  textTransform: 'uppercase',
};

const rowCSS: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

const labelCSS: CSSProperties = {
  inlineSize: 14,
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
};

const sliderCSS: CSSProperties = {
  flex: 1,
  blockSize: 28,
  borderRadius: 14,
  appearance: 'none',
  outline: 'none',
  cursor: 'pointer',
};

const valCSS: CSSProperties = {
  inlineSize: 36,
  textAlign: 'end',
  fontSize: 12,
  fontVariantNumeric: 'tabular-nums',
};

/* ── Helpers ───────────────────────────────────────────── */

function hslGradient(ch: ColorChannels, channel: 'h' | 's' | 'l'): string {
  const stops = 8;
  const parts: string[] = [];
  for (let i = 0; i <= stops; i++) {
    const pct = i / stops;
    if (channel === 'h') parts.push(`hsl(${pct * 360}, ${ch.s}%, ${ch.l}%)`);
    else if (channel === 's') parts.push(`hsl(${ch.h}, ${pct * 100}%, ${ch.l}%)`);
    else parts.push(`hsl(${ch.h}, ${ch.s}%, ${pct * 100}%)`);
  }
  return `linear-gradient(to right, ${parts.join(', ')})`;
}

function rgbGradient(ch: ColorChannels, channel: 'r' | 'g' | 'b'): string {
  const low = channel === 'r' ? `rgb(0,${ch.g},${ch.b})` : channel === 'g' ? `rgb(${ch.r},0,${ch.b})` : `rgb(${ch.r},${ch.g},0)`;
  const high = channel === 'r' ? `rgb(255,${ch.g},${ch.b})` : channel === 'g' ? `rgb(${ch.r},255,${ch.b})` : `rgb(${ch.r},${ch.g},255)`;
  return `linear-gradient(to right, ${low}, ${high})`;
}

function alphaGradient(ch: ColorChannels): string {
  return `linear-gradient(to right, rgba(${ch.r},${ch.g},${ch.b},0), rgb(${ch.r},${ch.g},${ch.b}))`;
}

/* ── Component ─────────────────────────────────────────── */

export function MobileColorPickerSliders({ channels, onChange }: MobileColorPickerSlidersProps) {
  const tokens = useThemeTokens();
  const [mode, setMode] = useState<SliderMode>('hsl');

  const update = useCallback(
    (key: keyof ColorChannels, val: number) => onChange({ ...channels, [key]: val }),
    [channels, onChange],
  );

  type SliderDef = { key: keyof ColorChannels; label: string; min: number; max: number; gradient: string };

  const hslSliders: SliderDef[] = useMemo(() => [
    { key: 'h', label: 'H', min: 0, max: 360, gradient: hslGradient(channels, 'h') },
    { key: 's', label: 'S', min: 0, max: 100, gradient: hslGradient(channels, 's') },
    { key: 'l', label: 'L', min: 0, max: 100, gradient: hslGradient(channels, 'l') },
  ], [channels]);

  const rgbSliders: SliderDef[] = useMemo(() => [
    { key: 'r', label: 'R', min: 0, max: 255, gradient: rgbGradient(channels, 'r') },
    { key: 'g', label: 'G', min: 0, max: 255, gradient: rgbGradient(channels, 'g') },
    { key: 'b', label: 'B', min: 0, max: 255, gradient: rgbGradient(channels, 'b') },
  ], [channels]);

  const alphaSlider: SliderDef = useMemo(() => ({
    key: 'a', label: 'A', min: 0, max: 100, gradient: alphaGradient(channels),
  }), [channels]);

  const sliders = mode === 'hsl' ? hslSliders : rgbSliders;
  const allSliders = [...sliders, alphaSlider];

  return (
    <div style={wrapCSS}>
      <div style={modeToggleCSS}>
        {(['hsl', 'rgb'] as SliderMode[]).map((m) => {
          const tabStyle: CSSProperties = {
            ...modeTabCSS,
            color: m === mode ? tokens.accentPrimary : tokens.textSecondary,
            backgroundColor: m === mode ? tokens.surfaceSecondary : 'transparent',
          };
          return <button key={m} type="button" style={tabStyle} onClick={() => setMode(m)}>{m}</button>;
        })}
      </div>
      {allSliders.map((sl) => {
        const trackCSS: CSSProperties = { ...sliderCSS, background: sl.gradient };
        const lblStyle: CSSProperties = { ...labelCSS, color: tokens.textSecondary };
        const vStyle: CSSProperties = { ...valCSS, color: tokens.textPrimary };
        return (
          <div key={sl.key} style={rowCSS}>
            <span style={lblStyle}>{sl.label}</span>
            <input
              type="range"
              min={sl.min}
              max={sl.max}
              value={channels[sl.key]}
              onChange={(e) => update(sl.key, Number(e.target.value))}
              style={trackCSS}
            />
            <span style={vStyle}>{Math.round(channels[sl.key])}</span>
          </div>
        );
      })}
    </div>
  );
}
