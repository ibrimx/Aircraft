import { type CSSProperties, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth, useI18n, useBreakpoint, useCmsSource, SourcePicker, CollectionBrowser, SyncStatus, ErrorFallback, Button } from '@aircraft/ui';
import { useThemeTokens } from '@aircraft/design-tokens';

const css = (s: CSSProperties): CSSProperties => s;

export function CmsPage(): React.JSX.Element {
  const params = useParams<{ sourceId: string }>();
  const sourceId = params?.sourceId;
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  const tk = useThemeTokens();
  const bp = useBreakpoint();
  const { sources, loading, error } = useCmsSource();

  useEffect(() => { if (!isAuthenticated) router.replace('/login'); }, [isAuthenticated, router]);

  if (!isAuthenticated) return <></>;
  if (error) return <ErrorFallback message={t('cms.error')} onRetry={() => router.push('/cms')} />;

  if (loading) return (
    <div style={css({ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, paddingBlock: 32, paddingInline: 24 })} role="status" aria-label={t('cms.loading')}>
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} style={css({ blockSize: 120, borderRadius: 12, background: tk.bg.surface, animation: 'pulse 1.5s ease-in-out infinite' })} />
      ))}
    </div>
  );

  if (!sourceId) {
    if (sources.length === 0) return (
      <div style={css({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', blockSize: '100%', gap: 16, color: tk.text.secondary })}>
        <p>{t('cms.noSources')}</p>
        <Button onClick={() => router.push('/cms/add')} style={css({ background: tk.accent.default, color: tk.bg.canvas, minBlockSize: 44, paddingInline: 24, borderRadius: 8, border: 'none', cursor: 'pointer' })}>{t('cms.addSource')}</Button>
      </div>
    );

    return <SourcePicker onSelect={(type) => router.push(`/cms/${type}`)} />;
  }

  return (
    <div style={css({ display: 'flex', flexDirection: bp.isMobile ? 'column' : 'row', blockSize: '100%' })}>
      {!bp.isMobile && (
        <aside style={css({ inlineSize: 240, borderInlineEnd: `1px solid ${tk.border.default}`, background: tk.bg.surface, paddingBlock: 16, paddingInline: 12, overflowY: 'auto' })}>
          <SourcePicker onSelect={(type) => router.push(`/cms/${type}`)} />
        </aside>
      )}
      <main style={css({ flex: 1, paddingBlock: 16, paddingInline: 24, overflowY: 'auto' })}>
        <SyncStatus />
        <CollectionBrowser sourceId={sourceId} />
      </main>
    </div>
  );
}
