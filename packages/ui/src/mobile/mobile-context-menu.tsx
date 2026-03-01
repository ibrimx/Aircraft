// P60 — mobile-context-menu.tsx
import { type ReactNode, type CSSProperties, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeTokens } from '@brimair/design-tokens';
import { Z_INDEX } from '@brimair/design-tokens';
import { SPRING_PRESETS } from '@brimair/ui';
import { GlassPanel } from '@brimair/ui';

/* ── Types ─────────────────────────────────────────────── */

export type ContextMenuItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
};

export type ContextMenuOrigin = { x: number; y: number };

export type MobileContextMenuProps = {
  open: boolean;
  onClose: () => void;
  items: ContextMenuItem[];
  onSelect: (id: string) => void;
  origin: ContextMenuOrigin;
  hapticFeedback?: () => void;
};

/* ── Constants ─────────────────────────────────────────── */

const VIEWPORT_PADDING = 12;
const MENU_MIN_WIDTH = 200;

/* ── Styles ────────────────────────────────────────────── */

const overlayCSS: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: Z_INDEX.popover,
};

const menuCSS: CSSProperties = {
  position: 'absolute',
  minInlineSize: MENU_MIN_WIDTH,
  borderRadius: 14,
  overflow: 'hidden',
  paddingBlock: 6,
};

const itemCSS: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  paddingBlock: 12,
  paddingInline: 16,
  cursor: 'pointer',
  userSelect: 'none',
  border: 'none',
  background: 'none',
  inlineSize: '100%',
  fontSize: 15,
  textAlign: 'start',
};

const dividerCSS: CSSProperties = {
  blockSize: 1,
  marginBlock: 4,
  border: 'none',
};

/* ── Component ─────────────────────────────────────────── */

export function MobileContextMenu({
  open,
  onClose,
  items,
  onSelect,
  origin,
  hapticFeedback,
}: MobileContextMenuProps) {
  const tokens = useThemeTokens();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && hapticFeedback) hapticFeedback();
  }, [open, hapticFeedback]);

  useEffect(() => {
    if (!open || !menuRef.current) return;
    const el = menuRef.current;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (rect.right > vw - VIEWPORT_PADDING) {
      el.style.insetInlineStart = `${vw - rect.width - VIEWPORT_PADDING}px`;
    }
    if (rect.bottom > vh - VIEWPORT_PADDING) {
      el.style.insetBlockStart = `${vh - rect.height - VIEWPORT_PADDING}px`;
    }
  }, [open, origin]);

  const posStyle: CSSProperties = useMemo(
    () => ({ ...menuCSS, insetInlineStart: origin.x, insetBlockStart: origin.y }),
    [origin.x, origin.y],
  );

  const scaleOrigin = useMemo(
    () => ({ originX: 0, originY: 0 }),
    [],
  );

  return (
    <AnimatePresence>
      {open && (
        <div style={overlayCSS} onClick={onClose} role="presentation">
          <motion.div
            ref={menuRef}
            style={posStyle}
            initial={scaleOrigin}
            animate={scaleOrigin}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial= scale: 0.6, opacity: 0 
              animate= scale: 1, opacity: 1 
              exit= scale: 0.6, opacity: 0 
              transition={SPRING_PRESETS.bouncy}
              style= transformOrigin: 'top left' 
            >
              <GlassPanel>
                {items.map((item, idx) => {
                  const btnStyle: CSSProperties = {
                    ...itemCSS,
                    color: item.destructive ? tokens.errorText : tokens.textPrimary,
                    opacity: item.disabled ? 0.4 : 1,
                  };
                  return (
                    <div key={item.id}>
                      {idx > 0 && <hr style= ...dividerCSS, backgroundColor: tokens.border  />}
                      <button
                        type="button"
                        style={btnStyle}
                        disabled={item.disabled}
                        onClick={() => { onSelect(item.id); onClose(); }}
                      >
                        {item.icon && <span>{item.icon}</span>}
                        {item.label}
                      </button>
                    </div>
                  );
                })}
              </GlassPanel>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
