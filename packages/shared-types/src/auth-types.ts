import type {
  InviteId,
  RoleId,
  SessionId,
  UserId,
  WorkspaceId,
} from './ids'
import type { ISODateString } from './common'

/** Allowed named system roles in workspace RBAC. */
export type RoleName = 'admin' | 'editor' | 'viewer' | 'custom'

/** Resource scopes controlled by permission policies. */
export type ResourceType =
  | 'studio_file'
  | 'builder_page'
  | 'cms_source'
  | 'cms_collection'
  | 'brand_kit'
  | 'asset'
  | 'publish_target'

/** Resource-level actions that can be granted per scope. */
export type ActionPermission =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'publish'
  | 'export'
  | 'share'
  | 'invite'

/** Workspace/system-wide privileged actions. */
export type SystemPermission =
  | 'manage_users'
  | 'manage_invites'
  | 'manage_workspace'
  | 'view_audit_log'

/** Permission entry for a specific resource type and optional instance. */
export type ResourcePermission = {
  resource: ResourceType
  resourceId: string | null
  actions: ActionPermission[]
}

/** Complete permission policy split into resource and system dimensions. */
export type PermissionSet = {
  resources: ResourcePermission[]
  system: SystemPermission[]
}

/** Authenticated user profile including workspace role and effective permissions. */
export type AuthUser = {
  id: UserId
  email: string
  name: string
  avatarUrl: string | null
  workspaceId: WorkspaceId
  roleId: RoleId
  permissions: PermissionSet
  locale: 'ar' | 'en'
  createdAt: ISODateString
}

/** Workspace role definition and attached permission set. */
export type Role = {
  id: RoleId
  workspaceId: WorkspaceId
  name: RoleName | string
  isSystem: boolean
  permissions: PermissionSet
  createdAt: ISODateString
}

/** Invite state across creation, acceptance, and lifecycle expiration. */
export type InviteStatus = 'pending' | 'accepted' | 'expired' | 'revoked'

/** Invitation payload used for onboarding users into a workspace. */
export type Invite = {
  id: InviteId
  workspaceId: WorkspaceId
  createdBy: UserId
  email: string | null
  roleId: RoleId
  permissions: PermissionSet
  expiresAt: ISODateString
  status: InviteStatus
  acceptedBy: UserId | null
  acceptedAt: ISODateString | null
  createdAt: ISODateString
}

/** Auth session with access and refresh token metadata. */
export type Session = {
  id: SessionId
  userId: UserId
  workspaceId: WorkspaceId
  token: string
  refreshToken: string
  expiresAt: ISODateString
  createdAt: ISODateString
}

/** API payload used for credential-based login requests. */
export type LoginRequest = {
  email: string
  password: string
}

/** API response returned after successful login authentication. */
export type LoginResponse = {
  user: AuthUser
  session: Session
}

/** API payload used by admins to create invite links or email invites. */
export type InviteCreateRequest = {
  email: string | null
  roleId: RoleId
  permissions: PermissionSet
  expiresInDays: number
}

/** API payload used by invitees to accept a tokenized invitation. */
export type InviteAcceptRequest = {
  token: string
  name: string
  password: string
}

/** API response returned after successful invite acceptance. */
export type InviteAcceptResponse = {
  user: AuthUser
  session: Session
}
