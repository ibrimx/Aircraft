/**
 * P14 — Accept Invite API Route
 * POST /api/auth/accept — Accept an invite and register (public endpoint)
 *
 * Dependencies: invite-service.ts, invite-validator.ts, session-manager.ts, token-service.ts
 */

import type {
  UserId,
  ISODateString,
  WorkspaceMember,
} from '@brimair/shared-types';
import type { BrimairError } from '@brimair/shared-types';
import { createError, ERROR_CODES } from '@brimair/shared-types';
import type { InviteStore, TokenService, SessionStore } from '@brimair/auth-engine';
import type { InviteService } from '@brimair/auth-engine';
import { InviteValidator } from '@brimair/auth-engine';
import { SessionManager } from '@brimair/auth-engine';
import type { TokenPair } from '@brimair/auth-engine';
import {
  RATE_LIMIT_CONFIG,
  type LoginAttempt,
} from '@brimair/auth-engine';

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

/** Abstract user persistence — no direct DB calls. */
export interface UserStore {
  /** Create a new user account and return the assigned UserId. */
  create(params: { email: string; password: string; name: string }): UserId;
  /** Find an existing user by email. */
  findByEmail(email: string): UserId | null;
}

interface AcceptRouteContext {
  readonly inviteStore: InviteStore;
  readonly inviteService: InviteService;
  readonly inviteValidator: InviteValidator;
  readonly userStore: UserStore;
  readonly tokenService: TokenService;
  readonly sessionStore: SessionStore;
  readonly sessionManager: SessionManager;
}

// ─── Rate-limit helper ────────────────────────────────────────────

const recentAttempts: Map<string, LoginAttempt[]> = new Map();

/**
 * Check whether an IP address has exceeded the accept rate limit.
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = RATE_LIMIT_CONFIG.windowMinutes * 60_000;
  const attempts = (recentAttempts.get(ip) ?? []).filter(
    (a) => now - new Date(a.timestamp).getTime() < windowMs,
  );
  return attempts.length >= RATE_LIMIT_CONFIG.maxAttempts;
}

/**
 * Record an accept attempt for rate-limiting.
 */
function recordAttempt(ip: string, success: boolean): void {
  const attempt: LoginAttempt = {
    email: '',
    timestamp: new Date().toISOString() as ISODateString,
    success,
    ip,
  };
  const list = recentAttempts.get(ip) ?? [];
  list.push(attempt);
  recentAttempts.set(ip, list);
}

// ─── POST /api/auth/accept ────────────────────────────────────────

/**
 * Accept an invite, register the user, and return a session token pair.
 *
 * This is a **public endpoint** — no auth token required.
 * Rate-limited to 5 attempts per minute per IP.
 *
 * Error codes:
 * - 400  AUTH_INVITE_INVALID  — missing/malformed body
 * - 409  AUTH_INVITE_INVALID  — email already registered
 * - 410  AUTH_INVITE_EXPIRED  — invite expired or revoked
 * - 429  (rate limited)
 */
export function handleAcceptInvite(
  body: AcceptInviteBody,
  ip: string,
  ctx: AcceptRouteContext,
): Result<{ tokens: TokenPair; member: WorkspaceMember }, BrimairError> {
  // 1 — Rate-limit
  if (isRateLimited(ip)) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_UNAUTHORIZED,
        'Too many attempts. Please try again later.',
      ),
    };
  }

  // 2 — Validate body
  if (!body.inviteId || !body.email || !body.password || !body.name) {
    recordAttempt(ip, false);
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVITE_INVALID,
        'inviteId, email, password, and name are required',
      ),
    };
  }

  // 3 — Look up invite
  const invite = ctx.inviteStore.findById(body.inviteId as any);
  if (!invite) {
    recordAttempt(ip, false);
    return {
      success: false,
      error: createError(ERROR_CODES.AUTH_INVITE_INVALID, 'Invite not found'),
    };
  }

  // 4 — Validate invite (not expired, not revoked, email matches)
  const validation = ctx.inviteValidator.validateInvite(invite);
  if (!validation.success) {
    recordAttempt(ip, false);
    return validation as Result<never, BrimairError>;
  }

  if (!ctx.inviteValidator.canUserAccept(invite, body.email)) {
    recordAttempt(ip, false);
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVITE_INVALID,
        'This invite is restricted to a different email address',
      ),
    };
  }

  // 5 — Check if email is already registered
  const existingUser = ctx.userStore.findByEmail(body.email);
  if (existingUser) {
    recordAttempt(ip, false);
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVITE_INVALID,
        'An account with this email already exists',
      ),
    };
  }

  // 6 — Create user account
  const userId = ctx.userStore.create({
    email: body.email,
    password: body.password,
    name: body.name,
  });

  // 7 — Accept invite → creates WorkspaceMember
  const acceptResult = ctx.inviteService.acceptInvite({
    inviteId: invite.inviteId,
    userId,
  });
  if (!acceptResult.success) {
    recordAttempt(ip, false);
    return acceptResult as Result<never, BrimairError>;
  }

  const member = acceptResult.data;

  // 8 — Create session
  const sessionResult = ctx.sessionManager.createSession(
    { userId, workspaceId: invite.workspaceId, role: invite.role },
    ctx.sessionStore,
    ctx.tokenService,
  );
  if (!sessionResult.success) {
    recordAttempt(ip, false);
    return sessionResult as Result<never, BrimairError>;
  }

  recordAttempt(ip, true);

  return {
    success: true,
    data: { tokens: sessionResult.data, member },
  };
}
