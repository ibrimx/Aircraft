/**
 * P14 — Invite API Routes
 * POST   /api/auth/invite          — Create invite (admin only)
 * GET    /api/auth/invite/:inviteId — Get invite status
 * DELETE /api/auth/invite/:inviteId — Revoke invite
 *
 * Dependencies: invite-service.ts, api-guard.ts
 */

import type {
  UserId,
  WorkspaceId,
  RoleId,
  InviteId,
  ActionPermission,
  ResourceType,
  Role,
  PermissionSet,
} from '@brimair/shared-types';
import type { BrimairError } from '@brimair/shared-types';
import { createError, ERROR_CODES } from '@brimair/shared-types';
import type { InviteService, TokenService } from '@brimair/auth-engine';
import type { PermissionResolver } from '@brimair/auth-engine';
import { authenticate, authorize } from '@brimair/auth-engine';

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
  readonly inviteService: InviteService;
}

// ─── POST /api/auth/invite ────────────────────────────────────────

/**
 * Create a new workspace invite. Requires manage_invites permission.
 */
export async function handleCreateInvite(
  token: string,
  body: CreateInviteBody,
  ctx: InviteRouteContext,
): Promise<Result<{ inviteId: string; inviteLink: string }, BrimairError>> {
  // 1 — Authenticate
  const authResult = await authenticate(token, ctx.tokenService);
  if (!authResult.success) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        authResult.error ?? 'Authentication failed',
        {},
      ),
    };
  }

  const { userId, workspaceId } = authResult.data;

  // 2 — Authorize: must have manage_invites
  const perm = authorize(
    userId,
    workspaceId,
    'cms_source' as ResourceType,
    'invite' as ActionPermission,
    null,
    ctx.resolver,
  );
  if (!perm.success) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.PERMISSION_DENIED,
        'permission',
        'recoverable',
        'manage_invites permission required',
        { userId, workspaceId },
      ),
    };
  }

  // 3 — Validate body
  if (!body.role) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        'role is required',
        {},
      ),
    };
  }

  // 4 — Create invite
  try {
    const output = await ctx.inviteService.createInvite({
      createdBy: userId as unknown as UserId,
      workspaceId: workspaceId as unknown as WorkspaceId,
      email: body.email ?? null,
      roleId: body.role as unknown as RoleId,
      permissions: body.permissions ?? { system: [], resources: [] },
      expiresInDays: 7,
    });

    return { success: true, data: { inviteId: output.invite.id, inviteLink: output.inviteUrl } };
  } catch (err) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        err instanceof Error ? err.message : 'Invite creation failed',
        {},
      ),
    };
  }
}

// ─── GET /api/auth/invite/:inviteId ───────────────────────────────

/**
 * Get the status of an existing invite. Requires authentication.
 */
export async function handleGetInvite(
  token: string,
  inviteId: string,
  ctx: InviteRouteContext,
): Promise<Result<{ inviteId: string; status: string }, BrimairError>> {
  // Authenticate
  const authResult = await authenticate(token, ctx.tokenService);
  if (!authResult.success) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        authResult.error ?? 'Authentication failed',
        {},
      ),
    };
  }

  const invite = await ctx.inviteService.getInvite(inviteId as unknown as InviteId);
  if (!invite) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        'Invite not found',
        { inviteId },
      ),
    };
  }

  return { success: true, data: { inviteId, status: invite.status } };
}

// ─── DELETE /api/auth/invite/:inviteId ────────────────────────────

/**
 * Revoke an existing invite. Requires authentication.
 */
export async function handleRevokeInvite(
  token: string,
  inviteId: string,
  ctx: InviteRouteContext,
): Promise<Result<void, BrimairError>> {
  // Authenticate
  const authResult = await authenticate(token, ctx.tokenService);
  if (!authResult.success) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        authResult.error ?? 'Authentication failed',
        {},
      ),
    };
  }

  const { userId } = authResult.data;

  try {
    await ctx.inviteService.revokeInvite(
      inviteId as unknown as InviteId,
      userId as unknown as UserId,
    );
    return { success: true, data: undefined };
  } catch (err) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        err instanceof Error ? err.message : 'Revoke failed',
        { inviteId },
      ),
    };
  }
}
