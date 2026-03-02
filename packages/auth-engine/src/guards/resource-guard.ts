/**
 * P12 — Resource Guard
 * Checks if a user can perform a specific action on a specific resource,
 * independent of routes.
 * Dependencies: permission-types.ts, permission-resolver.ts
 */

import type {
  UserId,
  WorkspaceId,
  ActionPermission,
  ResourceType,
} from '@aircraft/shared-types';
import type {
  PermissionCheckResult,
} from '../core/permission-types';
import type { PermissionResolver } from '../core/permission-resolver';

// ─── Types ───────────────────────────────────────────────────

/** A single permission check descriptor */
export interface ResourceCheck {
  readonly resource: ResourceType;
  readonly action: ActionPermission;
  readonly resourceId: string | null;
}

// ─── Resource Guard ──────────────────────────────────────────

/**
 * Check if a user can perform a specific action on a resource.
 */
export function canAccess(
  userId: UserId,
  workspaceId: WorkspaceId,
  resource: ResourceType,
  action: ActionPermission,
  resourceId: string | null,
  resolver: PermissionResolver,
): PermissionCheckResult {
  return resolver.check({
    userId,
    action,
    resource,
    resourceId,
    workspaceId,
  });
}

/**
 * Batch-check multiple permissions for the same user.
 */
export function canAccessBatch(
  userId: UserId,
  workspaceId: WorkspaceId,
  checks: readonly ResourceCheck[],
  resolver: PermissionResolver,
): PermissionCheckResult[] {
  return checks.map((c) =>
    resolver.check({
      userId,
      action: c.action,
      resource: c.resource,
      resourceId: c.resourceId,
      workspaceId,
    }),
  );
}

/**
 * Filter an array of items to only those the user can access.
 *
 * @param items        - The items to filter.
 * @param getResourceId - Extracts the resourceId from each item.
 * @returns            Only items the user is allowed to access.
 */
export function filterAccessible<T>(
  items: readonly T[],
  userId: UserId,
  workspaceId: WorkspaceId,
  resource: ResourceType,
  action: ActionPermission,
  getResourceId: (item: T) => string,
  resolver: PermissionResolver,
): T[] {
  const checks: ResourceCheck[] = items.map((item) => ({
    resource,
    action,
    resourceId: getResourceId(item),
  }));

  const results = canAccessBatch(
    userId,
    workspaceId,
    checks,
    resolver,
  );

  return items.filter((_, i) => results[i]?.allowed === true);
}
