import { type CSSProperties, type ReactNode, useEffect } from 'react'
import { Skeleton } from '@aircraft/ui/primitives/skeleton'
import { Surface } from '@aircraft/ui/primitives/surface'
import { useThemeTokens } from '@aircraft/design-tokens/theme-provider'
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
  const theme = useThemeTokens()
  return (
    <div style=
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      paddingInline: SPACING[4],
    >
      <Surface variant="raised" style=
        maxWidth: 480,
        width: '100%',
        paddingInline: SPACING[6],
        paddingBlock: SPACING[8],
        display: 'flex',
        flexDirection: 'column',
        gap: SPACING[4],
      >
        <Skeleton width="60%" height="24px" />
        <Skeleton width="100%" height="16px" />
        <Skeleton width="80%" height="16px" />
      </Surface>
    </div>
  )
}

export function RouteGuard({ authState, requiredPermission, hasPermission, children, fallback, onRedirectToLogin, className, style }: RouteGuardProps) {
  useEffect(() => {
    if (authState === 'unauthenticated' && onRedirectToLogin) {
      onRedirectToLogin()
    }
  }, [authState, onRedirectToLogin])

  if (authState === 'loading') {
    return <div className={className} style={style}>{fallback ?? <DefaultFallback />}</div>
  }

  if (authState === 'unauthenticated') {
    return <AccessDenied reason="not_authenticated" onLogin={onRedirectToLogin} className={className} style={style} />
  }

  if (hasPermission === false) {
    return <AccessDenied reason="no_permission" requiredPermission={requiredPermission} className={className} style={style} />
  }

  return <>{children}</>
}
