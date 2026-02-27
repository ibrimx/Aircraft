/**
 * P13 — API Guard
 * Provides authenticate, authorize, and authenticateAndAuthorize functions
 * for use in API route handlers.
 * Dependencies: session-types.ts, token-service.ts, permission-resolver.ts, permission-types.ts
 */

import type {
  UserId,
  WorkspaceId,
  ActionPermission,
  ResourceType,
} from '@brimair/shared-types';
import type { TokenPayload, TokenService } from '../session/session-types';
import type { PermissionCheckResult } from '../core/permission-types';
import type { PermissionResolver } from '../core/permission-resolver';

// ─── Types ───────────────────────────────────────────────────

/** Result of an authentication attempt. */
export type AuthResult =
  | { success: true; data: { userId: UserId; workspaceId: WorkspaceId; payload: TokenPayload } }
  | { success: false; error: string };

/** Result of an authorization attempt. */
export type AuthzResult =
  | { success: true; check: PermissionCheckResult }
  | { success: false; error: string; check: PermissionCheckResult };

/** Combined auth result. */
export type FullAuthResult =
  | { success: true; data: { userId: UserId; workspaceId: WorkspaceId; payload: TokenPayload; check: PermissionCheckResult } }
  | { success: false; error: string };

// ─── authenticate ────────────────────────────────────────────

/**
 * Verify a Bearer token and extract user identity.
 * Returns userId, workspaceId, and the full token payload.
 */
export async function authenticate(
  token: string,
  tokenService: TokenService,
): Promise<AuthResult> {
  if (!token || token.trim().length === 0) {
    return { success: false, error: 'Missing or empty authorization token' };
  }

  // Strip "Bearer " prefix if present
  const rawToken = token.startsWith('Bearer ') ? token.slice(7) : token;

  const result = await tokenService.verify(rawToken);

  if (!result.ok) {
    return { success: false, error: typeof result.error === 'string' ? result.error : 'Token verification failed' };
  }

  const payload = result.data;

  return {
    success: true,
    data: {
      userId: payload.sub as UserId,
      workspaceId: payload.wid as WorkspaceId,
      payload,
    },
  };
}

// ─── authorize ───────────────────────────────────────────────

/**
 * Check if a user has permission to perform an action on a resource.
 * Delegates to PermissionResolver.check().
 */
export function authorize(
  userId: UserId,
  workspaceId: WorkspaceId,
  resource: ResourceType,
  action: ActionPermission,
  resourceId: string | null,
  resolver: PermissionResolver,
): AuthzResult {
  const check = resolver.check({
    userId,
    action,
    resource,
    resourceId,
    workspaceId,
  });

  if (check.allowed) {
    return { success: true, check };
  }

  return {
    success: false,
    error: `Permission denied: ${action} on ${resource}${resourceId ? ` (${resourceId})` : ''}`,
    check,
  };
}

// ─── authenticateAndAuthorize ────────────────────────────────

/**
 * Combined: verify token + check permission in a single call.
 * Useful for protected API endpoints that need both auth and authz.
 */
export async function authenticateAndAuthorize(
  token: string,
  resource: ResourceType,
  action: ActionPermission,
  resourceId: string | null,
  tokenService: TokenService,
  resolver: PermissionResolver,
): Promise<FullAuthResult> {
  // 1. Authenticate
  const authResult = await authenticate(token, tokenService);
  if (!authResult.success) {
    return authResult;
  }

  const { userId, workspaceId, payload } = authResult.data;

  // 2. Authorize
  const authzResult = authorize(
    userId,
    workspaceId,
    resource,
    action,
    resourceId,
    resolver,
  );

  if (!authzResult.success) {
    return { success: false, error: authzResult.error };
  }

  return {
    success: true,
    data: { userId, workspaceId, payload, check: authzResult.check },
  };
}
