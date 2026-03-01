import { type CSSProperties, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth, useI18n, CommandPalette, ErrorFallback, Workspace } from '@aircraft/ui';
import { useThemeTokens } from '@aircraft/design-tokens';
import { StudioLayout } from '../layouts/studio-layout';

const css = (s: CSSProperties): CSSProperties => s;

type DocState = 'loading' | 'ready' | 'error' | 'not-found';

export function StudioPage(): React.JSX.Element {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  const tk = useThemeTokens();
  const [docState, setDocState] = useState<DocState>('loading');
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => { if (!isAuthenticated) navigate('/login'); }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!projectId) { setDocState('not-found'); return; }
    /* placeholder: replace with real useDocument fetch */
    const timer = setTimeout(() => setDocState('ready'), 600);
    return () => clearTimeout(timer);
  }, [projectId]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(true); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!isAuthenticated) return <></>;

  if (docState === 'loading') return (
    <StudioLayout>
      <div style={css({ display: 'flex', alignItems: 'center', justifyContent: 'center', blockSize: '100%', background: tk.bg.canvas })} role="status" aria-label={t('studio.loading')}>
        <div style={css({ inlineSize: 200, blockSize: 16, borderRadius: 8, background: tk.bg.surface, animation: 'pulse 1.5s ease-in-out infinite' })} />
      </div>
    </StudioLayout>
  );

  if (docState === 'error') return <ErrorFallback message={t('studio.error')} onRetry={() => setDocState('loading')} />;
  if (docState === 'not-found') { navigate('/dashboard'); return <></>; }

  return (
    <StudioLayout>
      <div style={css({ display: 'flex', alignItems: 'center', justifyContent: 'center', blockSize: '100%', background: tk.bg.canvas })}>
        <Workspace projectId={projectId!} />
      </div>
      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}
    </StudioLayout>
  );
}
