import type { AuthUser, ISODateString, Session, SessionId, UserId, WorkspaceId } from '@brimair/shared-types'

export type TokenPair = {
  accessToken: string
  refreshToken: string
  accessExpiresAt: ISODateString
  refreshExpiresAt: ISODateString
}

export type TokenPayload = {
  userId: UserId
  workspaceId: WorkspaceId
  sessionId: SessionId
  type: 'access' | 'refresh'
  iat: number
  exp: number
}

export type SessionConfig = {
  accessTokenTTL: number
  refreshTokenTTL: number
  jwtSecret: string
  jwtIssuer: string
}

export type SessionStatus = 'active' | 'expired' | 'revoked'

export type SessionInfo = {
  session: Session
  status: SessionStatus
  user: AuthUser
}

export const DEFAULT_SESSION_CONFIG: Omit<SessionConfig, 'jwtSecret'> = {
  accessTokenTTL: 604800,
  refreshTokenTTL: 2592000,
  jwtIssuer: 'brimair',
}
