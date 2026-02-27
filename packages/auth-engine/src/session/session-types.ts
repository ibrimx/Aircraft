/**
 * P11 — Session Types
 * Defines session-related types, repository interface, and service contracts.
 * Dependencies: ids.ts, common.ts, auth-types.ts, errors.ts
 */

import type { SessionId } from '@brimair/shared-types';
import type { ISODateString, Result } from '@brimair/shared-types';
import type { Session } from '@brimair/shared-types';

// ─── Token Types ─────────────────────────────────────────────

/** Branded type for access tokens */
export type AccessToken = string & { readonly __brand: 'access-token' };

/** Branded type for refresh tokens */
export type RefreshToken = string & { readonly __brand: 'refresh-token' };

/** Payload encoded inside a JWT access token */
export interface TokenPayload {
  readonly sub: string;        // userId
  readonly sid: string;        // sessionId
  readonly wid: string;        // workspaceId
  readonly iat: number;        // issued at (epoch seconds)
  readonly exp: number;        // expires at (epoch seconds)
}

/** Pair returned after token generation */
export interface TokenPair {
  readonly accessToken: AccessToken;
  readonly refreshToken: RefreshToken;
  readonly expiresAt: ISODateString;
}

// ─── Session Service Inputs / Outputs ────────────────────────

export interface CreateSessionInput {
  readonly userId: string;
  readonly workspaceId: string;
}

export interface CreateSessionOutput {
  readonly session: Session;
  readonly tokens: TokenPair;
}

export interface RefreshSessionInput {
  readonly sessionId: SessionId;
  readonly refreshToken: string;
}

export interface RefreshSessionOutput {
  readonly tokens: TokenPair;
}

export interface ValidateSessionInput {
  readonly accessToken: string;
}

export interface ValidateSessionOutput {
  readonly session: Session;
  readonly payload: TokenPayload;
}

export interface RevokeSessionInput {
  readonly sessionId: SessionId;
}

// ─── Session Repository ──────────────────────────────────────

/** Abstract persistence layer for sessions */
export interface SessionRepository {
  /** Persist a new session record */
  create(session: Session): Promise<Result<Session>>;

  /** Find a session by its ID */
  findById(id: SessionId): Promise<Result<Session | null>>;

  /** Find all active sessions for a user in a workspace */
  findByUser(userId: string, workspaceId: string): Promise<Result<Session[]>>;

  /** Update the token + expiry after a refresh */
  updateTokens(
    id: SessionId,
    token: string,
    refreshToken: string,
    expiresAt: ISODateString,
  ): Promise<Result<Session>>;

  /** Delete a session (revoke) */
  delete(id: SessionId): Promise<Result<void>>;

  /** Delete all sessions for a user (e.g. password change) */
  deleteAllForUser(userId: string): Promise<Result<void>>;
}

// ─── Service Interfaces ──────────────────────────────────────

/** Generates and validates JWT tokens */
export interface TokenService {
  generate(userId: string, sessionId: SessionId, workspaceId: string): Promise<Result<TokenPair>>;
  verify(accessToken: string): Promise<Result<TokenPayload>>;
  decode(accessToken: string): TokenPayload | null;
}

/** Manages full session lifecycle */
export interface SessionManager {
  createSession(input: CreateSessionInput): Promise<Result<CreateSessionOutput>>;
  refreshSession(input: RefreshSessionInput): Promise<Result<RefreshSessionOutput>>;
  validateSession(input: ValidateSessionInput): Promise<Result<ValidateSessionOutput>>;
  revokeSession(input: RevokeSessionInput): Promise<Result<void>>;
  revokeAllSessions(userId: string): Promise<Result<void>>;
}
