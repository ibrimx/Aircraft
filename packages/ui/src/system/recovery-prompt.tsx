// packages/ui/src/system/recovery-prompt.tsx
import { type CSSProperties } from 'react';
import { useThemeTokens } from '@aircraft/design-tokens';
import { SPACING } from '@aircraft/design-tokens';
import { TEXT_STYLES } from '@aircraft/design-tokens';
import { cssTransition } from '@aircraft/design-tokens';
import { Button } from '../primitives/button';
import { Surface } from '../primitives/surface';

export type RecoveryPromptAction = {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick: () => void;
  loading?: boolean;
};

export type RecoveryPromptProps = {
  title: string;
  description?: string;
  actions: RecoveryPromptAction[];
  icon?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function RecoveryPrompt({
  title,
  description,
  actions,
  icon,
  className,
  style,
}: RecoveryPromptProps) {
  const tokens = useThemeTokens();
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
  const visibleActions = actions.slice(0, 3);

  if (process.env.NODE_ENV !== 'production' && actions.length > 3) {
    console.warn('[RecoveryPrompt] Max 3 actions allowed; extras truncated.');
  }

  const cardStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: SPACING[3],
    textAlign: 'center',
    transition: prefersReduced ? 'none' : cssTransition('opacity, transform', 'normal', 'easeOut'),
    ...style,
  };

  return (
    <Surface variant="raised" padding="lg" radius="lg" className={className} style={cardStyle}>
      {icon && <span style={{ fontSize: 32 }}>{icon}</span>}
      <span style={{ ...TEXT_STYLES.heading }}>{title}</span>
      {description && (
        <span style={{ ...TEXT_STYLES.body, color: tokens.colors.text.secondary }}>{description}</span>
      )}
      {visibleActions.length > 0 && (
        <div style={{ display: 'flex', gap: SPACING[2], flexWrap: 'wrap', justifyContent: 'center' }}>
          {visibleActions.map((act, i) => (
            <Button key={i} variant={act.variant ?? 'primary'} onClick={act.onClick} loading={act.loading}>
              {act.label}
            </Button>
          ))}
        </div>
      )}
    </Surface>
  );
}
