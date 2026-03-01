import { type CSSProperties, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useI18n, useBreakpoint, Button } from '@brimair/ui';
import { useThemeTokens } from '@brimair/design-tokens';

const css = (s: CSSProperties): CSSProperties => s;

type DashState = 'loading' | 'ready' | 'empty';

export function DashboardPage(): React.JSX.Element {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { t } = useI18n();
  const tk = useThemeTokens();
  const bp = useBreakpoint();
  const [state, setState] = useState<DashState>('loading');

  useEffect(() => { if (!isAuthenticated) navigate('/login'); }, [isAuthenticated, navigate]);
  useEffect(() => { const timer = setTimeout(() => setState('ready'), 600); return () => clearTimeout(timer); }, []);

  if (!isAuthenticated) return <></>;

  return (
    <div style={css({ minBlockSize: '100vh', background: tk.bg.canvas, paddingBlock: 32, paddingInline: 24 })}>
      <header style={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: 32 })}>
        <h1 style={css({ fontSize: 24, fontWeight: 700, color: tk.text.primary })}>{t('dashboard.welcome', { name: user?.name ?? '' })}</h1>
        <Button style={css({ background: tk.accent.default, color: tk.bg.canvas, minBlockSize: 44, paddingInline: 20, borderRadius: 8, border: 'none', cursor: 'pointer' })}>{t('dashboard.newProject')}</Button>
      </header>

      {state === 'loading' && (
        <div style={css({ display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 })} role="status" aria-label={t('dashboard.loading')}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} style={css({ blockSize: 160, borderRadius: 16, background: tk.bg.surface, animation: 'pulse 1.5s ease-in-out infinite' })} />
          ))}
        </div>
      )}

      {state === 'empty' && (
        <div style={css({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBlock: 80, gap: 16, color: tk.text.secondary })}>
          <p>{t('dashboard.empty')}</p>
          <Button style={css({ background: tk.accent.default, color: tk.bg.canvas, minBlockSize: 44, paddingInline: 24, borderRadius: 8, border: 'none', cursor: 'pointer' })}>{t('dashboard.createFirst')}</Button>
        </div>
      )}

      {state === 'ready' && (
        <div style={css({ display: 'grid', gridTemplateColumns: bp.isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 })}>
          {[0, 1, 2].map((i) => (
            <Link key={i} to={`/studio/project-${i}`} style={css({ textDecoration: 'none' })}>
              <div style={css({ background: tk.bg.surface, borderRadius: 16, overflow: 'hidden', transition: 'filter 0.2s ease-in-out' })}>
                <div style={css({ blockSize: 120, background: tk.bg.default })} />
                <div style={css({ paddingBlock: 16, paddingInline: 16 })}>
                  <h3 style={css({ fontSize: 16, fontWeight: 600, color: tk.text.primary })}>{t('dashboard.project', { index: String(i + 1) })}</h3>
                  <p style={css({ fontSize: 13, color: tk.text.tertiary, marginBlockStart: 4 })}>{t('dashboard.lastEdited')}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
