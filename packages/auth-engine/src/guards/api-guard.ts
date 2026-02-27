/**
 * P13 — API Guard
 * High-level authentication and authorization helpers for API route handlers.
 * Wraps TokenService.verify and PermissionResolver.check into a simple
 * success/failure API consumed by all route handlers.
 *
 * Dependencies: session-types.ts (TokenService, TokenPayload),
 *              permission-resolver.ts (PermissionResolver),
 *              permission-types.ts (PermissionCheckRequest, PermissionCheckResult)
 */

import type { UserId, WorkspaceId, ActionPermission, ResourceType } from '@brimair/shared-types'
import type { TokenService } from '../session/session-types'
import type { PermissionResolver } from '../core/permission-resolver'
import type { PermissionCheckResult } from '../core/permission-types'

// ─── Result Types ─────────────────────────────────────────────

/** Successful authentication result containing user identity. */
export type AuthSuccess = {
  readonly success: true
  readonly data: { readonly userId: string; readonly workspaceId: string }
}

/** Failed authentication result with error message. */
export type AuthFailure = {
  readonly success: false
  readonly error: string
}

/** Authentication result union. */
export type AuthResult = AuthSuccess | AuthFailure

/** Successful authorization result containing permission check data. */
export type AuthzSuccess = {
  readonly success: true
  readonly data: PermissionCheckResult
}

/** Failed authorization result with error message. */
export type AuthzFailure = {
  readonly success: false
  readonly error: string
}

/** Authorization result union. */
export type AuthzResult = AuthzSuccess | AuthzFailure

// ─── authenticate ─────────────────────────────────────────────

/**
 * Verifies a bearer token and extracts user identity.
 * Returns userId and workspaceId on success, or an error string on failure.
 */
export async function authenticate(
  token: string,
  tokenService: TokenService,
): Promise<AuthResult> {
  if (!token || token.trim().length === 0) {
    return { success: false, error: 'Token is required' }
  }

  const result = await tokenService.verify(token)

  if (!result.ok) {
    return { success: false, error: result.error ?? 'Invalid or expired token' }
  }

  return {
    success: true,
    data: {
      userId: result.data.sub,
      workspaceId: result.data.wid,
    },
  }
}

// ─── authorize ────────────────────────────────────────────────

/**
 * Checks whether a user has the required permission on a resource.
 * Delegates to PermissionResolver.check() for the actual RBAC evaluation.
 */
export function authorize(
  userId: string,
  workspaceId: string,
  resource: ResourceType,
  action: ActionPermission,
  resourceId: string | null,
  resolver: PermissionResolver,
): AuthzResult {
  const result = resolver.check({
    userId: userId as UserId,
    workspaceId: workspaceId as WorkspaceId,
    resource,
    action,
    resourceId,
  })

  if (!result.allowed) {
    return { success: false, error: result.reason ?? 'Permission denied' }
  }

  return { success: true, data: result }
}

// ─── authenticateAndAuthorize ─────────────────────────────────

/**
 * Convenience helper that authenticates a token and then checks authorization
 * in a single call. Returns the authorization result or the first failure.
 */
export async function authenticateAndAuthorize(
  token: string,
  resource: ResourceType,
  action: ActionPermission,
  resourceId: string | null,
  tokenService: TokenService,
  resolver: PermissionResolver,
): Promise<AuthzResult> {
  const auth = await authenticate(token, tokenService)
  if (!auth.success) {
    return { success: false, error: auth.error }
  }

  return authorize(
    auth.data.userId,
    auth.data.workspaceId,
    resource,
    action,
    resourceId,
    resolver,
  )
}
