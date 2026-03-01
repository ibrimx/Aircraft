// P54 — mobile-inspector-tabs.tsx
import { type ReactNode, type CSSProperties, useState, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeTokens } from '@brimair/design-tokens';
import { SPRING_PRESETS } from '@brimair/ui';

/* ── Types ─────────────────────────────────────────────── */

export type InspectorTab = {
  id: string;
  label: string;
  content: ReactNode;
};

export type MobileInspectorTabsProps = {
  tabs: InspectorTab[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
};

/* ── Styles ────────────────────────────────────────────── */

const tabBarCSS: CSSProperties = {
  display: 'flex',
  position: 'relative',
  paddingInline: 16,
  gap: 8,
};

const tabBtnCSS: CSSProperties = {
  paddingBlock: 10,
  paddingInline: 12,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 14,
  whiteSpace: 'nowrap',
};

const underlineCSS: CSSProperties = {
  position: 'absolute',
  insetBlockEnd: 0,
  blockSize: 2,
  borderRadius: 1,
};

const panelCSS: CSSProperties = {
  paddingBlockStart: 8,
};

/* ── Component ─────────────────────────────────────────── */

export function MobileInspectorTabs({ tabs, activeTab, onTabChange }: MobileInspectorTabsProps) {
  const tokens = useThemeTokens();
  const [current, setCurrent] = useState(activeTab ?? tabs[0]?.id ?? '');
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const selected = activeTab ?? current;

  useLayoutEffect(() => {
    const el = tabRefs.current.get(selected);
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [selected]);

  const handleSelect = (id: string) => {
    setCurrent(id);
    onTabChange?.(id);
  };

  const activeContent = tabs.find((t) => t.id === selected)?.content;

  return (
    <div>
      <div style={tabBarCSS}>
        {tabs.map((tab) => {
          const isActive = tab.id === selected;
          const btnStyle: CSSProperties = {
            ...tabBtnCSS,
            color: isActive ? tokens.accentPrimary : tokens.textSecondary,
          };
          return (
            <button
              key={tab.id}
              ref={(el) => { if (el) tabRefs.current.set(tab.id, el); }}
              type="button"
              style={btnStyle}
              onClick={() => handleSelect(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
        <motion.div
          style= ...underlineCSS, backgroundColor: tokens.accentPrimary 
          animate= left: indicator.left, width: indicator.width 
          transition={SPRING_PRESETS.bouncy}
        />
      </div>
      <div style={panelCSS}>{activeContent}</div>
    </div>
  );
}
