import { createHash, randomUUID } from 'node:crypto'
import type { AuthUser, Invite, InviteId, PermissionSet, RoleId, Session, UserId, WorkspaceId } from '@aircraft/shared-types'
import type { PermissionMergeStrategy } from './permission-types'
import type { SessionManager, CreateSessionInput } from '../session/session-types'
import { toISODateString } from './iso-date'

const DEFAULT_EXPIRES_IN_DAYS = 7
const MERGE_STRATEGY: PermissionMergeStrategy = 'role_override'

type PersistableInvite = Invite & { tokenHash: string }

/** Create invite input. */
export type CreateInviteInput = { workspaceId: WorkspaceId; createdBy: UserId; email: string | null; roleId: RoleId; permissions: PermissionSet; expiresInDays: number }
/** Create invite output. */
export type CreateInviteOutput = { invite: Invite; inviteUrl: string; inviteToken: string }
/** Accept invite input. */
export type AcceptInviteInput = { token: string; name: string; password: string }
/** Accept invite output. */
export type AcceptInviteOutput = { user: AuthUser; session: Session }

/** Repository abstraction for invite persistence. */
export interface InviteRepository {
  /** Saves invite. */ save(invite: Invite): Promise<void>
  /** Finds invite by id. */ findById(id: InviteId): Promise<Invite | null>
  /** Finds invite by token hash. */ findByTokenHash(hash: string): Promise<Invite | null>
  /** Lists workspace invites. */ findByWorkspace(workspaceId: WorkspaceId): Promise<Invite[]>
  /** Updates invite. */ update(invite: Invite): Promise<void>
  /** Finds expired invites. */ findExpired(workspaceId: WorkspaceId): Promise<Invite[]>
}

/** Invite service contract used by API layer. */
export interface InviteService {
  /** Creates invite + token. */ createInvite(request: CreateInviteInput): Promise<CreateInviteOutput>
  /** Gets invite by id. */ getInvite(inviteId: InviteId): Promise<Invite | null>
  /** Lists invites for workspace. */ listInvites(workspaceId: WorkspaceId): Promise<Invite[]>
  /** Revokes pending invite. */ revokeInvite(inviteId: InviteId, revokedBy: UserId): Promise<void>
  /** Accepts invite token and returns auth data. */ acceptInvite(request: AcceptInviteInput): Promise<AcceptInviteOutput>
  /** Marks expired invites and returns count. */ cleanExpiredInvites(workspaceId: WorkspaceId): Promise<number>
}

/** Default invite service implementation. */
export class InviteServiceImpl implements InviteService {
  /** Creates service with repository and session manager dependencies. */
  public constructor(
    private readonly repository: InviteRepository,
    private readonly sessionManager: SessionManager,
  ) {}

  /** Creates invite by generating token, hashing it, and storing metadata. */
  public async createInvite(req: CreateInviteInput): Promise<CreateInviteOutput> {
    this.assertCreate(req)
    const inviteId = randomUUID() as InviteId
    const now = new Date(); const expiresAt = new Date(now)
    expiresAt.setDate(now.getDate() + (req.expiresInDays || DEFAULT_EXPIRES_IN_DAYS))
    const inviteToken = this.createJwtLikeToken(inviteId)
    const invite: PersistableInvite = { id: inviteId, workspaceId: req.workspaceId, createdBy: req.createdBy, email: req.email, roleId: req.roleId, permissions: MERGE_STRATEGY === 'role_override' ? req.permissions : req.permissions, expiresAt: toISODateString(expiresAt), status: 'pending', acceptedBy: null, acceptedAt: null, createdAt: toISODateString(now), tokenHash: this.hashToken(inviteToken) }
    await this.repository.save(invite)
    const inviteUrl = `https://aircraft.app/join?token=${encodeURIComponent(inviteToken)}`
    return { invite, inviteUrl, inviteToken }
  }

  /** Reads invite by id. */
  public async getInvite(inviteId: InviteId): Promise<Invite | null> { this.assertText(inviteId, 'inviteId'); return this.repository.findById(inviteId) }
  /** Lists invites for workspace. */
  public async listInvites(workspaceId: WorkspaceId): Promise<Invite[]> { this.assertText(workspaceId, 'workspaceId'); return this.repository.findByWorkspace(workspaceId) }

