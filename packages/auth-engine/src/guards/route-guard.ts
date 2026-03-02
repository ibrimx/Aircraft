/**
 * P12 — Route Guard
 * Checks if a user can access a specific route based on PROTECTED_ROUTES.
 * Dependencies: permission-types.ts, permission-resolver.ts
 */

import type {
  ActionPermission,
  SystemPermission,
  UserId,
  WorkspaceId,
} from '@aircraft/shared-types';
import type {
  PermissionCheckResult,
  ProtectedRoute,
} from '../core/permission-types';
import { PROTECTED_ROUTES } from '../core/permission-types';
import type { PermissionResolver } from '../core/permission-resolver';
import { toISODateString } from '../core/iso-date';

function isActionPermission(
  permission: ActionPermission | SystemPermission,
): permission is ActionPermission {
  return (
    permission === 'create' ||
    permission === 'read' ||
    permission === 'update' ||
    permission === 'delete' ||
    permission === 'publish' ||
    permission === 'export' ||
    permission === 'share' ||
    permission === 'invite'
  );
}

// ─── Helpers ─────────────────────────────────────────────────

/**
 * Match a concrete path against a route pattern with named params.
 * e.g. '/studio/file_123' matches '/studio/:fileId'
 */
export function matchRoute(path: string): ProtectedRoute | null {
  const normalizedPath = path.replace(/\/+$/, '') || '/';

  for (const route of PROTECTED_ROUTES) {
    const pattern = route.path.replace(/\/+$/, '') || '/';
    const patternParts = pattern.split('/');
    const pathParts = normalizedPath.split('/');

    if (patternParts.length !== pathParts.length) continue;

    let matches = true;
    for (let i = 0; i < patternParts.length; i++) {
      const seg = patternParts[i];
      if (seg.startsWith(':')) continue; // param placeholder — always matches
      if (seg !== pathParts[i]) {
        matches = false;
        break;
      }
    }

    if (matches) return route;
  }

  return null;
}

/**
 * Extract named params from a concrete path given its route pattern.
 * e.g. path='/studio/file_123', pattern='/studio/:fileId' → { fileId: 'file_123' }
 */
export function extractParams(
  path: string,
  pattern: string,
): Record<string, string> {
  const params: Record<string, string> = {};
  const pathParts = path.replace(/\/+$/, '').split('/');
  const patternParts = pattern.replace(/\/+$/, '').split('/');

  for (let i = 0; i < patternParts.length; i++) {
    const seg = patternParts[i];
    if (seg.startsWith(':')) {
      params[seg.slice(1)] = pathParts[i] ?? '';
    }
  }

  return params;
}

// ─── Route Guard ─────────────────────────────────────────────

/**
 * Check if a user can access a specific route.
 *
 * Flow:
 * 1. Match the path against PROTECTED_ROUTES.
 * 2. Extract resourceId from path params if applicable.
 * 3. Delegate to PermissionResolver.check().
 * 4. If route is not in PROTECTED_ROUTES → deny by default.
 */
export function canAccessRoute(
  path: string,
  userId: UserId,
  workspaceId: WorkspaceId,
  params: Record<string, string>,
  resolver: PermissionResolver,
): PermissionCheckResult {
  const route = matchRoute(path);

  if (!route) {
    return {
      allowed: false,
      reason: `Route '${path}' is not in PROTECTED_ROUTES — denied by default`,
      checkedAt: toISODateString(new Date()),
      resource: 'studio_file',
      action: 'read',
      resourceId: null,
    };
  }

  // Merge extracted path params with provided params
  const extractedParams = extractParams(path, route.path);
  const allParams = { ...extractedParams, ...params };

  // Resolve resourceId from params if the route specifies a param name
  const resourceId = route.resourceIdParam
    ? allParams[route.resourceIdParam] ?? null
    : null;

  if (route.requiredResource === null) {
    if (!isActionPermission(route.requiredAction)) {
      return resolver.checkSystem(userId, workspaceId, route.requiredAction);
    }

    return {
      allowed: false,
      reason: `Route '${path}' has no resource for action '${route.requiredAction}'`,
      checkedAt: toISODateString(new Date()),
      resource: 'studio_file',
      action: 'read',
      resourceId: null,
    };
  }

  if (!isActionPermission(route.requiredAction)) {
    return {
      allowed: false,
      reason: `Route '${path}' requires system permission '${route.requiredAction}' with a resource`,
      checkedAt: toISODateString(new Date()),
      resource: route.requiredResource,
      action: 'read',
      resourceId,
    };
  }

  return resolver.check({
    userId,
    action: route.requiredAction,
    resource: route.requiredResource,
    resourceId,
    workspaceId,
  });
}
