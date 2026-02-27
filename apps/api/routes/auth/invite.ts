/**
 * P14 — Invite API Routes
 * POST   /api/auth/invite          — Create invite (admin only)
 * GET    /api/auth/invite/:inviteId — Get invite status
 * DELETE /api/auth/invite/:inviteId — Revoke invite
 *
 * Dependencies: invite-service.ts, api-guard.ts
 */

import type { ISODateString } from '@brimair/shared-types';
import type {
  Role,
  PermissionSet,
  InviteToken,
  InviteStatus,
} from '@brimair/shared-types';
import type { BrimairError } from '@brimair/shared-types';
import { createError, ERROR_CODES } from '@brimair/shared-types';
import type { InviteStore } from '@brimair/auth-engine';
import { InviteService } from '@brimair/auth-engine';
import { authenticate, authorize } from '@brimair/auth-engine';
import type { TokenService } from '@brimair/auth-engine';
import type { PermissionResolver, MemberStore } from '@brimair/auth-engine';

// ─── Types ────────────────────────────────────────────────────────

type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

interface CreateInviteBody {
  readonly email?: string;
  readonly role: Role;
  readonly permissions?: PermissionSet;
}

interface InviteRouteContext {
  readonly tokenService: TokenService;
  readonly resolver: PermissionResolver;
  readonly memberStore: MemberStore;
  readonly inviteStore: InviteStore;
  readonly inviteService: InviteService;
}

// ─── POST /api/auth/invite ────────────────────────────────────────

/**
 * Create a new workspace invite. Requires manage_invites permission.
 */
export function handleCreateInvite(
  token: string,
  body: CreateInviteBody,
  ctx: InviteRouteContext,
): Result<{ invite: InviteToken; inviteLink: string }, BrimairError> {
  // 1 — Authenticate
  const authResult = authenticate(token, ctx.tokenService);
  if (!authResult.success) return authResult;

  const { userId, workspaceId } = authResult.data;

  // 2 — Authorize: must have manage_invites
  const perm = authorize(
    userId,
    workspaceId,
    'cms_source' as any,
    'invite' as any,
    null,
    ctx.resolver,
    ctx.memberStore,
  );
  if (!perm.allowed) {
    return {
      success: false,
      error: createError(ERROR_CODES.AUTH_FORBIDDEN, 'manage_invites permission required'),
    };
  }

  // 3 — Validate body
  if (!body.role) {
    return {
      success: false,
      error: createError(ERROR_CODES.AUTH_INVITE_INVALID, 'role is required'),
    };
  }

  // 4 — Create invite
  const result = ctx.inviteService.createInvite({
    createdBy: userId as any,
    workspaceId: workspaceId as any,
    email: body.email ?? null,
    role: body.role,
    permissions: body.permissions,
  });

  if (!result.success) return result;

  const invite = result.data;
  const inviteLink = `/join/${invite.inviteId}`;

  return { success: true, data: { invite, inviteLink } };
}

// ─── GET /api/auth/invite/:inviteId ───────────────────────────────

/**
 * Get the status of an existing invite. Requires manage_invites permission.
 */
export function handleGetInvite(
  token: string,
  inviteId: string,
  ctx: InviteRouteContext,
): Result<{ inviteId: string; status: InviteStatus }, BrimairError> {
  // Authenticate
  const authResult = authenticate(token, ctx.tokenService);
  if (!authResult.success) return authResult;

  const status = ctx.inviteService.getInviteStatus(inviteId as any);

  return { success: true, data: { inviteId, status } };
}

// ─── DELETE /api/auth/invite/:inviteId ────────────────────────────

/**
 * Revoke an existing invite. Requires manage_invites permission.
 */
export function handleRevokeInvite(
  token: string,
  inviteId: string,
  ctx: InviteRouteContext,
): Result<void, BrimairError> {
  // Authenticate
  const authResult = authenticate(token, ctx.tokenService);
  if (!authResult.success) return authResult;

  const { userId } = authResult.data;

  return ctx.inviteService.revokeInvite(inviteId as any, userId as any);
}
