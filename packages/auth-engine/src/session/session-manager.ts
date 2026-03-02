/**
 * P11 — Session Manager Implementation
 * Manages the full session lifecycle: create, refresh, validate, revoke.
 * Dependencies: ids.ts, common.ts, auth-types.ts, errors.ts, session-types.ts, token-service.ts
 */

import { createId } from '@aircraft/shared-types';
import type { SessionId } from '@aircraft/shared-types';
import type { ISODateString, Result, UserId, WorkspaceId } from '@aircraft/shared-types';
import type { Session } from '@aircraft/shared-types';
import { createError, ERROR_CODES } from '@aircraft/shared-types';
import type {
  SessionManager,
  SessionRepository,
  TokenService,
  CreateSessionInput,
  CreateSessionOutput,
  RefreshSessionInput,
  RefreshSessionOutput,
  ValidateSessionInput,
  ValidateSessionOutput,
  RevokeSessionInput,
} from './session-types';

// ─── Implementation ──────────────────────────────────────────

export class SessionManagerImpl implements SessionManager {
  constructor(
    private readonly repo: SessionRepository,
    private readonly tokenService: TokenService,
  ) {}

  private asUserId(value: string): UserId {
    return value as UserId;
  }

  private asWorkspaceId(value: string): WorkspaceId {
    return value as WorkspaceId;
  }

  // ── Create ────────────────────────────────────────────────

  async createSession(
    input: CreateSessionInput,
  ): Promise<Result<CreateSessionOutput>> {
    const sessionId = createId<SessionId>();

    // Generate token pair
    const tokenResult = await this.tokenService.generate(
      input.userId,
      sessionId,
      input.workspaceId,
    );

    if (!tokenResult.ok) {
      return { ok: false, error: tokenResult.error };
    }

    const { accessToken, refreshToken, expiresAt } = tokenResult.data;

    const session: Session = {
      id: sessionId,
      userId: this.asUserId(input.userId),
      workspaceId: this.asWorkspaceId(input.workspaceId),
      token: accessToken as string,
      refreshToken: refreshToken as string,
      expiresAt,
      createdAt: new Date().toISOString() as ISODateString,
    };

    // Persist
    const saveResult = await this.repo.create(session);
    if (!saveResult.ok) {
      return { ok: false, error: saveResult.error };
    }

    return {
      ok: true,
      data: {
        session: saveResult.data,
        tokens: { accessToken, refreshToken, expiresAt },
      },
    };
  }

  // ── Refresh ───────────────────────────────────────────────

  async refreshSession(
    input: RefreshSessionInput,
  ): Promise<Result<RefreshSessionOutput>> {
    // 1. Load existing session
    const findResult = await this.repo.findById(input.sessionId);
    if (!findResult.ok) {
      return { ok: false, error: findResult.error };
    }

    const session = findResult.data;
    if (!session) {
      return {
        ok: false,
        error: createError(
          ERROR_CODES.AUTH_INVALID_TOKEN,
          'auth',
          'recoverable',
          'Session not found',
          { sessionId: input.sessionId },
        ).message,
      };
    }

    // 2. Validate refresh token matches
    if (session.refreshToken !== input.refreshToken) {
      return {
        ok: false,
        error: createError(
          ERROR_CODES.AUTH_INVALID_TOKEN,
          'auth',
          'recoverable',
          'Refresh token mismatch',
          { sessionId: input.sessionId },
        ).message,
      };
    }

    // 3. Generate new token pair
    const tokenResult = await this.tokenService.generate(
      session.userId,
      session.id,
      session.workspaceId,
    );

    if (!tokenResult.ok) {
      return { ok: false, error: tokenResult.error };
    }

    const { accessToken, refreshToken, expiresAt } = tokenResult.data;

    // 4. Persist new tokens
    const updateResult = await this.repo.updateTokens(
      session.id,
      accessToken as string,
      refreshToken as string,
      expiresAt,
    );

    if (!updateResult.ok) {
      return { ok: false, error: updateResult.error };
    }

    return {
      ok: true,
      data: { tokens: { accessToken, refreshToken, expiresAt } },
    };
  }

  // ── Validate ──────────────────────────────────────────────

  async validateSession(
    input: ValidateSessionInput,
  ): Promise<Result<ValidateSessionOutput>> {
    // 1. Verify the access token cryptographically
    const verifyResult = await this.tokenService.verify(input.accessToken);
    if (!verifyResult.ok) {
      return { ok: false, error: verifyResult.error };
    }

    const payload = verifyResult.data;

    // 2. Load the session to ensure it still exists (not revoked)
    const findResult = await this.repo.findById(
      payload.sid as unknown as SessionId,
    );

    if (!findResult.ok) {
      return { ok: false, error: findResult.error };
    }

    const session = findResult.data;
    if (!session) {
      return {
        ok: false,
        error: createError(
          ERROR_CODES.AUTH_EXPIRED,
          'auth',
          'silent',
          'Session has been revoked',
          { sid: payload.sid },
        ).message,
      };
    }

    return { ok: true, data: { session, payload } };
  }

  // ── Revoke (single) ───────────────────────────────────────

  async revokeSession(input: RevokeSessionInput): Promise<Result<void>> {
    return this.repo.delete(input.sessionId);
  }

  // ── Revoke all (e.g. password change) ─────────────────────

  async revokeAllSessions(userId: string): Promise<Result<void>> {
    return this.repo.deleteAllForUser(userId);
  }
}
