import type {
  PermissionSet,
  Role,
  RoleId,
  RoleName,
  WorkspaceId,
} from '@aircraft/shared-types'
import { createId } from '@aircraft/shared-types'
import {
  DEFAULT_ADMIN_PERMISSIONS,
  DEFAULT_EDITOR_PERMISSIONS,
  DEFAULT_VIEWER_PERMISSIONS,
} from './permission-types'
import { toISODateString } from './iso-date'

/** Input used to create custom roles only. */
export type CreateRoleInput = {
  workspaceId: WorkspaceId
  name: string
  permissions: PermissionSet
  isSystem: false
}

/** Input used to update role fields. */
export type UpdateRoleInput = {
  name: string | undefined
  permissions: PermissionSet | undefined
}

/** Domain errors emitted by RoleEngine operations. */
export type RoleError =
  | { code: 'ROLE_NOT_FOUND'; roleId: RoleId }
  | { code: 'ROLE_NAME_DUPLICATE'; name: string; workspaceId: WorkspaceId }
  | {
      code: 'SYSTEM_ROLE_PROTECTED'
      roleId: RoleId
      attemptedAction: string
    }
  | { code: 'ROLE_HAS_MEMBERS'; roleId: RoleId; memberCount: number }
  | { code: 'ADMIN_PERMISSIONS_REQUIRED'; missingPermissions: string[] }

/** Error class that wraps RoleError details. */
export class RoleEngineError extends Error {
  /** Creates a typed role engine error. */
  public constructor(public readonly details: RoleError) {
    super(RoleEngineError.messageFor(details))
    this.name = 'RoleEngineError'
  }

  /** Maps role error payload to readable text. */
  private static messageFor(error: RoleError): string {
    switch (error.code) {
      case 'ROLE_NOT_FOUND':
        return `Role not found: ${error.roleId}`
      case 'ROLE_NAME_DUPLICATE':
        return `Role already exists: ${error.name}`
      case 'SYSTEM_ROLE_PROTECTED':
        return `System role protected: ${error.attemptedAction}`
      case 'ROLE_HAS_MEMBERS':
        return `Role has members: ${error.memberCount}`
      case 'ADMIN_PERMISSIONS_REQUIRED':
        return `Missing admin permissions: ${error.missingPermissions.join(', ')}`
    }
  }
}

/** Persistence contract used by role engine. */
export interface RoleRepository {
  /** Saves role entity. */
  save(role: Role): Promise<void>
  /** Finds role by id. */
  findById(id: RoleId): Promise<Role | null>
  /** Lists all workspace roles. */
  findByWorkspace(workspaceId: WorkspaceId): Promise<Role[]>
  /** Finds role by name in workspace. */
  findByName(workspaceId: WorkspaceId, name: string): Promise<Role | null>
  /** Updates existing role. */
  update(role: Role): Promise<void>
  /** Deletes role by id. */
  delete(id: RoleId): Promise<void>
  /** Counts members assigned to role. */
  countMembers(roleId: RoleId): Promise<number>
}

/** Role CRUD and system-role bootstrap contract. */
export interface RoleEngine {
  /** Creates custom role, validates non-empty unique name. */
  createRole(input: CreateRoleInput): Promise<Role>
  /** Returns role by id or null when missing. */
  getRole(roleId: RoleId): Promise<Role | null>
  /** Lists workspace roles with system roles first. */
  listRoles(workspaceId: WorkspaceId): Promise<Role[]>
  /** Updates role and enforces system/admin protections. */
  updateRole(roleId: RoleId, changes: UpdateRoleInput): Promise<Role>
  /** Deletes role if non-system and has no members. */
  deleteRole(roleId: RoleId): Promise<void>
  /** Returns default permissions by role type. */
  getDefaultRoleForType(type: RoleName): PermissionSet
  /** Ensures admin/editor/viewer roles exist once per workspace. */
  initializeSystemRoles(workspaceId: WorkspaceId): Promise<Role[]>
}

/** Default role engine implementation with repository-only persistence access. */
export class RoleEngineImpl implements RoleEngine {
  /** Creates engine with role repository dependency. */
  public constructor(private readonly repository: RoleRepository) {}

  /** Creates custom role and throws on empty/duplicate name. */
  public async createRole(input: CreateRoleInput): Promise<Role> {
    const name = input.name.trim()
    if (name.length === 0) throw new Error('Role name is required')
    const duplicate = await this.repository.findByName(input.workspaceId, name)
    if (duplicate !== null) {
      throw new RoleEngineError({
        code: 'ROLE_NAME_DUPLICATE',
        name,
        workspaceId: input.workspaceId,
      })
    }

    const role: Role = {
      id: createId<RoleId>(),
      workspaceId: input.workspaceId,
      name,
      isSystem: false,
      permissions: input.permissions,
      createdAt: toISODateString(new Date()),
    }
    await this.repository.save(role)
    return role
  }

