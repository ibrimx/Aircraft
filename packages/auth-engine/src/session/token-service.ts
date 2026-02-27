/**
 * P11 — Token Service Implementation
 * Generates, verifies, and decodes JWT access/refresh tokens.
 * Dependencies: ids.ts, common.ts, errors.ts, session-types.ts
 */

import { createHmac, randomUUID } from 'node:crypto';
import { createId } from '../types/ids';
import type { SessionId } from '../types/ids';
import type { ISODateString, Result } from '../types/common';
import { createError, ERROR_CODES } from '../types/errors';
import type {
  TokenService,
  TokenPair,
  TokenPayload,
  AccessToken,
  RefreshToken,
} from './session-types';

// ─── Constants ───────────────────────────────────────────────

/** Default access-token lifetime: 15 minutes (in seconds) */
const ACCESS_TOKEN_TTL = 15 * 60;

/** Default refresh-token lifetime: 7 days (in seconds) */
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;

// ─── Helpers ─────────────────────────────────────────────────

/**
 * Minimal Base64-URL encoder (no padding).
 * In production, replace with `jose` or similar JWT library.
 */
function base64url(input: string): string {
  return Buffer.from(input, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function nowEpoch(): number {
  return Math.floor(Date.now() / 1000);
}

function epochToISO(epoch: number): ISODateString {
  return new Date(epoch * 1000).toISOString() as ISODateString;
}

// ─── Token Service ───────────────────────────────────────────

export interface TokenServiceConfig {
  /** Secret used for HMAC signing (swap for RSA/EC in prod) */
  readonly secret: string;
  /** Access-token TTL override (seconds) */
  readonly accessTtl?: number;
  /** Refresh-token TTL override (seconds) */
  readonly refreshTtl?: number;
}

export class TokenServiceImpl implements TokenService {
  private readonly secret: string;
  private readonly accessTtl: number;
  private readonly refreshTtl: number;

  constructor(config: TokenServiceConfig) {
    this.secret = config.secret;
    this.accessTtl = config.accessTtl ?? ACCESS_TOKEN_TTL;
    this.refreshTtl = config.refreshTtl ?? REFRESH_TOKEN_TTL;
  }

  // ── Generate ──────────────────────────────────────────────

  async generate(
    userId: string,
    sessionId: SessionId,
    workspaceId: string,
  ): Promise<Result<TokenPair>> {
    try {
      const now = nowEpoch();
      const accessExp = now + this.accessTtl;

      const payload: TokenPayload = {
        sub: userId,
        sid: sessionId as string,
        wid: workspaceId,
        iat: now,
        exp: accessExp,
      };

      // Simplified JWT: header.payload.signature
      const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const body = base64url(JSON.stringify(payload));
      const signature = base64url(
        createHmac('sha256', this.secret)
          .update(`${header}.${body}`)
          .digest('base64'),
      );

      const accessToken = `${header}.${body}.${signature}` as AccessToken;

      // Refresh token is an opaque random string
      const refreshToken = randomUUID() as RefreshToken;

      const expiresAt = epochToISO(accessExp);

      return { ok: true, data: { accessToken, refreshToken, expiresAt } };
    } catch (err) {
      return {
        ok: false,
        error: createError(
          ERROR_CODES.AUTH_INVALID_TOKEN,
          'auth',
          'error',
          'Failed to generate tokens',
          { userId, sessionId },
        ).message,
      };
    }
  }

  // ── Verify ───────────────────────────────────────────────

  async verify(accessToken: string): Promise<Result<TokenPayload>> {
    try {
      const parts = accessToken.split('.');
      if (parts.length !== 3) {
        return { ok: false, error: 'Malformed token' };
      }

      const [header, body, providedSig] = parts;

      // Recompute signature
      const expectedSig = base64url(
        createHmac('sha256', this.secret)
          .update(`${header}.${body}`)
          .digest('base64'),
      );

      if (providedSig !== expectedSig) {
        return {
          ok: false,
          error: createError(
            ERROR_CODES.AUTH_INVALID_TOKEN,
            'auth',
            'warning',
            'Invalid token signature',
            {},
          ).message,
        };
      }

      const payload: TokenPayload = JSON.parse(
        Buffer.from(body, 'base64').toString('utf-8'),
      );

      // Check expiry
      if (payload.exp < nowEpoch()) {
        return {
          ok: false,
          error: createError(
            ERROR_CODES.AUTH_EXPIRED,
            'auth',
            'info',
            'Token has expired',
            { sid: payload.sid },
          ).message,
        };
      }

      return { ok: true, data: payload };
    } catch {
      return { ok: false, error: 'Token verification failed' };
    }
  }

  // ── Decode (no verification) ─────────────────────────────

  decode(accessToken: string): TokenPayload | null {
    try {
      const body = accessToken.split('.')[1];
      if (!body) return null;
      return JSON.parse(Buffer.from(body, 'base64').toString('utf-8'));
    } catch {
      return null;
    }
  }
}
