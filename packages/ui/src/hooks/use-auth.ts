// packages/ui/src/hooks/use-auth.ts
import { createContext, useContext } from 'react';
import type { AuthUser, Session } from '@brimair/shared-types';

// ── Types ────────────────────────────────────────────────
export type AuthState = {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

// ── Context ──────────────────────────────────────────────
const AuthContext = createContext<AuthState | null>(null);

export { AuthContext };

// ── Helper: session expiry check ─────────────────────────
function isSessionValid(session: Session | null): boolean {
  if (!session) return false;
  return new Date(session.expiresAt).getTime() > Date.now();
}

// ── Hook ─────────────────────────────────────────────────
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);

  if (ctx === null) {
    throw new Error(
      'useAuth must be used within an <AuthProvider>. ' +
      'Wrap your component tree with AuthProvider.',
    );
  }

  const isAuthenticated =
    ctx.user !== null && isSessionValid(ctx.session);

  // Return context values with live isAuthenticated calculation
  if (ctx.isAuthenticated === isAuthenticated) {
    return ctx;
  }

  return {
    user: ctx.user,
    session: ctx.session,
    isAuthenticated,
    isLoading: ctx.isLoading,
    login: ctx.login,
    logout: ctx.logout,
    refresh: ctx.refresh,
  };
}
