import { type CSSProperties } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useI18n, InviteGate } from '@brimair/ui';
import { useThemeTokens } from '@brimair/design-tokens';

const css = (s: CSSProperties): CSSProperties => s;

export function JoinPage(): React.JSX.Element {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { t } = useI18n();
  const tk = useThemeTokens();

  if (!token) {
    return (
      <div style={css({ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minBlockSize: '100vh', background: tk.bg.canvas, color: tk.text.primary, gap: 16, paddingInline: 24 })}>
        <p>{t('join.invalidLink')}</p>
        <Link to="/login" style={css({ color: tk.accent.default })}>{t('join.goToLogin')}</Link>
      </div>
    );
  }

  return (
    <div style={css({ display: 'flex', alignItems: 'center', justifyContent: 'center', minBlockSize: '100vh', background: tk.bg.canvas })}>
      <InviteGate token={token} />
    </div>
  );
}
