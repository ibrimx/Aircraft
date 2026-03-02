import React, { type CSSProperties, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  useAuth,
  useI18n,
  useBreakpoint,
  useCmsSource,
  SourcePicker,
  CollectionBrowser,
  SyncStatus,
  Button,
} from '@aircraft/ui';
import { useThemeTokens } from '@aircraft/design-tokens';

const css = (s: CSSProperties): CSSProperties => s;

type CmsSourceLike = { id?: string; key?: string; name?: string; type?: string } | unknown;

function deriveIsLoading(ret: any, sources: unknown, error: unknown): boolean {
  if (typeof ret?.isLoading === 'boolean') return ret.isLoading;
  if (typeof ret?.loading === 'boolean') return ret.loading;
  if (typeof ret?.status === 'string') return ret.status === 'loading' || ret.status === 'pending';
  if (typeof ret?.state === 'string') return ret.state === 'loading' || ret.state === 'pending';

  const arr = Array.isArray(sources) ? sources : [];
  return !error && arr.length === 0;
}

export default function CmsPage(): React.JSX.Element {
  const router = useRouter();
  const { sourceId } = router.query as { sourceId?: string };

  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  const tk = useThemeTokens();
  const bp = useBreakpoint();

  // Defensive: لا تفترض shape ثابت
  const cms = useCmsSource() as any;

  const sources = useMemo(() => {
    const s = cms?.sources ?? cms?.data ?? cms?.items ?? [];
    return Array.isArray(s) ? (s as CmsSourceLike[]) : [];
  }, [cms]);

  const error = cms?.error ?? null;

  const isLoading = useMemo(() => deriveIsLoading(cms, sources, error), [cms, sources, error]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return <></>;

  if (error) {
    return (
      <div
        style={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          blockSize: '100%',
          gap: 12,
          padding: 24,
          background: tk.bg.canvas,
          color: tk.text.primary,
        })}
        role="alert"
        aria-label={t('cms.error') ?? 'CMS error'}
      >
        <div style={css({ maxInlineSize: 560, textAlign: 'center' })}>
          <div style={css({ fontWeight: 700, marginBottom: 8 })}>
            {t('cms.error') ?? 'Something went wrong'}
          </div>
          <div style={css({ opacity: 0.85, marginBottom: 16 })}>
            {t('cms.tryAgain') ?? 'Please try again.'}
          </div>

          <div style={css({ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' })}>
            <Button
              onClick={() => router.push('/cms')}
              style={css({
                minBlockSize: 44,
                paddingInline: 18,
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
              })}
            >
              {t('common.retry') ?? 'Retry'}
            </Button>

            <Button
              onClick={() => router.push('/dashboard')}
              style={css({
                minBlockSize: 44,
                paddingInline: 18,
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
              })}
            >
              {t('common.goToDashboard') ?? 'Go to dashboard'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        style={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
          paddingBlock: 32,
          paddingInline: 24,
          background: tk.bg.canvas,
        })}
        role="status"
        aria-label={t('cms.loading') ?? 'Loading'}
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            style={css({
              blockSize: 120,
              borderRadius: 12,
              background: tk.bg.surface,
              animation: 'pulse 1.5s ease-in-out infinite',
            })}
          />
        ))}
      </div>
    );
  }

  if (!sourceId) {
    if (sources.length === 0) {
      return (
        <div
          style={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            blockSize: '100%',
            gap: 16,
            padding: 24,
            background: tk.bg.canvas,
            color: tk.text.secondary,
          })}
        >
          <p style={css({ margin: 0 })}>{t('cms.noSources') ?? 'No sources found.'}</p>

          <Button
            onClick={() => router.push('/cms/add')}
            style={css({
              background: tk.accent.default,
              color: tk.bg.canvas,
              minBlockSize: 44,
              paddingInline: 24,
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
            })}
          >
            {t('cms.addSource') ?? 'Add source'}
          </Button>
        </div>
      );
    }

    return <SourcePicker onSelect={(type) => router.push(`/cms/${type}`)} />;
  }

  return (
    <div
      style={css({
        display: 'flex',
        flexDirection: bp.isMobile ? 'column' : 'row',
        blockSize: '100%',
        background: tk.bg.canvas,
      })}
    >
      {!bp.isMobile && (
        <aside
          style={css({
            inlineSize: 240,
            borderInlineEnd: `1px solid ${tk.border.default}`,
            background: tk.bg.surface,
            paddingBlock: 16,
            paddingInline: 12,
            overflowY: 'auto',
          })}
        >
          <SourcePicker onSelect={(type) => router.push(`/cms/${type}`)} />
        </aside>
      )}

      <main
        style={css({
          flex: 1,
          paddingBlock: 16,
          paddingInline: 24,
          overflowY: 'auto',
        })}
      >
        {/* ✅ Fix: SyncStatus requires syncStatus prop */}
        <SyncStatus syncStatus={(cms?.syncStatus ?? cms?.status ?? cms?.sync ?? {}) as any} />
        <CollectionBrowser sourceId={sourceId} />
      </main>
    </div>
  );
}
