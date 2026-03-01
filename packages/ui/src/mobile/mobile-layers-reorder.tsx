// P56 — mobile-layers-reorder.tsx
import { type ReactNode, type CSSProperties, useCallback, useRef, useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useThemeTokens } from '@aircraft/design-tokens';
import { SPRING_PRESETS } from '@aircraft/ui';
import { Z_INDEX } from '@aircraft/design-tokens';

/* ── Types ─────────────────────────────────────────────── */

export type ReorderItem = {
  id: string;
  content: ReactNode;
};

export type MobileLayersReorderProps = {
  items: ReorderItem[];
  onReorder: (ids: string[]) => void;
  longPressDelay?: number;
};

/* ── Constants ─────────────────────────────────────────── */

const LONG_PRESS_MS = 400;

/* ── Styles ────────────────────────────────────────────── */

const listCSS: CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

const itemBaseCSS: CSSProperties = {
  cursor: 'grab',
  userSelect: 'none',
  touchAction: 'none',
  borderRadius: 8,
};

/* ── Component ─────────────────────────────────────────── */

export function MobileLayersReorder({
  items,
  onReorder,
  longPressDelay = LONG_PRESS_MS,
}: MobileLayersReorderProps) {
  const tokens = useThemeTokens();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [order, setOrder] = useState(items.map((i) => i.id));

  const handleReorder = useCallback(
    (newOrder: string[]) => {
      setOrder(newOrder);
      onReorder(newOrder);
    },
    [onReorder],
  );

  const startLongPress = useCallback(
    (id: string) => {
      timerRef.current = setTimeout(() => setDraggingId(id), longPressDelay);
    },
    [longPressDelay],
  );

  const cancelLongPress = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setDraggingId(null);
  }, []);

  const draggingCSS: CSSProperties = {
    ...itemBaseCSS,
    transform: 'scale(1.02)',
    boxShadow: tokens.shadowElevated,
    zIndex: Z_INDEX.popover,
    backgroundColor: tokens.surfaceSecondary,
  };

  const idleCSS: CSSProperties = {
    ...itemBaseCSS,
    backgroundColor: 'transparent',
  };

  return (
    <Reorder.Group axis="y" values={order} onReorder={handleReorder} style={listCSS}>
      {order.map((id) => {
        const item = items.find((i) => i.id === id);
        if (!item) return null;
        const isDragging = draggingId === id;
        return (
          <Reorder.Item
            key={id}
            value={id}
            style={isDragging ? draggingCSS : idleCSS}
            layout
            transition={SPRING_PRESETS.gentle}
            onPointerDown={() => startLongPress(id)}
            onPointerUp={cancelLongPress}
            onPointerLeave={cancelLongPress}
          >
            {item.content}
          </Reorder.Item>
        );
      })}
    </Reorder.Group>
  );
}
