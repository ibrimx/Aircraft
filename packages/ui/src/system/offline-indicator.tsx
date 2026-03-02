// packages/ui/src/system/offline-indicator.tsx
import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { useThemeTokens } from '@aircraft/design-tokens';
import { Z_INDEX } from '@aircraft/design-tokens';
import { SPACING } from '@aircraft/design-tokens';
import { cssTransition } from '@aircraft/design-tokens';
import { TEXT_STYLES } from '@aircraft/design-tokens';

export type OfflineIndicatorProps = {
  position?: 'top' | 'bottom';
  className?: string;
  style?: CSSProperties;
};

type Status = 'online' | 'offline' | 'restored';

export function OfflineIndicator({
  position = 'top',
  className,
  style,
}: OfflineIndicatorProps) {
  const tokens = useThemeTokens();
  const [status, setStatus] = useState<Status>('online');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = (online: boolean) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (online) {
          setStatus('restored');
          hideRef.current = setTimeout(() => setStatus('online'), 2000);
        } else {
          if (hideRef.current) clearTimeout(hideRef.current);
          setStatus('offline');
        }
      }, 500);
    };
    const onOnline = () => update(true);
    const onOffline = () => update(false);
    if (!navigator.onLine) setStatus('offline');
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (hideRef.current) clearTimeout(hideRef.current);
    };
  }, []);

  if (status === 'online') return null;

  const isOffline = status === 'offline';
  const bg = isOffline ? tokens.colors.warning.default : tokens.colors.success.default;
  const text = isOffline ? '\u0623\u0646\u062A \u063A\u064A\u0631 \u0645\u062A\u0635\u0644 \u0628\u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A' : '\u062A\u0645 \u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0627\u062A\u0635\u0627\u0644';
  const posKey = position === 'top' ? 'insetBlockStart' : 'insetBlockEnd';

  const containerStyle: CSSProperties = {
    position: 'fixed',
    [posKey]: 0,
    insetInline: 0,
    zIndex: Z_INDEX.toast,
    paddingBlock: SPACING[2],
    paddingInline: SPACING[4],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING[2],
    background: bg,
    color: tokens.colors.text.inverse,
    ...TEXT_STYLES.body,
    transition: prefersReduced ? 'none' : cssTransition('opacity, transform', 'normal', 'easeOut'),
    opacity: 1,
    transform: prefersReduced ? 'none' : 'translateY(0)',
    ...style,
  };

  return (
    <div className={className} style={containerStyle} role="status" aria-live="polite">
      <span>{isOffline ? '\u26A1' : '\u2713'}</span>
      <span>{text}</span>
    </div>
  );
}
