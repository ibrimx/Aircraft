import { type CSSProperties, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth, useI18n, useBreakpoint, ErrorFallback, Button } from '@aircraft/ui';
import { useThemeTokens } from '@aircraft/design-tokens';

import { CommandPalette } from '../shell/command-palette';
import { BuilderLayout } from '../layouts/builder-layout';

const css = (s: CSSProperties): CSSProperties => s;
type Preview = 'mobile' | 'tablet' | 'desktop';
const PREVIEW_WIDTHS: Record<Preview, string> = { mobile: '375px', tablet: '768px', desktop: '100%' };

export function BuilderPage(): React.JSX.Element {
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId;
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  const tk = useThemeTokens();
  const bp = useBreakpoint();
  const [preview, setPreview] = useState<Preview>('desktop');
  const [loading, setLoading] = useState(true);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => { if (!isAuthenticated) router.push('/login'); }, [isAuthenticated, router]);
  useEffect(() => { if (!projectId) return; const id = setTimeout(() => setLoading(false), 600); return () => clearTimeout(id); }, [projectId]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(true); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  if (!isAuthenticated) return <></>;
  if (!projectId) return <ErrorFallback message={t('builder.notFound')} onRetry={() => router.push('/dashboard')} />;

  if (loading) return (
    <BuilderLayout>
      <div style={css({ display: 'flex', alignItems: 'center', justifyContent: 'center', blockSize: '100%', background: tk.bg.canvas })} role="status" aria-label={t('builder.loading')}>
        <div style={css({ inlineSize: 300, blockSize: 16, borderRadius: 8, background: tk.bg.surface, animation: 'pulse 1.5s ease-in-out infinite' })} />
      </div>
    </BuilderLayout>
  );

  return (
    <BuilderLayout>
      {!bp.isMobile && (
        <div style={css({ display: 'flex', gap: 8, paddingBlock: 8, paddingInline: 16, justifyContent: 'center' })} role="radiogroup" aria-label={t('builder.previewToggle')}>
          {(['mobile', 'tablet', 'desktop'] as const).map((p) => (
            <Button key={p} onClick={() => setPreview(p)} aria-pressed={preview === p} style={css({ background: preview === p ? tk.accent.default : tk.bg.surface, color: preview === p ? tk.bg.canvas : tk.text.primary, minBlockSize: 44, paddingInline: 16, borderRadius: 8, border: 'none', cursor: 'pointer' })}>{t(`builder.preview.${p}`)}</Button>
          ))}
        </div>
      )}
      <div style={css({ maxInlineSize: PREVIEW_WIDTHS[preview], marginInline: 'auto', blockSize: '100%', background: tk.bg.canvas, transition: 'max-inline-size 0.3s ease-in-out' })}>
        <div style={css({ paddingBlock: 32, paddingInline: 24, color: tk.text.primary })}>{t('builder.placeholder')}</div>
      </div>
      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}
    </BuilderLayout>
  );
}

export default BuilderPage;
