import { type CSSProperties, type ReactNode, useEffect } from 'react'
import { Skeleton } from '@aircraft/ui/primitives/skeleton'
import { Surface } from '@aircraft/ui/primitives/surface'
import { SPACING } from '@aircraft/design-tokens/spacing'
import { AccessDenied } from './access-denied'

export type AuthState = 'loading' | 'authenticated' | 'unauthenticated'

export type RouteGuardProps = {
  authState: AuthState
  requiredPermission?: string
  hasPermission?: boolean
  children: ReactNode
  fallback?: ReactNode
  onRedirectToLogin?: () => void
  className?: string
  style?: CSSProperties
}

function DefaultFallback() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        paddingInline: SPACING[4],
      }}
    >
      <Surface
        variant="raised"
        style={{
          maxWidth: 480,
          width: '100%',
          paddingInline: SPACING[6],
          paddingBlock: SPACING[8],
          display: 'flex',
          flexDirection: 'column',
          gap: SPACING[4],
        }}
      >
        <Skeleton width="60%" height="24px" />
        <Skeleton width="100%" height="16px" />
        <Skeleton width="80%" height="16px" />
      </Surface>
    </div>
  )
}

// ✅ DEV ONLY: bypass auth/permissions to enter builder without login
const DEV_BYPASS_AUTH = true // IMPORTANT: set false before production

export function RouteGuard({
  authState,
  requiredPermission,
  hasPermission,
  children,
  fallback,
  onRedirectToLogin,
  className,
  style,
}: RouteGuardProps) {
  const effectiveAuthState: AuthState = DEV_BYPASS_AUTH ? 'authenticated' : authState

  useEffect(() => {
    if (effectiveAuthState === 'unauthenticated' && onRedirectToLogin) {
      onRedirectToLogin()
    }
  }, [effectiveAuthState, onRedirectToLogin])

  if (effectiveAuthState === 'loading') {
    return <div className={className} style={style}>{fallback ?? <DefaultFallback />}</div>
  }

  if (effectiveAuthState === 'unauthenticated') {
    return (
      <AccessDenied
        reason="not_authenticated"
        onLogin={onRedirectToLogin}
        className={className}
        style={style}
      />
    )
  }

  // bypass permission checks in dev
  if (!DEV_BYPASS_AUTH && hasPermission === false) {
    return (
      <AccessDenied
        reason="no_permission"
        requiredPermission={requiredPermission}
        className={className}
        style={style}
      />
    )
  }

  return <>{children}</>
}
