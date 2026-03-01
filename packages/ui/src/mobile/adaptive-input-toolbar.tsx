// P64 — adaptive-input-toolbar.tsx
import { type CSSProperties, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useThemeTokens } from '@aircraft/design-tokens';
import { Z_INDEX } from '@aircraft/design-tokens';
import type { ToolbarAction } from './adaptive-input';

/* ── Types ─────────────────────────────────────────────── */

export type AdaptiveInputToolbarProps = {
  actions: ToolbarAction[];
};

/* ── Animation ──────────────────────────────────────────── */

const SLIDE_INITIAL = { y: 48, opacity: 0 };
const SLIDE_ANIMATE = { y: 0, opacity: 1 };
const SLIDE_EXIT = { y: 48, opacity: 0 };
const SLIDE_TRANSITION = { type: 'spring' as const, stiffness: 400, damping: 30 };

/* ── Component ──────────────────────────────────────────── */

export function AdaptiveInputToolbar(props: AdaptiveInputToolbarProps) {
  const { actions } = props;
  const tokens = useThemeTokens();

  const barStyle: CSSProperties = useMemo(
    () => ({
      position: 'fixed' as const,
      bottom: 0,
      insetInlineStart: 0,
      insetInlineEnd: 0,
      zIndex: Z_INDEX.panel,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      paddingInline: 12,
      paddingBlock: 8,
      background: 'rgba(28,28,28,0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: `1px solid ${tokens.border}`,
    }),
    [tokens.border],
  );

  const btnStyle: CSSProperties = useMemo(
    () => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minInlineSize: 44,
      minBlockSize: 44,
      borderRadius: 8,
      color: tokens.textSecondary,
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      WebkitTapHighlightColor: 'transparent',
    }),
    [tokens.textSecondary],
  );

  return (
    <motion.div
      style={barStyle}
      initial={SLIDE_INITIAL}
      animate={SLIDE_ANIMATE}
      exit={SLIDE_EXIT}
      transition={SLIDE_TRANSITION}
    >
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          style={btnStyle}
          onClick={action.onPress}
          aria-label={action.label}
        >
          {action.icon}
        </button>
      ))}
    </motion.div>
  );
}
