// P55 — mobile-layers.tsx
import { type ReactNode, type CSSProperties } from 'react';
import { useThemeTokens } from '@aircraft/design-tokens';
import { Z_INDEX } from '@aircraft/design-tokens';
import { BottomSheet } from '@aircraft/ui';

/* ── Types ─────────────────────────────────────────────── */

export type LayerItem = {
  id: string;
  name: string;
  depth: number;
  visible: boolean;
  locked: boolean;
  icon?: ReactNode;
};

export type MobileLayersProps = {
  open: boolean;
  onClose: () => void;
  layers: LayerItem[];
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onSelect?: (id: string) => void;
  selectedId?: string;
  swipeSlot?: (layer: LayerItem) => ReactNode;
  reorderSlot?: ReactNode;
  snapPoints?: number[];
};

/* ── Constants ─────────────────────────────────────────── */

const ROW_HEIGHT = 48;
const DEPTH_INDENT = 16;
const MAX_INDENT = 80;

/* ── Styles ────────────────────────────────────────────── */

const listCSS: CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

const rowCSS: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  blockSize: ROW_HEIGHT,
  paddingInlineEnd: 12,
  gap: 8,
  cursor: 'pointer',
  userSelect: 'none',
};

const nameCSS: CSSProperties = {
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: 14,
};

const toggleBtnCSS: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 6,
  fontSize: 16,
  opacity: 0.7,
};

const emptyCSS: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingBlock: 48,
  fontSize: 14,
};

/* ── Component ─────────────────────────────────────────── */

export function MobileLayers({
  open,
  onClose,
  layers,
  onToggleVisibility,
  onToggleLock,
  onSelect,
  selectedId,
  swipeSlot,
  reorderSlot,
  snapPoints = [0.5, 0.92],
}: MobileLayersProps) {
  const tokens = useThemeTokens();

  if (layers.length === 0) {
    return (
      <BottomSheet open={open} onClose={onClose} snapPoints={snapPoints}>
        <div style={emptyCSS}>No layers</div>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet open={open} onClose={onClose} snapPoints={snapPoints}>
      {reorderSlot}
      <ul style={listCSS}>
        {layers.map((layer) => {
          const indent = Math.min(layer.depth * DEPTH_INDENT, MAX_INDENT);
          const isSelected = layer.id === selectedId;
          const itemCSS: CSSProperties = {
            ...rowCSS,
            paddingInlineStart: 12 + indent,
            backgroundColor: isSelected ? tokens.surfaceSecondary : 'transparent',
          };
          const nameStyle: CSSProperties = { ...nameCSS, color: tokens.textPrimary };
          const visIcon = layer.visible ? '👁' : '👁‍🗨';
          const lockIcon = layer.locked ? '🔒' : '🔓';

          return (
            <li key={layer.id}>
              {swipeSlot?.(layer)}
              <div style={itemCSS} role="button" tabIndex={0} onClick={() => onSelect?.(layer.id)}>
                {layer.icon && <span>{layer.icon}</span>}
                <span style={nameStyle}>{layer.name}</span>
                <button type="button" style={toggleBtnCSS} aria-label="Toggle visibility" onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id); }}>
                  {visIcon}
                </button>
                <button type="button" style={toggleBtnCSS} aria-label="Toggle lock" onClick={(e) => { e.stopPropagation(); onToggleLock(layer.id); }}>
                  {lockIcon}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </BottomSheet>
  );
}