  /** Revokes pending invite only. */
  public async revokeInvite(inviteId: InviteId, revokedBy: UserId): Promise<void> {
    this.assertText(inviteId, 'inviteId'); this.assertText(revokedBy, 'revokedBy')
    const invite = await this.repository.findById(inviteId)
    if (invite === null) throw new Error('Invite not found')
    if (invite.status !== 'pending') throw new Error('Invite must be pending')
    await this.repository.update({ ...invite, status: 'revoked' })
  }

  /** Validates token, creates user/session via SessionManager, then invalidates invite (single-use). */
  public async acceptInvite(req: AcceptInviteInput): Promise<AcceptInviteOutput> {
    this.assertAccept(req)
    const payload = this.parseToken(req.token)
    if (payload === null) throw new Error('Invite cannot be accepted: invalid_token')
    const invite = await this.repository.findByTokenHash(this.hashToken(req.token))
    if (invite === null || invite.id !== payload.inviteId) throw new Error('Invite cannot be accepted: invalid_token')
    if (invite.status === 'revoked') throw new Error('Invite cannot be accepted: revoked')
    if (invite.status === 'accepted') throw new Error('Invite cannot be accepted: already_accepted')
    if (invite.status !== 'pending') throw new Error('Invite cannot be accepted: invalid_token')
    if (Date.parse(invite.expiresAt) <= Date.now()) throw new Error('Invite cannot be accepted: expired')
    const acceptedBy = randomUUID() as UserId
    await this.repository.update({ ...invite, status: 'accepted', acceptedBy, acceptedAt: toISODateString(new Date()) })
    const user: AuthUser = { id: acceptedBy, email: invite.email ?? `${acceptedBy}@invite.local`, name: req.name, avatarUrl: null, workspaceId: invite.workspaceId, roleId: invite.roleId, permissions: invite.permissions, locale: 'en', createdAt: toISODateString(new Date()) }
    const sessionInput: CreateSessionInput = { userId: acceptedBy as string, workspaceId: invite.workspaceId as string }
    const sessionResult = await this.sessionManager.createSession(sessionInput)
    if (!sessionResult.ok) throw new Error(`Session creation failed: ${sessionResult.error}`)
    const session: Session = sessionResult.data.session
    return { user, session }
  }

  /** Expires pending invites returned by repository query. */
  public async cleanExpiredInvites(workspaceId: WorkspaceId): Promise<number> {
    this.assertText(workspaceId, 'workspaceId')
    const pending = (await this.repository.findExpired(workspaceId)).filter((invite) => invite.status === 'pending')
    await Promise.all(pending.map((invite) => this.repository.update({ ...invite, status: 'expired' })))
    return pending.length
  }

  /** Validates create payload. */
  private assertCreate(req: CreateInviteInput): void {
    this.assertText(req.workspaceId, 'workspaceId'); this.assertText(req.createdBy, 'createdBy'); this.assertText(req.roleId, 'roleId')
    if (req.email !== null && req.email.trim().length === 0) throw new Error('Invalid email')
    if (req.expiresInDays <= 0) throw new Error('expiresInDays must be > 0')
  }
  /** Validates accept payload. */
  private assertAccept(req: AcceptInviteInput): void { this.assertText(req.token, 'token'); this.assertText(req.name, 'name'); this.assertText(req.password, 'password') }
  /** Validates non-empty text fields. */
  private assertText(value: string, field: string): void { if (value.trim().length === 0) throw new Error(`${field} is required`) }
  /** Hashes token with SHA-256. */
  private hashToken(token: string): string { return createHash('sha256').update(token).digest('hex') }
  /** Builds JWT-like token containing inviteId claim. */
  private createJwtLikeToken(inviteId: InviteId): string {
    const header = Buffer.from('{"alg":"none","typ":"JWT"}').toString('base64url')
    const payload = Buffer.from(JSON.stringify({ inviteId })).toString('base64url')
    return `${header}.${payload}.unsigned`
  }
  /** Parses JWT-like token payload. */
  private parseToken(token: string): { inviteId: InviteId } | null {
    const parts = token.split('.'); if (parts.length !== 3) return null
    try { const data = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')) as { inviteId?: unknown }; return typeof data.inviteId === 'string' ? { inviteId: data.inviteId as InviteId } : null } catch { return null }
  }
}
