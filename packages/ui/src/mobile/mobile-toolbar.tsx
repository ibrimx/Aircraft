// P52
import { useCallback, useState, type CSSProperties, type ReactNode } from 'react';
import { useThemeTokens } from '@aircraft/design-tokens';
import { Z_INDEX } from '@aircraft/design-tokens';
import { MOBILE_REDUCED_MOTION } from '@aircraft/design-tokens';
import { GlassPanel } from '@aircraft/ui';

export interface ToolbarItem {
  readonly id: string;
  readonly icon: ReactNode;
  readonly label: string;
  readonly disabled?: boolean;
}

export interface ToolbarGroup {
  readonly id: string;
  readonly items: ToolbarItem[];
}

export interface MobileToolbarProps {
  readonly groups: ToolbarGroup[];
  readonly activeId?: string;
  readonly onSelect: (id: string) => void;
  readonly visible: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
}

const groupWrapCSS: CSSProperties = { display: 'contents' };

export function MobileToolbar({
  groups,
  activeId,
  onSelect,
  visible,
  className,
  style,
}: MobileToolbarProps) {
  const tokens = useThemeTokens();
  const noMotion = MOBILE_REDUCED_MOTION;
  const [pressedId, setPressedId] = useState<string | null>(null);

  const handleSelect = useCallback(
    (id: string) => () => onSelect(id),
    [onSelect],
  );

  const wrapCSS: CSSProperties = {
    position: 'fixed',
    insetBlockEnd: 'calc(56px + env(safe-area-inset-bottom) + 8px)',
    insetInline: 0,
    display: 'flex',
    justifyContent: 'center',
    zIndex: Z_INDEX.toolbar,
    pointerEvents: 'none',
  };

  const barCSS: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    maxInlineSize: '90vw',
    blockSize: 48,
    paddingInline: 8,
    borderRadius: tokens.radius.lg,
    overflowX: 'auto',
    pointerEvents: 'auto',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(12px)',
    transition: noMotion
      ? 'opacity 0.15s ease-out'
      : 'opacity 0.25s cubic-bezier(0.12,0.8,0.32,1), transform 0.3s cubic-bezier(0.12,0.8,0.32,1)',
    ...style,
  };

  const sepCSS: CSSProperties = {
    inlineSize: 1,
    blockSize: 24,
    background: tokens.colors.border.subtle,
    flexShrink: 0,
    marginInline: 4,
  };

  const nonEmpty = groups.filter((g) => g.items.length > 0);

  return (
    <div style={wrapCSS}>
      <GlassPanel radius="lg" className={className} style={barCSS}>
        {nonEmpty.map((group, gi) => (
          <div key={group.id} style={groupWrapCSS}>
            {gi > 0 && <div style={sepCSS} />}
            {group.items.map((item) => {
              const isActive = item.id === activeId;
              const isPressed = pressedId === item.id;
              const btnCSS: CSSProperties = {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                inlineSize: 40,
                blockSize: 40,
                borderRadius: tokens.radius.md,
                cursor: item.disabled ? 'default' : 'pointer',
                opacity: item.disabled ? 0.4 : 1,
                pointerEvents: item.disabled ? 'none' : 'auto',
                background: isActive ? tokens.colors.accent.subtle : 'transparent',
                color: isActive ? tokens.colors.accent.default : tokens.colors.text.primary,
                transform: isPressed && !noMotion ? 'scale(0.92)' : 'scale(1)',
                transition: noMotion ? 'none' : 'transform 0.1s ease-in-out',
                flexShrink: 0,
              };
              return (
                <button
                  key={item.id}
                  type="button"
                  style={btnCSS}
                  onClick={handleSelect(item.id)}
                  onPointerDown={() => setPressedId(item.id)}
                  onPointerUp={() => setPressedId(null)}
                  onPointerLeave={() => setPressedId(null)}
                  aria-label={item.label}
                  aria-pressed={isActive}
                  disabled={item.disabled}
                >
                  {item.icon}
                </button>
              );
            })}
          </div>
        ))}
      </GlassPanel>
    </div>
  );
}
