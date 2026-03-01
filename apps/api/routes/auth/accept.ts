/**
 * P14 — Accept Invite API Route
 * POST /api/auth/accept — Accept an invite and register (public endpoint)
 *
 * Dependencies: invite-service.ts, invite-validator.ts, session-manager.ts, token-service.ts
 */

import type {
  UserId,
  ISODateString,
  AuthUser,
  PermissionSet,
} from '@aircraft/shared-types';
import type { AircraftError } from '@aircraft/shared-types';
import { createError, ERROR_CODES } from '@aircraft/shared-types';
import type {
  InviteService,
  TokenService,
  TokenPair,
  AccessToken,
  RefreshToken,
} from '@aircraft/auth-engine';
import type { SessionManager } from '@aircraft/auth-engine';

// ─── Types ────────────────────────────────────────────────────────

type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

interface AcceptInviteBody {
  readonly inviteId: string;
  readonly email: string;
  readonly password: string;
  readonly name: string;
}

/** Workspace member info returned after accepting an invite */
interface WorkspaceMemberInfo {
  readonly userId: string;
  readonly workspaceId: string;
  readonly roleId: string;
  readonly permissions: PermissionSet;
  readonly joinedAt: string;
}

/** Abstract user persistence — no direct DB calls. */
export interface UserStore {
  /** Create a new user account and return the assigned UserId. */
  create(params: { email: string; password: string; name: string }): UserId;
  /** Find an existing user by email. */
  findByEmail(email: string): UserId | null;
}

/** Abstract rate-limit persistence — swap in Redis for production. */
export interface RateLimitStore {
  /** Record an attempt and return the current count within the window. */
  recordAttempt(key: string, windowMs: number): number;
  /** Check current attempt count within window. */
  getAttemptCount(key: string, windowMs: number): number;
  /** Reset attempts for a key (e.g. after successful accept). */
  reset(key: string): void;
}

interface AcceptRouteContext {
  readonly inviteService: InviteService;
  readonly userStore: UserStore;
  readonly tokenService: TokenService;
  readonly sessionManager: SessionManager;
  readonly rateLimitStore: RateLimitStore;
}

// ─── Rate-limit constants ─────────────────────────────────────────

const RATE_LIMIT_MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute

// ─── In-memory fallback rate-limit store (dev only) ───────────────

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
    const list = (this.attempts.get(key) ?? []).filter((t) => now - t < windowMs);
    return list.length;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// ─── POST /api/auth/accept ────────────────────────────────────────

/**
 * Accept an invite, register the user, and return a session token pair.
 *
 * This is a **public endpoint** — no auth token required.
 * Rate-limited to 5 attempts per minute per IP.
 */
export async function handleAcceptInvite(
  body: AcceptInviteBody,
  ip: string,
  ctx: AcceptRouteContext,
): Promise<Result<{ tokens: TokenPair; member: WorkspaceMemberInfo }, AircraftError>> {
  // 1 — Rate-limit
  const attemptCount = ctx.rateLimitStore.getAttemptCount(ip, RATE_LIMIT_WINDOW_MS);
  if (attemptCount >= RATE_LIMIT_MAX_ATTEMPTS) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        'Too many attempts. Please try again later.',
        { ip },
      ),
    };
  }

  // 2 — Validate body
  if (!body.inviteId || !body.email || !body.password || !body.name) {
    ctx.rateLimitStore.recordAttempt(ip, RATE_LIMIT_WINDOW_MS);
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        'inviteId, email, password, and name are required',
        {},
      ),
    };
  }

  // 3 — Check if email is already registered
  const existingUser = ctx.userStore.findByEmail(body.email);
  if (existingUser) {
    ctx.rateLimitStore.recordAttempt(ip, RATE_LIMIT_WINDOW_MS);
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        'An account with this email already exists',
        { email: body.email },
      ),
    };
  }

  // 4 — Accept invite via InviteService
  try {
    const acceptResult = await ctx.inviteService.acceptInvite({
      token: body.inviteId,
      name: body.name,
      password: body.password,
    });

    const { user, session } = acceptResult;

    // Build member info from AuthUser data
    const member: WorkspaceMemberInfo = {
      userId: user.id as string,
      workspaceId: user.workspaceId as string,
      roleId: user.roleId as string,
      permissions: user.permissions,
      joinedAt: user.createdAt as string,
    };

    // Build token pair from session
    const tokens: TokenPair = {
      accessToken: session.token as unknown as AccessToken,
      refreshToken: session.refreshToken as unknown as RefreshToken,
      expiresAt: session.expiresAt as ISODateString,
    };

    ctx.rateLimitStore.reset(ip);

    return { success: true, data: { tokens, member } };
  } catch (err) {
    ctx.rateLimitStore.recordAttempt(ip, RATE_LIMIT_WINDOW_MS);
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        err instanceof Error ? err.message : 'Accept failed',
        {},
      ),
    };
  }
}
