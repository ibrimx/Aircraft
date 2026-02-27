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

// ─── Types ────────────────────────────────────────────────────

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

/** Abstract rate-limit persistence — swap in Redis for production. */
export interface RateLimitStore {
  /** Record an attempt and return the current count within the window. */
  recordAttempt(key: string, windowMs: number): number;
  /** Check current attempt count within window. */
  getAttemptCount(key: string, windowMs: number): number;
  /** Reset attempts for a key (e.g. after successful login). */
  reset(key: string): void;
}

/** In-memory rate-limit store for local development. Use Redis in production. */
export class InMemoryRateLimitStore implements RateLimitStore {
  private readonly attempts = new Map<string, number[]>();

  recordAttempt(key: string, windowMs: number): number {
    const now = Date.now();
    const list = (this.attempts.get(key) ?? []).filter((t) => now - t < windowMs);
    list.push(now);
    this.attempts.set(key, list);
    return list.length;
  }

  getAttemptCount(key: string, windowMs: number): number {
    const now = Date.now();
    return (this.attempts.get(key) ?? []).filter((t) => now - t < windowMs).length;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// ─── Rate-limit constants ─────────────────────────────────────

const RATE_LIMIT_MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute

interface SessionRouteContext {
  readonly authStore: AuthStore;
  readonly tokenService: TokenService;
  readonly sessionManager: SessionManager;
  readonly rateLimitStore: RateLimitStore;
}

// ─── POST /api/auth/session (Login) ───────────────────────────

/**
 * Authenticate with email/password and create a new session.
 * Public endpoint — no auth token required.
 * Rate-limited to 5 attempts per minute per IP.
 */
export async function handleLogin(
  body: LoginBody,
  ip: string,
  ctx: SessionRouteContext,
): Promise<Result<LoginResponse, BrimairError>> {
  // 1 — Rate-limit check
  const attemptCount = ctx.rateLimitStore.getAttemptCount(ip, RATE_LIMIT_WINDOW_MS);
  if (attemptCount >= RATE_LIMIT_MAX_ATTEMPTS) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        'Too many login attempts. Please try again later.',
        { ip },
      ),
    };
  }

  // 2 — Validate body
  if (!body.email || !body.password) {
    ctx.rateLimitStore.recordAttempt(ip, RATE_LIMIT_WINDOW_MS);
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

  // 3 — Verify credentials
  const user = await ctx.authStore.verifyCredentials(body.email, body.password);
  if (!user) {
    ctx.rateLimitStore.recordAttempt(ip, RATE_LIMIT_WINDOW_MS);
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

  // 4 — Create session
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

  // Success — reset rate limit
  ctx.rateLimitStore.reset(ip);

  const { session } = sessionResult.data;

  return {
    success: true,
    data: { user, session },
  };
}

// ─── DELETE /api/auth/session (Logout) ────────────────────────

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

// ─── POST /api/auth/session/refresh ───────────────────────────

/**
 * Refresh the current session's token pair.
 * No auth header required — the refresh token IS the auth.
 * Accepts an optional (possibly expired) access token to extract the sessionId.
 */
export async function handleRefreshSession(
  accessToken: string | null,
  body: RefreshBody,
  ctx: SessionRouteContext,
): Promise<Result<{ tokens: TokenPair }, BrimairError>> {
  // 1 — Validate body
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

  // 2 — Decode the (possibly expired) access token to extract sessionId.
  //     We use decode() (no signature verification) because the token may be expired.
  if (!accessToken) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_EXPIRED,
        'auth',
        'recoverable',
        'Access token required for session identification (may be expired)',
        {},
      ),
    };
  }

  const payload = ctx.tokenService.decode(accessToken);
  if (!payload || !payload.sid) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        'Unable to decode access token for session identification',
        {},
      ),
    };
  }

  // 3 — Refresh session via SessionManager
  const refreshResult = await ctx.sessionManager.refreshSession({
    sessionId: payload.sid as unknown as SessionId,
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
        { sessionId: payload.sid },
      ),
    };
  }

  return { success: true, data: { tokens: refreshResult.data.tokens } };
}