  /** Reads role by id; returns null when not found. */
  public async getRole(roleId: RoleId): Promise<Role | null> {
    return this.repository.findById(roleId)
  }

  /** Lists workspace roles sorted as system first then custom. */
  public async listRoles(workspaceId: WorkspaceId): Promise<Role[]> {
    const roles = await this.repository.findByWorkspace(workspaceId)
    return roles.sort((a, b) => Number(b.isSystem) - Number(a.isSystem))
  }

  /** Updates role with checks for system rename and admin required permissions. */
  public async updateRole(roleId: RoleId, changes: UpdateRoleInput): Promise<Role> {
    const existing = await this.repository.findById(roleId)
    if (existing === null) throw new RoleEngineError({ code: 'ROLE_NOT_FOUND', roleId })

    const nextName = changes.name === undefined ? existing.name : changes.name.trim()
    if (existing.isSystem && changes.name !== undefined && nextName !== existing.name) {
      throw new RoleEngineError({ code: 'SYSTEM_ROLE_PROTECTED', roleId, attemptedAction: 'rename' })
    }
    if (!existing.isSystem && changes.name !== undefined) {
      if (nextName.length === 0) throw new Error('Role name is required')
      const duplicate = await this.repository.findByName(existing.workspaceId, nextName)
      if (duplicate !== null && duplicate.id !== existing.id) {
        throw new RoleEngineError({
          code: 'ROLE_NAME_DUPLICATE',
          name: nextName,
          workspaceId: existing.workspaceId,
        })
      }
    }

    const nextPermissions = changes.permissions ?? existing.permissions
    if (existing.isSystem && existing.name === 'admin') {
      this.assertAdminPermissions(nextPermissions)
    }

    const updated: Role = { ...existing, name: nextName, permissions: nextPermissions }
    await this.repository.update(updated)
    return updated
  }

  /** Deletes role only when non-system and with zero assigned members. */
  public async deleteRole(roleId: RoleId): Promise<void> {
    const role = await this.repository.findById(roleId)
    if (role === null) throw new RoleEngineError({ code: 'ROLE_NOT_FOUND', roleId })
    if (role.isSystem) {
      throw new RoleEngineError({ code: 'SYSTEM_ROLE_PROTECTED', roleId, attemptedAction: 'delete' })
    }
    const memberCount = await this.repository.countMembers(roleId)
    if (memberCount > 0) {
      throw new RoleEngineError({ code: 'ROLE_HAS_MEMBERS', roleId, memberCount })
    }
    await this.repository.delete(roleId)
  }

  /** Returns default permissions for admin/editor/viewer/custom. */
  public getDefaultRoleForType(type: RoleName): PermissionSet {
    if (type === 'admin') return DEFAULT_ADMIN_PERMISSIONS
    if (type === 'editor') return DEFAULT_EDITOR_PERMISSIONS
    if (type === 'viewer') return DEFAULT_VIEWER_PERMISSIONS
    return { resources: [], system: [] }
  }

  /** Creates missing admin/editor/viewer roles once and returns the three roles. */
  public async initializeSystemRoles(workspaceId: WorkspaceId): Promise<Role[]> {
    const roleNames: readonly RoleName[] = ['admin', 'editor', 'viewer']
    const roles: Role[] = []
    for (const roleName of roleNames) {
      const existing = await this.repository.findByName(workspaceId, roleName)
      if (existing !== null) {
        roles.push(existing)
        continue
      }
      const created: Role = {
        id: createId<RoleId>(),
        workspaceId,
        name: roleName,
        isSystem: true,
        permissions: this.getDefaultRoleForType(roleName),
        createdAt: toISODateString(new Date()),
      }
      await this.repository.save(created)
      roles.push(created)
    }
    return roles
  }

  /** Throws when admin required permissions are missing. */
  private assertAdminPermissions(permissions: PermissionSet): void {
    const required: ReadonlyArray<'manage_users' | 'manage_invites'> = ['manage_users', 'manage_invites']
    const missing = required.filter((permission) => !permissions.system.includes(permission))
    if (missing.length > 0) {
      throw new RoleEngineError({ code: 'ADMIN_PERMISSIONS_REQUIRED', missingPermissions: [...missing] })
    }
  }
}
