/**
 * P15 — Members API Routes
 * GET    /api/auth/members              — List workspace members
 * PATCH  /api/auth/members/:memberId    — Update member role
 * DELETE /api/auth/members/:memberId    — Remove member from workspace
 *
 * Dependencies: role-engine.ts, permission-resolver.ts, api-guard.ts
 */

import type {
  PermissionSet,
  SystemPermission,
} from '@brimair/shared-types';
import type { BrimairError } from '@brimair/shared-types';
import { createError, ERROR_CODES } from '@brimair/shared-types';
import type { TokenService, PermissionResolver, SessionManager } from '@brimair/auth-engine';
import { authenticate, authorizeSystem } from '@brimair/auth-engine';

// ─── Types ────────────────────────────────────────────────────

type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

/** Workspace member summary returned by the API */
export interface WorkspaceMemberInfo {
  readonly memberId: string;
  readonly userId: string;
  readonly workspaceId: string;
  readonly roleId: string;
  readonly roleName: string;
  readonly permissions: PermissionSet;
  readonly joinedAt: string;
}

interface UpdateMemberBody {
  readonly roleId?: string;
  readonly permissions?: PermissionSet;
}

/** Abstract member persistence — no direct DB calls. */
export interface MemberStore {
  /** List all members in a workspace. */
  listByWorkspace(workspaceId: string): Promise<WorkspaceMemberInfo[]>;
  /** Find a member by ID. */
  findById(memberId: string): Promise<WorkspaceMemberInfo | null>;
  /** Update a member's role and/or permissions. */
  update(
    memberId: string,
    data: { roleId?: string; permissions?: PermissionSet },
  ): Promise<WorkspaceMemberInfo>;
  /** Remove a member from the workspace. */
  delete(memberId: string): Promise<void>;
}

interface MembersRouteContext {
  readonly tokenService: TokenService;
  readonly resolver: PermissionResolver;
  readonly memberStore: MemberStore;
  readonly sessionManager: SessionManager;
}

// ─── GET /api/auth/members ────────────────────────────────────

/**
 * List all members of the authenticated user's workspace.
 * Requires manage_users system permission.
 */
export async function handleListMembers(
  token: string,
  ctx: MembersRouteContext,
): Promise<Result<{ members: WorkspaceMemberInfo[] }, BrimairError>> {
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

  // 2 — Authorize: must have manage_users system permission
  const perm = authorizeSystem(
    userId,
    workspaceId,
    'manage_users' as SystemPermission,
    ctx.resolver,
  );
  if (!perm.success) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.PERMISSION_DENIED,
        'permission',
        'recoverable',
        'manage_users permission required',
        { userId, workspaceId },
      ),
    };
  }

  // 3 — Fetch members
  try {
    const members = await ctx.memberStore.listByWorkspace(workspaceId as string);
    return { success: true, data: { members } };
  } catch (err) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.PERMISSION_DENIED,
        'permission',
        'recoverable',
        err instanceof Error ? err.message : 'Failed to list members',
        { workspaceId },
      ),
    };
  }
}

// ─── PATCH /api/auth/members/:memberId ────────────────────────

/**
 * Update a member's role or permissions. Requires manage_users system permission.
 */
export async function handleUpdateMember(
  token: string,
  memberId: string,
  body: UpdateMemberBody,
  ctx: MembersRouteContext,
): Promise<Result<{ member: WorkspaceMemberInfo }, BrimairError>> {
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

  // 2 — Authorize: must have manage_users system permission
  const perm = authorizeSystem(
    userId,
    workspaceId,
    'manage_users' as SystemPermission,
    ctx.resolver,
  );
  if (!perm.success) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.PERMISSION_DENIED,
        'permission',
        'recoverable',
        'manage_users permission required',
        { userId, workspaceId },
      ),
    };
  }

  // 3 — Validate body
  if (!body.roleId && !body.permissions) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        'At least one of roleId or permissions must be provided',
        {},
      ),
    };
  }

  // 4 — Verify target member exists
  const existingMember = await ctx.memberStore.findById(memberId);
  if (!existingMember) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        'Member not found',
        { memberId },
      ),
    };
  }

  // 5 — Prevent self role change (safety guard)
  if (existingMember.userId === (userId as string) && body.roleId) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.PERMISSION_DENIED,
        'permission',
        'recoverable',
        'Cannot change your own role',
        { userId, memberId },
      ),
    };
  }

  // 6 — Update member
  try {
    const updatedMember = await ctx.memberStore.update(memberId, {
      roleId: body.roleId,
      permissions: body.permissions,
    });

    return { success: true, data: { member: updatedMember } };
  } catch (err) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.PERMISSION_DENIED,
        'permission',
        'recoverable',
        err instanceof Error ? err.message : 'Failed to update member',
        { memberId },
      ),
    };
  }
}

// ─── DELETE /api/auth/members/:memberId ───────────────────────

/**
 * Remove a member from the workspace. Requires manage_users system permission.
 * Cannot remove self. Ends all sessions for removed member.
 */
export async function handleDeleteMember(
  token: string,
  memberId: string,
  ctx: MembersRouteContext,
): Promise<Result<void, BrimairError>> {
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

  // 2 — Authorize: must have manage_users system permission
  const perm = authorizeSystem(
    userId,
    workspaceId,
    'manage_users' as SystemPermission,
    ctx.resolver,
  );
  if (!perm.success) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.PERMISSION_DENIED,
        'permission',
        'recoverable',
        'manage_users permission required',
        { userId, workspaceId },
      ),
    };
  }

  // 3 — Verify target member exists
  const existingMember = await ctx.memberStore.findById(memberId);
  if (!existingMember) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.AUTH_INVALID_TOKEN,
        'auth',
        'recoverable',
        'Member not found',
        { memberId },
      ),
    };
  }

  // 4 — Prevent self removal
  if (existingMember.userId === (userId as string)) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.PERMISSION_DENIED,
        'permission',
        'recoverable',
        'Cannot remove yourself from the workspace',
        { userId, memberId },
      ),
    };
  }

  // 5 — Remove member and end all sessions
  try {
    await ctx.memberStore.delete(memberId);
    await ctx.sessionManager.revokeAllSessions(existingMember.userId);
    return { success: true, data: undefined };
  } catch (err) {
    return {
      success: false,
      error: createError(
        ERROR_CODES.PERMISSION_DENIED,
        'permission',
        'recoverable',
        err instanceof Error ? err.message : 'Failed to remove member',
        { memberId },
      ),
    };
  }
}
