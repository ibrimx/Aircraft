import { type CSSProperties } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useI18n, InviteGate } from '@aircraft/ui';
import { useThemeTokens } from '@aircraft/design-tokens';

const css = (s: CSSProperties): CSSProperties => s;

export default function JoinPage(): React.JSX.Element {
  const router = useRouter();
  const { token } = router.query as { token?: string };

  const { t } = useI18n();
  const tk = useThemeTokens();

  if (!token) {
    return (
      <div
        style={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minBlockSize: '100vh',
          background: tk.bg.canvas,
          color: tk.text.primary,
          gap: 16,
          paddingInline: 24
        })}
      >
        <p>{t('join.invalidLink')}</p>

        <Link href="/login" style={{ color: tk.accent.default }}>
          {t('join.goToLogin')}
        </Link>
      </div>
    );
  }

  return (
    <div
      style={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minBlockSize: '100vh',
        background: tk.bg.canvas
      })}
    >
      <InviteGate token={token} />
    </div>
  );
}
