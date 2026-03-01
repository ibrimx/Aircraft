// P59 — mobile-font-picker.tsx
import { type ReactNode, type CSSProperties, useState, useCallback, useMemo, useRef } from 'react';
import { useThemeTokens } from '@aircraft/design-tokens';
import { EASING, DURATION } from '@aircraft/design-tokens';
import { BottomSheet } from '@aircraft/ui';

/* ── Types ─────────────────────────────────────────────── */

type FontCategory = 'recent' | 'system' | 'google';

export type FontEntry = {
  family: string;
  category: FontCategory;
  loaded?: boolean;
};

export type MobileFontPickerProps = {
  open: boolean;
  onClose: () => void;
  fonts: FontEntry[];
  selected: string;
  onSelect: (family: string) => void;
  searchSlot?: ReactNode;
  onLoadMore?: () => void;
  snapPoints?: number[];
};

/* ── Constants ─────────────────────────────────────────── */

const ROW_HEIGHT = 48;
const CATEGORIES: FontCategory[] = ['recent', 'system', 'google'];
const CATEGORY_LABELS: Record<FontCategory, string> = { recent: 'Recent', system: 'System', google: 'Google' };

/* ── Styles ────────────────────────────────────────────── */

const catBarCSS: CSSProperties = {
  display: 'flex',
  gap: 8,
  paddingInline: 16,
  paddingBlock: 8,
};

const catBtnCSS: CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 13,
  paddingBlock: 6,
  paddingInline: 12,
  borderRadius: 8,
};

const listCSS: CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  overflowY: 'auto',
  maxBlockSize: 400,
};

const rowCSS: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  blockSize: ROW_HEIGHT,
  paddingInline: 16,
  cursor: 'pointer',
  userSelect: 'none',
  fontSize: 15,
};

const checkCSS: CSSProperties = {
  marginInlineStart: 'auto',
  fontSize: 16,
};

/* ── Component ─────────────────────────────────────────── */

export function MobileFontPicker({
  open,
  onClose,
  fonts,
  selected,
  onSelect,
  searchSlot,
  onLoadMore,
  snapPoints = [0.9],
}: MobileFontPickerProps) {
  const tokens = useThemeTokens();
  const [category, setCategory] = useState<FontCategory>('recent');
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(
    () => fonts.filter((f) => f.category === category),
    [fonts, category],
  );

  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el || !onLoadMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 60) {
      onLoadMore();
    }
  }, [onLoadMore]);

  return (
    <BottomSheet open={open} onClose={onClose} snapPoints={snapPoints}>
      {searchSlot}
      <div style={catBarCSS}>
        {CATEGORIES.map((c) => {
          const isActive = c === category;
          const btnStyle: CSSProperties = {
            ...catBtnCSS,
            color: isActive ? tokens.accentPrimary : tokens.textSecondary,
            backgroundColor: isActive ? tokens.surfaceSecondary : 'transparent',
          };
          return <button key={c} type="button" style={btnStyle} onClick={() => setCategory(c)}>{CATEGORY_LABELS[c]}</button>;
        })}
      </div>
      <ul ref={listRef} style={listCSS} onScroll={handleScroll}>
        {filtered.map((font) => {
          const isSelected = font.family === selected;
          const itemCSS: CSSProperties = {
            ...rowCSS,
            fontFamily: font.loaded !== false ? font.family : 'inherit',
            color: tokens.textPrimary,
            backgroundColor: isSelected ? tokens.surfaceSecondary : 'transparent',
          };
          return (
            <li key={font.family} style={itemCSS} role="button" tabIndex={0} onClick={() => onSelect(font.family)}>
              {font.family}
              {isSelected && <span style={checkCSS}>✓</span>}
            </li>
          );
        })}
      </ul>
    </BottomSheet>
  );
}
