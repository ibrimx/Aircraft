import type {
  ActionPermission,
  AuthUser,
  ResourcePermission,
  ResourceType,
  SystemPermission,
  UserId,
} from '@brimair/shared-types'
import type { PermissionCheckRequest, PermissionCheckResult } from './permission-types'

/** Debug payload that explains one permission resolution decision. */
export type PermissionExplanation = {
  allowed: boolean
  reason: string
  matchedRule: ResourcePermission | null
  checkedRules: number
}

/**
 * Error thrown when a required permission is missing.
 */
export class PermissionDeniedError extends Error {
  public readonly code = 'PERMISSION_DENIED' as const

  /**
   * Builds a typed permission denial error with full check context.
   */
  public constructor(
    public readonly userId: UserId,
    public readonly action: ActionPermission | SystemPermission,
    public readonly resource: ResourceType | null,
    public readonly resourceId: string | null,
  ) {
    super(
      `Permission denied: user=${userId}, action=${action}, resource=${resource ?? 'system'}, resourceId=${resourceId ?? 'all'}`,
    )
    this.name = 'PermissionDeniedError'
  }
}

/** Core contract used to answer all RBAC authorization questions. */
export interface PermissionResolver {
  /** Returns true only when there is an explicit matching resource rule. */
  can(user: AuthUser, action: ActionPermission, resource: ResourceType, resourceId?: string): boolean
  /** Returns true only when the explicit system permission exists. */
  canSystem(user: AuthUser, permission: SystemPermission): boolean
  /** Throws when user lacks the requested resource permission. */
  assert(user: AuthUser, action: ActionPermission, resource: ResourceType, resourceId?: string): void
  /** Throws when user lacks the requested system permission. */
  assertSystem(user: AuthUser, permission: SystemPermission): void
  /** Returns a new array that keeps only items readable by user. */
  filter<T extends { id: string }>(user: AuthUser, resource: ResourceType, items: T[]): T[]
  /** Evaluates one request and returns a full structured result with timestamp. */
  check(request: PermissionCheckRequest): PermissionCheckResult
  /** Returns a debug explanation for why a permission is allowed/denied. */
  explain(user: AuthUser, action: ActionPermission, resource: ResourceType, resourceId?: string): PermissionExplanation
}

/**
 * Default permission resolver implementation.
 * DENY BY DEFAULT: anything not explicitly granted is denied.
 */
export class PermissionResolverImpl implements PermissionResolver {
  /**
   * Creates resolver with optional user lookup for check(request).
   */
  public constructor(private readonly getUserById: (userId: UserId) => AuthUser | null = () => null) {}

  /**
   * Returns true only when a matching explicit resource permission rule exists.
   */
  public can(user: AuthUser, action: ActionPermission, resource: ResourceType, resourceId?: string): boolean {
    const requestedResourceId = resourceId ?? null

    for (const rule of user.permissions.resources) {
      if (rule.resource !== resource) continue

      const matchesResourceId = rule.resourceId === null || rule.resourceId === requestedResourceId
      if (!matchesResourceId) continue

      if (rule.actions.includes(action)) return true
    }

    return false
  }

  /**
   * Returns true only when permission is explicitly present in system permissions.
   */
  public canSystem(user: AuthUser, permission: SystemPermission): boolean {
    return user.permissions.system.includes(permission)
  }

  /**
   * Asserts resource permission and throws PermissionDeniedError on denial.
   */
  public assert(user: AuthUser, action: ActionPermission, resource: ResourceType, resourceId?: string): void {
    if (!this.can(user, action, resource, resourceId)) {
      throw new PermissionDeniedError(user.id, action, resource, resourceId ?? null)
    }
  }

  /**
   * Asserts system permission and throws PermissionDeniedError on denial.
   */
  public assertSystem(user: AuthUser, permission: SystemPermission): void {
    if (!this.canSystem(user, permission)) {
      throw new PermissionDeniedError(user.id, permission, null, null)
    }
  }

  /**
   * Returns a new array with items that pass read permission checks for their id.
   */
  public filter<T extends { id: string }>(user: AuthUser, resource: ResourceType, items: T[]): T[] {
    return items.filter((item) => this.can(user, 'read', resource, item.id))
  }

  /**
   * Evaluates a single PermissionCheckRequest and returns detailed result metadata.
   */
  public check(request: PermissionCheckRequest): PermissionCheckResult {
    const user = this.getUserById(request.userId)
    const allowed =
      user !== null ? this.can(user, request.action, request.resource, request.resourceId ?? undefined) : false

    const reason =
      user === null
        ? 'DENY_BY_DEFAULT: user not found for permission check'
        : allowed
          ? 'ALLOWED: explicit resource permission matched'
          : 'DENY_BY_DEFAULT: no explicit matching resource permission rule'

    return {
      allowed,
      reason,
      checkedAt: new Date().toISOString(),
      resource: request.resource,
      action: request.action,
      resourceId: request.resourceId,
    }
  }

  /**
   * Returns a debug explanation including matched rule and number of checked rules.
   */
  public explain(
    user: AuthUser,
    action: ActionPermission,
    resource: ResourceType,
    resourceId?: string,
  ): PermissionExplanation {
    const requestedResourceId = resourceId ?? null
    let checkedRules = 0
    let matchedRule: ResourcePermission | null = null

    for (const rule of user.permissions.resources) {
      checkedRules += 1
      if (rule.resource !== resource) continue

      const matchesResourceId = rule.resourceId === null || rule.resourceId === requestedResourceId
      if (!matchesResourceId) continue

      if (!rule.actions.includes(action)) continue

      if (matchedRule === null) matchedRule = rule
    }

    if (matchedRule !== null) {
      return {
        allowed: true,
        reason: 'ALLOWED: explicit matching rule found',
        matchedRule,
        checkedRules,
      }
    }

    return {
      allowed: false,
      reason: 'DENY_BY_DEFAULT: no explicit matching rule found',
      matchedRule: null,
      checkedRules,
    }
  }
}
