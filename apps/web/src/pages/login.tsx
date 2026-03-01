import { type JSX, type FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, useAuth, useI18n } from '@brimair/ui';
import { useThemeTokens } from '@brimair/design-tokens';

export function LoginPage(): JSX.Element {
  const { isAuthenticated, login } = useAuth();
  const nav = useNavigate();
  const { t } = useI18n();
  const tk = useThemeTokens();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) nav('/dashboard', { replace: true });
  }, [isAuthenticated, nav]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (!email) {
      setError(t('auth.emailRequired'));
      return;
    }
    if (password.length < 8) {
      setError(t('auth.passwordMin'));
      return;
    }

    setLoading(true);
    login(email, password)
      .then(() => nav('/dashboard', { replace: true }))
      .catch(() => setError(t('errors.serverError')))
      .finally(() => setLoading(false));
  };

  return (
    <div style= display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', paddingInline: 16 >
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 400, width: '100%', background: tk.bg.surface,
          borderRadius: 12, border: `1px solid ${tk.border.default}`,
          padding: 32, display: 'flex', flexDirection: 'column', gap: 16,
        }}
      >
        <h1 style= fontSize: '1.5rem', fontWeight: 700, color: tk.text.primary, textAlign: 'center' >
          {t('auth.loginTitle')}
        </h1>
        <Input
          type="email"
          placeholder={t('auth.emailPlaceholder')}
          value={email}
          onChange={setEmail}
          error={!!error && !email}
          helperText={!email && error ? error : undefined}
        />
        <Input
          type="password"
          placeholder={t('auth.passwordPlaceholder')}
          value={password}
          onChange={setPassword}
          error={!!error && password.length < 8}
          helperText={error || undefined}
        />
        <Button variant="primary" type="submit" loading={loading}>
          {t('auth.loginButton')}
        </Button>
        <button
          type="button"
          onClick={() => nav('/forgot-password')}
          style= background: 'none', border: 'none', fontSize: '0.875rem', color: tk.accent.text, textAlign: 'center', cursor: 'pointer' 
        >
          {t('auth.forgotPassword')}
        </button>
      </form>
    </div>
  );
}
