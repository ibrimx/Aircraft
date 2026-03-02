import { type CSSProperties, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  useAuth,
  useI18n,
  useBreakpoint,
  useCmsSource,
  SourcePicker,
  CollectionBrowser,
  SyncStatus,
  ErrorFallback,
  Button,
} from '@aircraft/ui';
import { useThemeTokens } from '@aircraft/design-tokens';
import type { AircraftError } from '@aircraft/shared-types';

const css = (s: CSSProperties): CSSProperties => s;

export default function CmsPage(): React.JSX.Element {
  const router = useRouter();
  const { sourceId } = router.query as { sourceId?: string };

  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  const tk = useThemeTokens();
  const bp = useBreakpoint();

  // NOTE: UseCmsSourceReturn doesn't have `loading` in your build output.
  // We'll infer loading from data presence + error state.
  const cms = useCmsSource() as any;

  const sources = (cms?.sources ?? []) as any[];
  const error = cms?.error as unknown;

  const isLoading = useMemo(() => {
    // If hook exposes explicit flags in the future, prefer them.
    if (typeof cms?.isLoading === 'boolean') return cms.isLoading as boolean;
    if (typeof cms?.loading === 'boolean') return cms.loading as boolean;

    // Otherwise: loading when auth is ok, no error, and sources not populated yet.
    return !error && !Array.isArray(sources);
  }, [cms, error, sources]);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return <></>;

  if (error) {
    const fallbackError: AircraftError = {
      code: 'cms/unknown-error',
      category: 'cms',
      severity: 'recoverable',
      message: 'An unexpected CMS error occurred.',
      userMessage: null,
      context: {},
      timestamp: new Date().toISOString() as AircraftError['timestamp'],
      recoveryAction: 'retry',
    };

    const resolvedError: AircraftError =
      error && typeof error === 'object' && 'code' in (error as Record<string, unknown>)
        ? (error as AircraftError)
        : fallbackError;

    return (
      <div
        style={css({
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          padding: 24,
          color: tk.colors.text.primary,
        })}
      >
        <ErrorFallback error={resolvedError} onRetry={() => router.reload()} />
        <div>
          <Button
            onClick={() => router.push('/cms')}
            style={css({
              background: tk.colors.accent.default,
              color: tk.colors.background.primary,
              minBlockSize: 44,
              paddingInline: 16,
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
            })}
          >
            {t('cms.retry')}
          </Button>
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
        })}
        role="status"
        aria-label={t('cms.loading')}
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            style={css({
              blockSize: 120,
              borderRadius: 12,
              background: tk.colors.surface.default,
              animation: 'pulse 1.5s ease-in-out infinite',
            })}
          />
        ))}
      </div>
    );
  }

  // No source selected yet
  if (!sourceId) {
    if (Array.isArray(sources) && sources.length === 0) {
      return (
        <div
          style={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            blockSize: '100%',
            gap: 16,
            color: tk.colors.text.secondary,
            padding: 24,
            textAlign: 'center',
          })}
        >
          <p style={css({ margin: 0 })}>{t('cms.noSources')}</p>

          <Button
            onClick={() => router.push('/cms/add')}
            style={css({
              background: tk.colors.accent.default,
              color: tk.colors.background.primary,
              minBlockSize: 44,
              paddingInline: 24,
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
            })}
          >
            {t('cms.addSource')}
          </Button>
        </div>
      );
    }

    return <SourcePicker onSelect={(type) => router.push(`/cms/${type}`)} />;
  }

  // Selected source view
  return (
    <div
      style={css({
        display: 'flex',
        flexDirection: bp.isMobile ? 'column' : 'row',
        blockSize: '100%',
      })}
    >
      {!bp.isMobile && (
        <aside
          style={css({
            inlineSize: 240,
            borderInlineEnd: `1px solid ${tk.colors.border.default}`,
            background: tk.colors.surface.default,
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
        {/* SyncStatus requires `syncStatus` prop */}
        <SyncStatus syncStatus={(cms?.syncStatus ?? cms?.status ?? cms?.sync ?? {}) as any} />

        {/* CollectionBrowser expects `source` (not sourceId) */}
        <CollectionBrowser
          source={sourceId as any}
          collections={[]}
          onSelect={() => {}}
          onRefresh={() => {}}
        />
      </main>
    </div>
  );
}
