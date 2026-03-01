// P59 — mobile-font-picker-search.tsx
import { type CSSProperties, useCallback } from 'react';
import { useThemeTokens } from '@brimair/design-tokens';

/* ── Types ─────────────────────────────────────────────── */

export type MobileFontPickerSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

/* ── Styles ────────────────────────────────────────────── */

const wrapCSS: CSSProperties = {
  paddingInline: 16,
  paddingBlock: 8,
};

const inputCSS: CSSProperties = {
  inlineSize: '100%',
  paddingBlock: 10,
  paddingInline: 14,
  borderRadius: 10,
  border: '1px solid',
  fontSize: 14,
  outline: 'none',
};

/* ── Component ─────────────────────────────────────────── */

export function MobileFontPickerSearch({ value, onChange, placeholder = 'Search fonts…' }: MobileFontPickerSearchProps) {
  const tokens = useThemeTokens();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange],
  );

  const fieldCSS: CSSProperties = {
    ...inputCSS,
    borderColor: tokens.border,
    backgroundColor: tokens.surfacePrimary,
    color: tokens.textPrimary,
  };

  return (
    <div style={wrapCSS}>
      <input type="text" value={value} onChange={handleChange} placeholder={placeholder} style={fieldCSS} />
    </div>
  );
}
