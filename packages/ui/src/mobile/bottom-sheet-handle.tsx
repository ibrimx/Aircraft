// P49
import { type CSSProperties } from 'react';
import { useThemeTokens } from '@aircraft/design-tokens';
import { MOBILE_TOUCH_TARGET } from '@aircraft/design-tokens';

export interface BottomSheetHandleProps {
  readonly className?: string;
  readonly style?: CSSProperties;
}

export function BottomSheetHandle({ className, style }: BottomSheetHandleProps) {
  const tokens = useThemeTokens();

  const containerCSS: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    inlineSize: '100%',
    minBlockSize: MOBILE_TOUCH_TARGET,
    cursor: 'grab',
    ...style,
  };

  const pillCSS: CSSProperties = {
    inlineSize: 32,
    blockSize: 4,
    borderRadius: 9999,
    background: tokens.color.borderStrong,
    transition: 'opacity 0.12s ease-out',
  };

  return (
    <div className={className} style={containerCSS}>
      <div style={pillCSS} />
    </div>
  );
}
