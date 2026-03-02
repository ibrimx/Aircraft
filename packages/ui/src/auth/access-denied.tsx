import { type CSSProperties } from 'react'
import { Surface, Button, Badge } from '@aircraft/ui'
import { useThemeTokens, SPACING, cssTransition } from '@aircraft/design-tokens'

export type DeniedReason = 'no_permission' | 'not_authenticated' | 'not_member' | 'role_insufficient'

export type AccessDeniedProps = {
  reason: DeniedReason
  requiredPermission?: string
  requiredRole?: string
  onGoBack?: () => void
  onLogin?: () => void
  onRequestAccess?: () => void
  className?: string
  style?: CSSProperties
}

const REASON_CONFIG: Record<DeniedReason, { title: string; description: string }> = {
  no_permission: {
    title: 'Access Denied',
    description: "You don't have permission to access this resource.",
  },
  not_authenticated: {
    title: 'Login Required',
    description: 'Please log in to continue.',
  },
  not_member: {
    title: 'Not a Member',
    description: 'You are not a member of this workspace.',
  },
  role_insufficient: {
    title: 'Insufficient Permissions',
    description: "Your current role doesn't have access to this resource.",
  },
}

export function AccessDenied({ reason, requiredPermission, requiredRole, onGoBack, onLogin, onRequestAccess, className, style }: AccessDeniedProps) {
  const theme = useThemeTokens()
  const config = REASON_CONFIG[reason]

  const wrapStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    paddingInline: SPACING[4],
    ...style,
  }

  const cardStyle: CSSProperties = {
    maxWidth: 480,
    width: '100%',
    paddingInline: SPACING[6],
    paddingBlock: SPACING[8],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: SPACING[4],
    textAlign: 'center',
    animation: cssTransition('all', 'normal', 'easeInOut'),
  }

  return (
    <div className={className} style={wrapStyle}>
      <Surface variant="raised" style={cardStyle}>
        <span style={{ fontSize: 64, lineHeight: 1, color: theme.colors.text.tertiary }} aria-hidden>🔒</span>

        <h2 style={{ fontSize: 20, fontWeight: 600, color: theme.colors.text.primary, margin: 0 }}>
          {config.title}
        </h2>

        <p style={{ fontSize: 14, color: theme.colors.text.secondary, margin: 0, lineHeight: 1.5 }}>
          {config.description}
        </p>

        {reason === 'no_permission' && requiredPermission && (
          <p style={{ fontSize: 13, color: theme.colors.text.tertiary, margin: 0 }}>
            Required: <code style={{ background: theme.colors.border.default, paddingInline: 6, paddingBlock: 2, borderRadius: 4, fontSize: 12 }}>{requiredPermission}</code>
          </p>
        )}

        {reason === 'role_insufficient' && requiredRole && (
          <p style={{ fontSize: 13, color: theme.colors.text.tertiary, margin: 0 }}>
            Required role: <Badge variant="warning">{requiredRole}</Badge>
          </p>
        )}

        <div style={{ display: 'flex', gap: SPACING[3], marginBlockStart: SPACING[2] }}>
          {onGoBack && <Button variant="secondary" onClick={onGoBack}>Go Back</Button>}
          {reason === 'not_authenticated' && onLogin && (
            <Button variant="primary" onClick={onLogin}>Log In</Button>
          )}
          {(reason === 'no_permission' || reason === 'role_insufficient') && onRequestAccess && (
            <Button variant="primary" onClick={onRequestAccess}>Request Access</Button>
          )}
        </div>
      </Surface>
    </div>
  )
}
