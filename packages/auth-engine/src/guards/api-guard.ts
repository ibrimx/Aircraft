/**
 * P13 — API Guard
 * Provides authenticate, authorize, and authenticateAndAuthorize helpers
 * for API routes. Bridges TokenService verification with PermissionResolver checks.
 *
 * Dependencies: session-types.ts (TokenService, TokenPayload),
 *               permission-resolver.ts, permission-types.ts
 */

import type {
  ActionPermission,
  ResourceType,
  UserId,
  WorkspaceId,
} from '@brimair/shared-types';
import type { TokenService, TokenPayload } from '../session/session-types';
import type { PermissionResolver } from '../core/permission-resolver';
import type { PermissionCheckResult } from '../core/permission-types';

// ─── Types ───────────────────────────────────────────────────

/** Authenticated identity extracted from a valid access token. */
export interface AuthIdentity {
  readonly userId: string;
  readonly workspaceId: string;
  readonly sessionId: string;
}

/** Success / failure result for API guard operations. */
export type GuardResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ─── Authenticate ────────────────────────────────────────────

/**
 * Verify an access token and extract the caller's identity.
 *
 * @param token        - Bearer access token from the Authorization header.
 * @param tokenService - Service that verifies JWT signatures and expiry.
 * @returns Identity on success, error message on failure.
 */
export async function authenticate(
  token: string,
  tokenService: TokenService,
): Promise<GuardResult<AuthIdentity>> {
  if (!token || token.trim().length === 0) {
    return { success: false, error: 'Missing access token' };
  }

  const result = await tokenService.verify(token);

  if (!result.ok) {
    return { success: false, error: result.error };
  }

  const payload: TokenPayload = result.data;

  return {
    success: true,
    data: {
      userId: payload.sub,
      workspaceId: payload.wid,
      sessionId: payload.sid,
    },
  };
}

// ─── Authorize ───────────────────────────────────────────────

/**
 * Check whether a user holds a specific permission on a resource.
 *
 * @param userId      - User performing the action.
 * @param workspaceId - Workspace context.
 * @param resource    - Target resource type.
 * @param action      - Required action permission.
 * @param resourceId  - Optional specific resource instance.
 * @param resolver    - Permission resolver that evaluates RBAC rules.
 * @returns Success when allowed, error with denial reason when not.
 */
export function authorize(
  userId: string,
  workspaceId: string,
  resource: ResourceType,
  action: ActionPermission,
  resourceId: string | null,
  resolver: PermissionResolver,
): GuardResult<PermissionCheckResult> {
  const result = resolver.check({
    userId: userId as UserId,
    workspaceId: workspaceId as WorkspaceId,
    action,
    resource,
    resourceId,
  });

  if (result.allowed) {
    return { success: true, data: result };
  }

  return { success: false, error: result.reason };
}

// ─── Authenticate & Authorize (combined) ─────────────────────

/**
 * Convenience helper that authenticates the token AND authorises the
 * action in a single call. Returns the caller identity on success.
 *
 * @param token        - Bearer access token.
 * @param resource     - Target resource type.
 * @param action       - Required action permission.
 * @param resourceId   - Optional specific resource instance.
 * @param tokenService - Token verification service.
 * @param resolver     - Permission resolver.
 * @returns Authenticated identity when both checks pass, error otherwise.
 */
export async function authenticateAndAuthorize(
  token: string,
  resource: ResourceType,
  action: ActionPermission,
  resourceId: string | null,
  tokenService: TokenService,
  resolver: PermissionResolver,
): Promise<GuardResult<AuthIdentity>> {
  const authResult = await authenticate(token, tokenService);
  if (!authResult.success) {
    return authResult;
  }

  const { userId, workspaceId } = authResult.data;

  const permResult = authorize(
    userId,
    workspaceId,
    resource,
    action,
    resourceId,
    resolver,
  );

  if (!permResult.success) {
    return { success: false, error: permResult.error };
  }

  return authResult;
}
