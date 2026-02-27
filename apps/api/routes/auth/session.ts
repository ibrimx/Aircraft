/**
 * P15 — Session API Routes
 * POST   /api/auth/session         — Login (create session)
 * DELETE /api/auth/session         — Logout (revoke current session)
 * POST   /api/auth/session/refresh — Refresh token pair
 *
 * Dependencies: session-manager.ts, token-service.ts, api-guard.ts
 */

import type {
  LoginResponse,
  AuthUser,
  SessionId,
} from '@brimair/shared-types';
import type { BrimairError } from '@brimair/shared-types';
import { createError, ERROR_CODES } from '@brimair/shared-types';
import type {
  SessionManager,
  TokenService,
  TokenPair,
} from '@brimair/auth-engine';
import { authenticate } from '@brimair/auth-engine';

// ─── Types ────────────────────────────────────────────────────────

type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

interface LoginBody {
  readonly email: string;
  readonly password: string;
}

interface RefreshBody {
  readonly refreshToken: string;
}

/** Abstract user authentication — no direct DB calls. */
export interface AuthStore {
  /** Verify credentials and return the user if valid. */
  verifyCredentials(email: string, password: string): Promise<AuthUser | null>;
}

interface SessionRouteContext {
  readonly authStore: AuthStore;
  readonly tokenService: TokenService;
  readonly sessionManager: SessionManager;
}

// ─── POST /api/auth/session (Login) ───────────────────────────────

/**
 * Authenticate with email/password and create a new session.
 * Public endpoint — no auth token required.
 */
export async function handleLogin(
  body: LoginBody,
  ctx: SessionRouteContext,
): Promise<Result<LoginResponse, BrimairError>> {
  // 1 — Validate body
  if (!body.email || !body.password) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        'email and password are required',
        {},
      ),
    };
  }

  // 2 — Verify credentials
  const user = await ctx.authStore.verifyCredentials(body.email, body.password);
  if (!user) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        'Invalid email or password',
        { email: body.email },
      ),
    };
  }

  // 3 — Create session
  const sessionResult = await ctx.sessionManager.createSession({
    userId: user.id as string,
    workspaceId: user.workspaceId as string,
  });

  if (!sessionResult.ok) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        sessionResult.error,
        { userId: user.id },
      ),
    };
  }

  const { session } = sessionResult.data;

  return {
    success: true,
    data: { user, session },
  };
}

// ─── DELETE /api/auth/session (Logout) ────────────────────────────

/**
 * Revoke the current session. Requires authentication.
 */
export async function handleLogout(
  token: string,
  ctx: SessionRouteContext,
): Promise<Result<void, BrimairError>> {
  // 1 — Authenticate
  const authResult = await authenticate(token, ctx.tokenService);
  if (!authResult.success) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        authResult.error ?? 'Authentication failed',
        {},
      ),
    };
  }

  const { sessionId } = authResult.data;

  // 2 — Revoke session
  const revokeResult = await ctx.sessionManager.revokeSession({
    sessionId: sessionId as unknown as SessionId,
  });

  if (!revokeResult.ok) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        revokeResult.error,
        { sessionId },
      ),
    };
  }

  return { success: true, data: undefined };
}

// ─── POST /api/auth/session/refresh ───────────────────────────────

/**
 * Refresh the current session's token pair. Requires authentication.
 */
export async function handleRefreshSession(
  token: string,
  body: RefreshBody,
  ctx: SessionRouteContext,
): Promise<Result<{ tokens: TokenPair }, BrimairError>> {
  // 1 — Authenticate
  const authResult = await authenticate(token, ctx.tokenService);
  if (!authResult.success) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_EXPIRED,
        'auth',
        'recoverable',
        authResult.error ?? 'Authentication failed',
        {},
      ),
    };
  }

  const { sessionId } = authResult.data;

  // 2 — Validate body
  if (!body.refreshToken) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        'refreshToken is required',
        {},
      ),
    };
  }

  // 3 — Refresh session
  const refreshResult = await ctx.sessionManager.refreshSession({
    sessionId: sessionId as unknown as SessionId,
    refreshToken: body.refreshToken,
  });

  if (!refreshResult.ok) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        refreshResult.error,
        { sessionId },
      ),
    };
  }

  return { success: true, data: { tokens: refreshResult.data.tokens } };
}
