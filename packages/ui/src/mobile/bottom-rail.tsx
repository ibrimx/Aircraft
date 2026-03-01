// P51
import { useCallback, useState, type CSSProperties, type ReactNode } from 'react';
import { useThemeTokens } from '@brimair/design-tokens';
import { Z_INDEX } from '@brimair/design-tokens';
import { MOBILE_TOUCH_TARGET, MOBILE_REDUCED_MOTION } from '@brimair/design-tokens';
import { BottomRailIndicator } from './bottom-rail-indicator';

export interface BottomRailItem {
  readonly id: string;
  readonly icon: ReactNode;
  readonly label: string;
}

export interface BottomRailProps {
  readonly items: BottomRailItem[];
  readonly activeId: string;
  readonly onSelect: (id: string) => void;
  readonly className?: string;
  readonly style?: CSSProperties;
}

const MAX_ITEMS = 5;

export function BottomRail({ items, activeId, onSelect, className, style }: BottomRailProps) {
  const tokens = useThemeTokens();
  const [pressed, setPressed] = useState<string | null>(null);
  const visibleItems = items.slice(0, MAX_ITEMS);
  const activeIndex = visibleItems.findIndex((it) => it.id === activeId);

  const handleSelect = useCallback(
    (id: string) => () => onSelect(id),
    [onSelect],
  );

  const railCSS: CSSProperties = {
    position: 'fixed',
    insetBlockEnd: 0,
    insetInline: 0,
    zIndex: Z_INDEX.nav,
    display: 'flex',
    flexDirection: 'column',
    background: tokens.color.surfaceNav,
    borderBlockStart: `1px solid ${tokens.color.borderSubtle}`,
    paddingBlockEnd: 'env(safe-area-inset-bottom)',
    ...style,
  };

  const rowCSS: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  };

  const noMotion = MOBILE_REDUCED_MOTION;

  return (
    <nav className={className} style={railCSS}>
      <BottomRailIndicator activeIndex={activeIndex} itemCount={visibleItems.length} />
      <div style={rowCSS}>
        {visibleItems.map((item) => {
          const isActive = item.id === activeId;
          const isPressed = pressed === item.id;
          const scale = isPressed && !noMotion ? 'scale(0.9)' : 'scale(1)';
          const itemCSS: CSSProperties = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            minBlockSize: MOBILE_TOUCH_TARGET,
            cursor: 'pointer',
            color: isActive ? tokens.color.accent : tokens.color.textSecondary,
            transform: scale,
            transition: noMotion ? 'none' : 'transform 0.12s ease-in-out',
          };
          const labelCSS: CSSProperties = {
            fontSize: 12,
            marginBlockStart: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          };
          return (
            <div
              key={item.id}
              style={itemCSS}
              onClick={handleSelect(item.id)}
              onPointerDown={() => setPressed(item.id)}
              onPointerUp={() => setPressed(null)}
              onPointerLeave={() => setPressed(null)}
              role="tab"
              aria-selected={isActive}
            >
              {item.icon}
              <span style={labelCSS}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
