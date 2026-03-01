// P53 — mobile-inspector.tsx
import { type ReactNode, type CSSProperties, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeTokens } from '@brimair/design-tokens';
import { EASING, DURATION } from '@brimair/design-tokens';
import { BottomSheet } from '@brimair/ui';

/* ── Types ─────────────────────────────────────────────── */

export type InspectorSection = {
  id: string;
  title: string;
  content: ReactNode;
  defaultOpen?: boolean;
};

export type MobileInspectorProps = {
  open: boolean;
  onClose: () => void;
  sections: InspectorSection[];
  tabsSlot?: ReactNode;
  emptyState?: ReactNode;
  snapPoints?: number[];
};

/* ── Styles ────────────────────────────────────────────── */

const sectionHeaderCSS: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBlock: 12,
  paddingInline: 16,
  cursor: 'pointer',
  userSelect: 'none',
};

const sectionContentCSS: CSSProperties = {
  paddingInline: 16,
  paddingBlockEnd: 12,
  overflow: 'hidden',
};

const emptyWrapCSS: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingBlock: 48,
  paddingInline: 16,
  textAlign: 'center',
};

const dividerCSS: CSSProperties = {
  blockSize: 1,
  inlineSize: '100%',
  border: 'none',
  marginBlock: 0,
};

/* ── Collapse Animation ────────────────────────────────── */

const collapseVariants = {
  open: { height: 'auto', opacity: 1, transition: { duration: DURATION.normal, ease: EASING.easeInOut } },
  closed: { height: 0, opacity: 0, transition: { duration: DURATION.fast, ease: EASING.easeInOut } },
};

/* ── Component ─────────────────────────────────────────── */

export function MobileInspector({
  open,
  onClose,
  sections,
  tabsSlot,
  emptyState,
  snapPoints = [0.5, 0.92],
}: MobileInspectorProps) {
  const tokens = useThemeTokens();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const s of sections) {
      map[s.id] = !(s.defaultOpen ?? true);
    }
    return map;
  });

  const toggle = useCallback((id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const headerBg: CSSProperties = { ...sectionHeaderCSS, color: tokens.textPrimary };
  const dividerBg: CSSProperties = { ...dividerCSS, backgroundColor: tokens.border };
  const isEmpty = sections.length === 0;

  return (
    <BottomSheet open={open} onClose={onClose} snapPoints={snapPoints}>
      {tabsSlot}
      {isEmpty ? (
        <div style={emptyWrapCSS}>{emptyState ?? 'No properties selected.'}</div>
      ) : (
        sections.map((section, idx) => (
          <div key={section.id}>
            {idx > 0 && <hr style={dividerBg} />}
            <div role="button" tabIndex={0} style={headerBg} onClick={() => toggle(section.id)}>
              <span>{section.title}</span>
              <span>{collapsed[section.id] ? '▸' : '▾'}</span>
            </div>
            <AnimatePresence initial={false}>
              {!collapsed[section.id] && (
                <motion.div key="content" variants={collapseVariants} initial="closed" animate="open" exit="closed" style={sectionContentCSS}>
                  {section.content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))
      )}
    </BottomSheet>
  );
}
