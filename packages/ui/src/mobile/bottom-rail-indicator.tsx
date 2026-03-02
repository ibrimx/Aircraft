// P51
import { type CSSProperties } from 'react';
import { useThemeTokens } from '@aircraft/design-tokens';
import { MOBILE_REDUCED_MOTION } from '@aircraft/design-tokens';

export interface BottomRailIndicatorProps {
  readonly activeIndex: number;
  readonly itemCount: number;
  readonly className?: string;
  readonly style?: CSSProperties;
}

export function BottomRailIndicator({
  activeIndex,
  itemCount,
  className,
  style,
}: BottomRailIndicatorProps) {
  const tokens = useThemeTokens();
  const noMotion = MOBILE_REDUCED_MOTION;

  if (itemCount <= 0) return null;

  const pct = (activeIndex / itemCount) * 100;
  const pillCSS: CSSProperties = {
    position: 'relative',
    blockSize: 3,
    inlineSize: `calc(100% / ${itemCount} - 16px)`,
    borderRadius: 9999,
    background: tokens.colors.accent.default,
    marginInline: 8,
    transform: `translateX(calc(${pct}% + ${activeIndex} * 100% / ${itemCount} * 0 + ${activeIndex * 16}px))`,
    insetInlineStart: `calc(${activeIndex} * 100% / ${itemCount})`,
    transition: noMotion
      ? 'none'
      : `inset-inline-start 0.35s cubic-bezier(0.12, 0.8, 0.32, 1)`,
    ...style,
  };

  return <div className={className} style={pillCSS} />;
}
