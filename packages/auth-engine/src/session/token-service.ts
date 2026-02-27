import type { ISODateString, SessionId, UserId, WorkspaceId } from '@brimair/shared-types'
import { jwtVerify, SignJWT } from 'jose'
import { DEFAULT_SESSION_CONFIG, type SessionConfig, type TokenPair, type TokenPayload } from './session-types'

export interface RevokedTokenStore {
  /** Add a revoked token hash until expiry. */
  add(tokenHash: string, expiresAt: ISODateString): Promise<void>
  /** Check if token hash is revoked. */
  isRevoked(tokenHash: string): Promise<boolean>
  /** Remove expired hashes and return deleted count. */
  cleanup(): Promise<number>
}

export interface TokenService {
  /** Create access/refresh token pair for a session. */
  createTokenPair(userId: UserId, workspaceId: WorkspaceId, sessionId: SessionId): Promise<TokenPair>
  /** Verify access token and return payload. */
  verifyAccessToken(token: string): Promise<TokenPayload>
  /** Verify refresh token and return payload. */
  verifyRefreshToken(token: string): Promise<TokenPayload>
  /** Revoke token using hash-based storage. */
  revokeToken(token: string): Promise<void>
}

export class TokenError extends Error {
  constructor(
    public readonly code: 'TOKEN_EXPIRED' | 'TOKEN_INVALID' | 'TOKEN_REVOKED' | 'TOKEN_TYPE_MISMATCH',
    message: string,
  ) {
    super(message)
    this.name = 'TokenError'
  }
}

class InMemoryRevokedTokenStore implements RevokedTokenStore {
  private readonly tokens = new Map<string, ISODateString>()

  /** Store revoked hash until expiry. */
  async add(tokenHash: string, expiresAt: ISODateString): Promise<void> { this.tokens.set(tokenHash, expiresAt) }
  /** Resolve revocation state and lazily prune expired entries. */
  async isRevoked(tokenHash: string): Promise<boolean> {
    const expiresAt = this.tokens.get(tokenHash)
    if (!expiresAt) return false
    if (new Date(expiresAt).getTime() <= Date.now()) { this.tokens.delete(tokenHash); return false }
    return true
  }
  /** Remove expired revoked tokens. */
  async cleanup(): Promise<number> {
    let removed = 0
    const now = Date.now()
    for (const [tokenHash, expiresAt] of this.tokens.entries()) {
      if (new Date(expiresAt).getTime() <= now) { this.tokens.delete(tokenHash); removed += 1 }
    }
    return removed
  }
}

export class TokenServiceImpl implements TokenService {
  private readonly config: SessionConfig
  private readonly secret: Uint8Array
  private readonly revokedTokenStore: RevokedTokenStore

  /** Initialize JOSE token service. */
  constructor(config: SessionConfig) {
    this.config = { ...DEFAULT_SESSION_CONFIG, ...config }
    this.secret = new TextEncoder().encode(this.config.jwtSecret)
    this.revokedTokenStore = new InMemoryRevokedTokenStore()
  }

  /** Issue access and refresh JWT tokens. */
  async createTokenPair(userId: UserId, workspaceId: WorkspaceId, sessionId: SessionId): Promise<TokenPair> {
    const iat = Math.floor(Date.now() / 1000)
    const accessExp = iat + this.config.accessTokenTTL
    const refreshExp = iat + this.config.refreshTokenTTL
    const accessToken = await this.createSignedToken({ userId, workspaceId, sessionId, type: 'access', iat, exp: accessExp })
    const refreshToken = await this.createSignedToken({ userId, workspaceId, sessionId, type: 'refresh', iat, exp: refreshExp })
    return {
      accessToken,
      refreshToken,
      accessExpiresAt: new Date(accessExp * 1000).toISOString(),
      refreshExpiresAt: new Date(refreshExp * 1000).toISOString(),
    }
  }

  /** Verify access token and enforce token type. */
  async verifyAccessToken(token: string): Promise<TokenPayload> { return this.verifyTokenByType(token, 'access') }
  /** Verify refresh token and enforce token type. */
  async verifyRefreshToken(token: string): Promise<TokenPayload> { return this.verifyTokenByType(token, 'refresh') }

  /** Revoke token by saving a SHA-256 hash and token expiry. */
  async revokeToken(token: string): Promise<void> {
    const payload = await this.decodeToken(token)
    await this.revokedTokenStore.add(await hashToken(token), new Date(payload.exp * 1000).toISOString())
  }

  /** Create a signed HS256 JWT with configured issuer. */
  private async createSignedToken(payload: TokenPayload): Promise<string> {
    return new SignJWT({ userId: payload.userId, workspaceId: payload.workspaceId, sessionId: payload.sessionId, type: payload.type })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer(this.config.jwtIssuer)
      .setIssuedAt(payload.iat)
      .setExpirationTime(payload.exp)
      .sign(this.secret)
  }

  /** Verify token validity, revocation state, and expected type. */
  private async verifyTokenByType(token: string, expectedType: 'access' | 'refresh'): Promise<TokenPayload> {
    const payload = await this.decodeToken(token)
    if (await this.revokedTokenStore.isRevoked(await hashToken(token))) throw new TokenError('TOKEN_REVOKED', 'Token is revoked')
    if (payload.type !== expectedType) throw new TokenError('TOKEN_TYPE_MISMATCH', `Expected ${expectedType} token`)
    return payload
  }

  /** Decode and validate JWT claims shape. */
  private async decodeToken(token: string): Promise<TokenPayload> {
    try {
      const { payload } = await jwtVerify(token, this.secret, { issuer: this.config.jwtIssuer })
      if (typeof payload.userId !== 'string' || typeof payload.workspaceId !== 'string' || typeof payload.sessionId !== 'string' || (payload.type !== 'access' && payload.type !== 'refresh') || typeof payload.iat !== 'number' || typeof payload.exp !== 'number') {
        throw new TokenError('TOKEN_INVALID', 'Token payload is invalid')
      }
      return {
        userId: payload.userId as UserId,
        workspaceId: payload.workspaceId as WorkspaceId,
        sessionId: payload.sessionId as SessionId,
        type: payload.type,
        iat: payload.iat,
        exp: payload.exp,
      }
    } catch (error) {
      if (error instanceof TokenError) throw error
      if (error instanceof Error && error.name === 'JWTExpired') throw new TokenError('TOKEN_EXPIRED', 'Token has expired')
      throw new TokenError('TOKEN_INVALID', 'Token is invalid')
    }
  }
}

const hashToken = async (token: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))
  return [...new Uint8Array(digest)].map((v) => v.toString(16).padStart(2, '0')).join('')
}
