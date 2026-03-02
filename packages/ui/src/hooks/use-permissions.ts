// packages/ui/src/hooks/use-permissions.ts
import { useMemo } from 'react';
import type {
  ActionPermission,
  ResourceType,
  SystemPermission,
} from '@aircraft/shared-types';
import { useAuth } from './use-auth';

// ── Types ────────────────────────────────────────────────
export type UsePermissionsReturn = {
  can: (action: ActionPermission, resource: ResourceType, resourceId?: string) => boolean;
  canSystem: (permission: SystemPermission) => boolean;
  role: string | null;
  isAdmin: boolean;
  isViewer: boolean;
};

// ── Hook ─────────────────────────────────────────────────
export function usePermissions(): UsePermissionsReturn {
  const { user, isAuthenticated } = useAuth();

  return useMemo<UsePermissionsReturn>(() => {
    const role = isAuthenticated && user ? user.roleId : null;
    const isAdmin = role === 'admin';
    const isViewer = role === 'viewer';

    const can = (
      action: ActionPermission,
      _resource: ResourceType,
      _resourceId?: string,
    ): boolean => {
      if (!isAuthenticated || !user) return false; // deny-by-default
      if (isAdmin) return true;                    // admin short-circuit
      if (isViewer && action !== 'view') return false;
      return true; // delegate to full resolver at provider level
    };

    const canSystem = (permission: SystemPermission): boolean => {
      if (!isAuthenticated || !user) return false; // deny-by-default
      if (isAdmin) return true;                    // admin short-circuit
      return false;                                // non-admin: deny system perms
    };

    return { can, canSystem, role, isAdmin, isViewer };
  }, [user, isAuthenticated]);
}
