import { createHash, randomBytes } from 'node:crypto'

import type { Invite, InviteId } from '@brimair/shared-types'
import type { PermissionMergeStrategy } from './permission-types'

const VALIDATOR_STRATEGY: PermissionMergeStrategy = 'role_override'

type InviteTokenPayload = { inviteId: string }

/** أسباب رفض التحقق من الدعوة. */
export type InviteRejectionReason =
  | 'invalid_token'
  | 'expired'
  | 'revoked'
  | 'already_accepted'
  | 'email_mismatch'

/** نتيجة التحقق من token الدعوة. */
export type InviteValidationResult =
  | { valid: true; invite: Invite }
  | { valid: false; reason: InviteRejectionReason }

/** Repository contract needed by validator. */
export interface InviteValidationRepository {
  /** Finds invite by id. */
  findById(id: InviteId): Promise<Invite | null>
  /** Finds invite by hashed token. */
  findByTokenHash(hash: string): Promise<Invite | null>
}

/** Validator for invite tokens lifecycle rules. */
export class InviteValidator {
  /** Creates validator with repository dependency. */
  public constructor(private readonly repository: InviteValidationRepository) {}

  /** Validates token format, hash match, status, and expiry. */
  public async validateToken(token: string): Promise<InviteValidationResult> {
    if (VALIDATOR_STRATEGY !== 'role_override') {
      return { valid: false, reason: 'invalid_token' }
    }
    const payload = this.parseTokenPayload(token)
    if (payload === null || payload.inviteId.length === 0) {
      return { valid: false, reason: 'invalid_token' }
    }
    const inviteId = payload.inviteId as InviteId
    const byHash = await this.repository.findByTokenHash(this.hashToken(token))
    if (byHash === null || byHash.id !== inviteId) {
      return { valid: false, reason: 'invalid_token' }
    }
    const invite = await this.repository.findById(inviteId)
    if (invite === null || invite.id !== byHash.id) {
      return { valid: false, reason: 'invalid_token' }
    }
    if (invite.status === 'revoked') return { valid: false, reason: 'revoked' }
    if (invite.status === 'accepted') {
      return { valid: false, reason: 'already_accepted' }
    }
    if (invite.status !== 'pending') {
      return { valid: false, reason: 'invalid_token' }
    }
    if (Date.parse(invite.expiresAt) <= Date.now()) {
      return { valid: false, reason: 'expired' }
    }
    return { valid: true, invite }
  }

  /** Hashes token with SHA-256. */
  public hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }

  /** Generates a secure random token. */
  public generateToken(): string {
    return randomBytes(32).toString('hex')
  }

  /** Parses JWT-like payload and extracts inviteId. */
  private parseTokenPayload(token: string): InviteTokenPayload | null {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    try {
      const text = Buffer.from(parts[1], 'base64url').toString('utf8')
      const data = JSON.parse(text) as Record<string, unknown>
      return typeof data.inviteId === 'string' ? { inviteId: data.inviteId } : null
    } catch {
      return null
    }
  }
}
