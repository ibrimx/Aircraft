// packages/ui/src/system/error-fallback.tsx
import { type CSSProperties } from 'react';
import type { AircraftError, RecoveryAction } from '@aircraft/shared-types';
import { useThemeTokens } from '@aircraft/design-tokens';
import { Z_INDEX } from '@aircraft/design-tokens';
import { SPACING } from '@aircraft/design-tokens';
import { SHADOWS } from '@aircraft/design-tokens';
import { TEXT_STYLES } from '@aircraft/design-tokens';
import { cssTransition, EASING } from '@aircraft/design-tokens';
import { Button } from '../primitives/button';
import { Surface } from '../primitives/surface';

export type ErrorFallbackProps = {
  error: AircraftError;
  onRetry?: () => void;
  onReset?: () => void;
  fullScreen?: boolean;
  className?: string;
  style?: CSSProperties;
};

const RECOVERY_MAP: Record<RecoveryAction, { label: string; action: string }> = {
  retry: { label: '\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629', action: 'retry' },
  reload: { label: '\u0625\u0639\u0627\u062F\u0629 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0635\u0641\u062D\u0629', action: 'reload' },
  login: { label: '\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644', action: 'login' },
  contact_support: { label: '\u062A\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u062F\u0639\u0645', action: 'contact_support' },
  dismiss: { label: '\u0625\u063A\u0644\u0627\u0642', action: 'dismiss' },
};

export function ErrorFallback({
  error,
  onRetry,
  onReset,
  fullScreen = false,
  className,
  style,
}: ErrorFallbackProps) {
  const tokens = useThemeTokens();
  const recovery = error.recovery ?? 'retry';
  const mapping = RECOVERY_MAP[recovery] ?? RECOVERY_MAP.retry;
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const handleAction = () => {
    switch (recovery) {
      case 'retry': onRetry?.(); break;
      case 'reload': window.location.reload(); break;
      case 'login': window.location.assign('/login'); break;
      case 'contact_support': window.location.assign('mailto:support@aircraft.app'); break;
      case 'dismiss': onReset?.(); break;
    }
  };

  const iconSize = fullScreen ? 64 : 32;
  const wrapperStyle: CSSProperties = fullScreen ? {
    position: 'fixed',
    inset: 0,
    zIndex: Z_INDEX.overlay,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: tokens.colors.bg.overlay,
    transition: prefersReduced ? 'none' : cssTransition(['opacity'], { easing: EASING.easeOut }),
  } : {};

  const cardStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: SPACING[3],
    paddingBlock: SPACING[5],
    paddingInline: SPACING[5],
    textAlign: 'center',
    maxInlineSize: 400,
    ...style,
  };

  return (
    <div className={className} style={wrapperStyle}>
      <Surface variant="raised" style={cardStyle}>
        <span style= fontSize: iconSize, lineHeight: 1 >\u26A0\uFE0F</span>
        <span style= ...TEXT_STYLES.subtitle, color: tokens.colors.text.primary >
          {error.message}
        </span>
        <span style= ...TEXT_STYLES.caption, color: tokens.colors.text.secondary >
          {error.code}
        </span>
        <Button variant="primary" onClick={handleAction}>{mapping.label}</Button>
        {onReset && recovery !== 'dismiss' && (
          <Button variant="ghost" onClick={onReset}>\u0625\u063A\u0644\u0627\u0642</Button>
        )}
      </Surface>
    </div>
  );
}
