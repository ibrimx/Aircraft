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

/** Result returned by a single permission check operation. */
export type PermissionCheckResult = {
  allowed: boolean
  reason: string | null
  checkedAt: ISODateString
  resource: ResourceType
  action: ActionPermission
  resourceId: string | null
}

/** Input payload used by resolvers/guards to evaluate one permission check. */
export type PermissionCheckRequest = {
  userId: UserId
  action: ActionPermission
  resource: ResourceType
  resourceId: string | null
  workspaceId: WorkspaceId
}

/** Flat cache-friendly permission entry for one resource/action tuple. */
export type FlatPermission = {
  resource: ResourceType
  resourceId: string | null
  action: ActionPermission
}

/** Array form used when caching resolved permissions for fast lookup. */
export type FlatPermissionList = FlatPermission[]

/** Strategy used to merge permissions from multiple policy sources. */
export type PermissionMergeStrategy = 'union' | 'intersection' | 'role_override'

const buildResourcePermissions = (
  actions: readonly ActionPermission[],
): ResourcePermission[] =>
  ALL_RESOURCES.map((resource) => ({
    resource,
    resourceId: null,
    actions: [...actions],
  }))

/** Default admin permissions: all resource actions and all system actions. */
export const DEFAULT_ADMIN_PERMISSIONS: PermissionSet = {
  resources: buildResourcePermissions(ALL_ACTIONS),
  system: [...ALL_SYSTEM_PERMISSIONS],
} as const

/** Default editor permissions: read/update only, with no system management actions. */
export const DEFAULT_EDITOR_PERMISSIONS: PermissionSet = {
  resources: buildResourcePermissions(['read', 'update']),
  system: [],
} as const

/** Default viewer permissions: read-only on resources with no system actions. */
export const DEFAULT_VIEWER_PERMISSIONS: PermissionSet = {
  resources: buildResourcePermissions(['read']),
  system: [],
} as const

/** Route-level permission contract consumed by UI/API route guards. */
export type ProtectedRoute = {
  path: string
  requiredAction: ActionPermission | SystemPermission
  requiredResource: ResourceType | null
  resourceIdParam: string | null
}

/** Static RBAC mapping for protected application routes. */
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
