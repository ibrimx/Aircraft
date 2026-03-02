import { type CSSProperties, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth, useI18n, ErrorFallback } from '@aircraft/ui';
import { useThemeTokens } from '@aircraft/design-tokens';
import type { AircraftError } from '@aircraft/shared-types';

import { CommandPalette } from '../shell/command-palette';
import { StudioLayout } from '../layouts/studio-layout';

const css = (s: CSSProperties): CSSProperties => s;

type DocState = 'loading' | 'ready' | 'error' | 'not-found';

export function StudioPage(): React.JSX.Element {
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId;
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  const tk = useThemeTokens();
  const [docState, setDocState] = useState<DocState>('loading');
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!projectId) {
      setDocState('not-found');
      return;
    }
    const timer = setTimeout(() => setDocState('ready'), 600);
    return () => clearTimeout(timer);
  }, [projectId]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!isAuthenticated) return <></>;

  if (docState === 'loading')
    return (
      <StudioLayout>
        <div
          style={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            blockSize: '100%',
            background: tk.colors.background.primary,
          })}
          role="status"
          aria-label={t('studio.loading')}
        >
          <div
            style={css({
              inlineSize: 200,
              blockSize: 16,
              borderRadius: 8,
              background: tk.colors.surface.default,
              animation: 'pulse 1.5s ease-in-out infinite',
            })}
          />
        </div>
      </StudioLayout>
    );

  if (docState === 'error') {
    const error: AircraftError = {
      code: 'studio/load-failed',
      category: 'system',
      severity: 'recoverable',
      message: t('studio.error'),
      userMessage: null,
      context: {},
      timestamp: new Date().toISOString() as AircraftError['timestamp'],
      recoveryAction: 'retry',
    };

    return <ErrorFallback error={error} onRetry={() => setDocState('loading')} />;
  }

  if (docState === 'not-found') {
    router.push('/dashboard');
    return <></>;
  }

  return (
    <StudioLayout>
      <div
        style={css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          blockSize: '100%',
          background: tk.colors.background.primary,
          color: tk.colors.text.primary,
        })}
      >
        {t('studio.placeholder')}
      </div>
      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}
    </StudioLayout>
  );
}

export default StudioPage;
