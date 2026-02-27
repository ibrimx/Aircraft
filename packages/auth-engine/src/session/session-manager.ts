import { createId } from '@brimair/shared-types'
import type { AuthUser, Session, SessionId, UserId, WorkspaceId } from '@brimair/shared-types'
import type { SessionInfo, SessionStatus, TokenPair, TokenPayload } from './session-types'

interface SessionTokenService {
  /** Create access and refresh tokens for one session. */
  createTokenPair(userId: UserId, workspaceId: WorkspaceId, sessionId: SessionId): Promise<TokenPair>
  /** Verify refresh token and return JWT payload. */
  verifyRefreshToken(token: string): Promise<TokenPayload>
  /** Revoke a token in revocation store. */
  revokeToken(token: string): Promise<void>
}

export interface SessionRepository {
  /** Persist a newly created session. */
  save(session: Session): Promise<void>
  /** Find one session by ID. */
  findById(id: SessionId): Promise<Session | null>
  /** Find sessions belonging to one user. */
  findByUserId(userId: UserId): Promise<Session[]>
  /** Update persisted session. */
  update(session: Session): Promise<void>
  /** Delete session by ID. */
  delete(id: SessionId): Promise<void>
}

export interface SessionManager {
  /** Create a session and token pair for user. */
  createSession(user: AuthUser): Promise<SessionInfo>
  /** Get one session by ID. */
  getSession(sessionId: SessionId): Promise<SessionInfo | null>
  /** Refresh tokens with refresh token validation. */
  refreshSession(refreshToken: string): Promise<TokenPair>
  /** Revoke one session. */
  revokeSession(sessionId: SessionId): Promise<void>
  /** Revoke all user sessions and return count. */
  revokeAllSessions(userId: UserId): Promise<number>
  /** Return currently active sessions for user. */
  getActiveSessions(userId: UserId): Promise<SessionInfo[]>
}

export class SessionManagerImpl implements SessionManager {
  private readonly users = new Map<UserId, AuthUser>()
  private readonly sessionUsers = new Map<SessionId, UserId>()

  /** Build manager with token service and repository dependencies. */
  constructor(private readonly tokenService: SessionTokenService, private readonly repository: SessionRepository) {}

  /** Create and store session with hashed token values. */
  async createSession(user: AuthUser): Promise<SessionInfo> {
    const sessionId = createId<SessionId>()
    const tokenPair = await this.tokenService.createTokenPair(user.id, user.workspaceId, sessionId)
    const session: Session = {
      id: sessionId,
      userId: user.id,
      workspaceId: user.workspaceId,
      token: await this.hashToken(tokenPair.accessToken),
      refreshToken: await this.hashToken(tokenPair.refreshToken),
      expiresAt: tokenPair.refreshExpiresAt,
      createdAt: new Date().toISOString(),
    }
    await this.repository.save(session)
    this.users.set(user.id, user)
    this.sessionUsers.set(session.id, user.id)
    return { session, status: 'active', user }
  }

  /** Find session and return computed status. */
  async getSession(sessionId: SessionId): Promise<SessionInfo | null> {
    const session = await this.repository.findById(sessionId)
    if (!session) return null
    const userId = this.sessionUsers.get(session.id)
    const user = userId ? this.users.get(userId) : null
    return user ? { session, status: this.resolveStatus(session), user } : null
  }

  /** Verify refresh token then rotate token pair for same session. */
  async refreshSession(refreshToken: string): Promise<TokenPair> {
    const payload = await this.tokenService.verifyRefreshToken(refreshToken)
    const session = await this.repository.findById(payload.sessionId)
    if (!session) throw new Error('Session not found')
    if (this.resolveStatus(session) !== 'active') throw new Error('Session is not active')
    const tokenPair = await this.tokenService.createTokenPair(payload.userId, payload.workspaceId, payload.sessionId)
    await this.repository.update({ ...session, token: await this.hashToken(tokenPair.accessToken), refreshToken: await this.hashToken(tokenPair.refreshToken), expiresAt: tokenPair.refreshExpiresAt })
    await this.tokenService.revokeToken(refreshToken)
    return tokenPair
  }

  /** Revoke session by persisting revoked state marker. */
  async revokeSession(sessionId: SessionId): Promise<void> {
    const session = await this.repository.findById(sessionId)
    if (!session) return
    await this.repository.update({ ...session, token: 'revoked', refreshToken: 'revoked' })
  }

  /** Revoke all active sessions for one user. */
  async revokeAllSessions(userId: UserId): Promise<number> {
    const sessions = await this.repository.findByUserId(userId)
    let revokedCount = 0
    for (const session of sessions) {
      if (this.resolveStatus(session) === 'active') { await this.revokeSession(session.id); revokedCount += 1 }
    }
    return revokedCount
  }

  /** Return active sessions for one user. */
  async getActiveSessions(userId: UserId): Promise<SessionInfo[]> {
    const sessions = await this.repository.findByUserId(userId)
    const user = this.users.get(userId)
    if (!user) return []
    return sessions.filter((s) => this.resolveStatus(s) === 'active').map((session) => ({ session, status: 'active', user }))
  }

  /** Resolve session status from expiry/revoked markers. */
  private resolveStatus(session: Session): SessionStatus {
    if (session.token === 'revoked' || session.refreshToken === 'revoked') return 'revoked'
    return new Date(session.expiresAt).getTime() <= Date.now() ? 'expired' : 'active'
  }

  /** Hash token value using SHA-256 before persistence. */
  private async hashToken(value: string): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
  }
}
