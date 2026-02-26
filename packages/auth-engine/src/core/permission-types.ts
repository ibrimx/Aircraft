import type {
  ActionPermission,
  ISODateString,
  PermissionSet,
  ResourcePermission,
  ResourceType,
  SystemPermission,
  UserId,
  WorkspaceId,
} from '@brimair/shared-types'

const ALL_RESOURCES: readonly ResourceType[] = [
  'studio_file',
  'builder_page',
  'cms_source',
  'cms_collection',
  'brand_kit',
  'asset',
  'publish_target',
] as const

const ALL_ACTIONS: readonly ActionPermission[] = [
  'create',
  'read',
  'update',
  'delete',
  'publish',
  'export',
  'share',
  'invite',
] as const

const ALL_SYSTEM_PERMISSIONS: readonly SystemPermission[] = [
  'manage_users',
  'manage_invites',
  'manage_workspace',
  'view_audit_log',
] as const

/** Result returned by permission checks after evaluating user access context. */
export type PermissionCheckResult = {
  allowed: boolean
  reason: string | null
  checkedAt: ISODateString
  resource: ResourceType
  action: ActionPermission
  resourceId: string | null
}

/** Input payload used by permission resolvers and guards to evaluate access. */
export type PermissionCheckRequest = {
  userId: UserId
  action: ActionPermission
  resource: ResourceType
  resourceId: string | null
  workspaceId: WorkspaceId
}

/** Flat cache-friendly permission entry for a single resource/action tuple. */
export type FlatPermission = {
  resource: ResourceType
  resourceId: string | null
  action: ActionPermission
}

/** Flat permission list used for fast in-memory access checks. */
export type FlatPermissionList = FlatPermission[]

/** Strategy used when combining permissions from role, user, and invite sources. */
export type PermissionMergeStrategy = 'union' | 'intersection' | 'role_override'

const buildResourcePermissions = (
  actions: readonly ActionPermission[],
): ResourcePermission[] =>
  ALL_RESOURCES.map((resource) => ({
    resource,
    resourceId: null,
    actions: [...actions],
  }))

/** Default admin permissions: full access to all resources and system actions. */
export const DEFAULT_ADMIN_PERMISSIONS: PermissionSet = {
  resources: buildResourcePermissions(ALL_ACTIONS),
  system: [...ALL_SYSTEM_PERMISSIONS],
} as const

/** Default editor permissions: read/update access across resources without user/invite management. */
export const DEFAULT_EDITOR_PERMISSIONS: PermissionSet = {
  resources: buildResourcePermissions(['read', 'update']),
  system: [],
} as const

/** Default viewer permissions: read-only access across resources. */
export const DEFAULT_VIEWER_PERMISSIONS: PermissionSet = {
  resources: buildResourcePermissions(['read']),
  system: [],
} as const

/** Route-level permission contract used by UI/API guards. */
export type ProtectedRoute = {
  path: string
  requiredAction: ActionPermission | SystemPermission
  requiredResource: ResourceType | null
  resourceIdParam: string | null
}

/** Static route protection table used by route guards and middleware. */
export const PROTECTED_ROUTES: readonly ProtectedRoute[] = [
  {
    path: '/studio/:fileId',
    requiredAction: 'read',
    requiredResource: 'studio_file',
    resourceIdParam: 'fileId',
  },
  {
    path: '/studio/:fileId/edit',
    requiredAction: 'update',
    requiredResource: 'studio_file',
    resourceIdParam: 'fileId',
  },
  {
    path: '/builder/:pageId',
    requiredAction: 'read',
    requiredResource: 'builder_page',
    resourceIdParam: 'pageId',
  },
  {
    path: '/builder/:pageId/edit',
    requiredAction: 'update',
    requiredResource: 'builder_page',
    resourceIdParam: 'pageId',
  },
  {
    path: '/cms',
    requiredAction: 'read',
    requiredResource: 'cms_source',
    resourceIdParam: null,
  },
  {
    path: '/settings/members',
    requiredAction: 'manage_users',
    requiredResource: null,
    resourceIdParam: null,
  },
  {
    path: '/settings/invites',
    requiredAction: 'manage_invites',
    requiredResource: null,
    resourceIdParam: null,
  },
] as const
