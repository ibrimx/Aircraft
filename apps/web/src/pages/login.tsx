import { type CSSProperties, type FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useI18n, Button, Input } from '@aircraft/ui';
import { useThemeTokens } from '@aircraft/design-tokens';

const css = (s: CSSProperties): CSSProperties => s;

export function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  const tk = useThemeTokens();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError(t('login.validationError'));
      return;
    }
    setLoading(true);
    /* placeholder auth call */
    setTimeout(() => {
      setLoading(false);
      setError(t('login.authError'));
    }, 1200);
  };

  return (
    <div
      style={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minBlockSize: '100vh',
        background: tk.bg.canvas,
        paddingInline: 24,
      })}
    >
      <form
        onSubmit={handleSubmit}
        style={css({
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          inlineSize: '100%',
          maxInlineSize: 380,
          background: tk.bg.surface,
          paddingBlock: 40,
          paddingInline: 32,
          borderRadius: 16,
        })}
      >
        <h1
          style={css({
            fontSize: 24,
            fontWeight: 700,
            textAlign: 'center',
            color: tk.text.primary,
            marginBlockEnd: 8,
          })}
        >
          {t('login.title')}
        </h1>
        {error && (
          <p
            role="alert"
            style={css({
              color: tk.text.primary,
              background: tk.accent.subtle,
              paddingBlock: 8,
              paddingInline: 12,
              borderRadius: 8,
              fontSize: 14,
            })}
          >
            {error}
          </p>
        )}
        <Input
          type="email"
          placeholder={t('login.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label={t('login.emailLabel')}
          style={css({
            minBlockSize: 44,
            paddingInline: 12,
            borderRadius: 8,
            border: `1px solid ${tk.border.default}`,
            background: tk.bg.default,
            color: tk.text.primary,
          })}
        />
        <Input
          type="password"
          placeholder={t('login.passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-label={t('login.passwordLabel')}
          style={css({
            minBlockSize: 44,
            paddingInline: 12,
            borderRadius: 8,
            border: `1px solid ${tk.border.default}`,
            background: tk.bg.default,
            color: tk.text.primary,
          })}
        />
        <Button
          type="submit"
          disabled={loading}
          style={css({
            minBlockSize: 44,
            borderRadius: 8,
            border: 'none',
            background: tk.accent.default,
            color: tk.bg.canvas,
            fontSize: 16,
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.6 : 1,
          })}
        >
          {loading ? t('login.loading') : t('login.submit')}
        </Button>
      </form>
    </div>
  );
}

export default LoginPage;
