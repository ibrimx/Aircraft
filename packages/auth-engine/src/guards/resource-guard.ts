/**
 * P12 — Resource Guard
 * Checks if a user can perform a specific action on a specific resource,
 * independent of routes.
 * Dependencies: permission-types.ts, permission-resolver.ts
 */

import type {
  PermissionCheckResult,
} from '../core/permission-types';
import type { MemberStore } from '../core/permission-resolver';
import { PermissionResolver } from '../core/permission-resolver';

// ─── Types ───────────────────────────────────────────────────

/** A single permission check descriptor */
export interface ResourceCheck {
  readonly resource: string;
  readonly action: string;
  readonly resourceId: string | null;
}

// ─── Resource Guard ──────────────────────────────────────────

/**
 * Check if a user can perform a specific action on a resource.
 */
export function canAccess(
  userId: string,
  workspaceId: string,
  resource: string,
  action: string,
  resourceId: string | null,
  resolver: PermissionResolver,
  memberStore: MemberStore,
): PermissionCheckResult {
  return resolver.check(
    {
      userId: userId as any,
      action: action as any,
      resource: resource as any,
      resourceId,
      workspaceId: workspaceId as any,
    },
    memberStore,
  );
}

/**
 * Batch-check multiple permissions for the same user.
 * Optimised: loads the member once via PermissionResolver.checkBatch().
 */
export function canAccessBatch(
  userId: string,
  workspaceId: string,
  checks: readonly ResourceCheck[],
  resolver: PermissionResolver,
  memberStore: MemberStore,
): PermissionCheckResult[] {
  const requests = checks.map((c) => ({
    userId: userId as any,
    action: c.action as any,
    resource: c.resource as any,
    resourceId: c.resourceId,
    workspaceId: workspaceId as any,
  }));

  return resolver.checkBatch(requests, memberStore);
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
  userId: string,
  workspaceId: string,
  resource: string,
  action: string,
  getResourceId: (item: T) => string,
  resolver: PermissionResolver,
  memberStore: MemberStore,
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
    memberStore,
  );

  return items.filter((_, i) => results[i]?.allowed === true);
}
