export const runtime = 'experimental-edge';
import React, { type CSSProperties, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useI18n, InviteGate } from '@aircraft/ui';
import { useThemeTokens } from '@aircraft/design-tokens';

const css = (s: CSSProperties): CSSProperties => s;

export default function JoinPage(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? undefined;

  const { t } = useI18n();
  const tk = useThemeTokens();

  const invite = useMemo(
    () =>
      token
        ? {
            token,
            workspaceName: 'Aircraft Workspace',
            inviterName: 'Aircraft Team',
            inviterEmail: 'team@aircraft.app',
            role: 'Editor',
            expiresAt: Date.now() + 30 * 60 * 1000,
            status: 'validating' as const,
          }
        : null,
    [token],
  );

  if (!token) {
    return (
      <div
        style={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minBlockSize: '100vh',
          background: tk.colors.background.primary,
          color: tk.colors.text.primary,
          gap: 16,
          paddingInline: 24,
        })}
      >
        <p>{t('join.invalidLink')}</p>

        <Link
          href="/login"
          style={{ color: tk.colors.accent.default }}
        >
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
        background: tk.colors.background.primary,
      })}
    >
      <InviteGate
        invite={invite}
        onAccept={() => {
          router.push('/dashboard');
        }}
        onDecline={() => {
          router.push('/login');
        }}
      />
    </div>
  );
}
