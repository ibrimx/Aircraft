import { type JSX } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { InviteGate, useI18n } from '@brimair/ui';
import { useThemeTokens } from '@brimair/design-tokens';

export function JoinPage(): JSX.Element {
  const [params] = useSearchParams();
  const token = params.get('token');
  const nav = useNavigate();
  const { t } = useI18n();
  const tk = useThemeTokens();

  return (
    <div style= display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', paddingInline: 16 >
      <div
        style={{
          maxWidth: 400, width: '100%', background: tk.bg.surface,
          borderRadius: 12, border: `1px solid ${tk.border.default}`, padding: 32,
        }}
      >
        {token ? (
          <InviteGate token={token} />
        ) : (
          <div style= textAlign: 'center' >
            <p style= color: tk.text.secondary, marginBlockEnd: 16 >
              {t('join.noToken')}
            </p>
            <button
              type="button"
              onClick={() => nav('/login')}
              style= background: 'none', border: 'none', color: tk.accent.text, cursor: 'pointer', fontSize: '0.875rem' 
            >
              {t('join.goToLogin')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
