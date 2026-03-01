import { type CSSProperties, useMemo } from 'react'
import { Surface } from '@brimair/ui/primitives/surface'
import { Button } from '@brimair/ui/primitives/button'
import { Badge } from '@brimair/ui/primitives/badge'
import { Skeleton } from '@brimair/ui/primitives/skeleton'
import { useThemeTokens } from '@brimair/design-tokens/theme-provider'
import { SPACING } from '@brimair/design-tokens/spacing'
import { cssTransition } from '@brimair/design-tokens/motion-tokens'

export type InviteStatus = 'validating' | 'valid' | 'expired' | 'invalid' | 'accepted' | 'error'

export type InviteInfo = {
  token: string
  workspaceName: string
  workspaceIcon?: string
  inviterName: string
  inviterEmail: string
  role: string
  expiresAt: number
  status: InviteStatus
}

export type InviteGateProps = {
  invite: InviteInfo | null
  onAccept: (token: string) => void
  onDecline: (token: string) => void
  accepting?: boolean
  errorMessage?: string
  className?: string
  style?: CSSProperties
}

const STATUS_CONFIG: Record<Exclude<InviteStatus, 'valid' | 'validating'>, { label: string; variant: 'destructive' | 'success' | 'warning' }> = {
  expired: { label: 'Expired', variant: 'destructive' },
  invalid: { label: 'Invalid', variant: 'destructive' },
  accepted: { label: 'Accepted', variant: 'success' },
  error: { label: 'Error', variant: 'destructive' },
}

function formatCountdown(expiresAt: number): string {
  const diff = expiresAt - Date.now()
  if (diff <= 0) return 'Expired'
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  if (days > 0) return `Expires in ${days}d ${hours}h`
  const mins = Math.floor((diff % 3_600_000) / 60_000)
  return hours > 0 ? `Expires in ${hours}h ${mins}m` : `Expires in ${mins}m`
}

export function InviteGate({ invite, onAccept, onDecline, accepting = false, errorMessage, className, style }: InviteGateProps) {
  const theme = useThemeTokens()
  const countdown = useMemo(() => (invite?.expiresAt ? formatCountdown(invite.expiresAt) : ''), [invite?.expiresAt])

  const cardStyle: CSSProperties = {
    maxWidth: 400,
    width: '100%',
    paddingInline: SPACING[4],
    paddingBlock: SPACING[6],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: SPACING[3],
    textAlign: 'center',
    animation: cssTransition('gentle'),
  }

  const wrapStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    paddingInline: SPACING[4],
    ...style,
  }

  if (!invite) {
    return (
      <div className={className} style={wrapStyle}>
        <Surface variant="raised" style={cardStyle}>
          <Skeleton width="48px" height="48px" borderRadius="50%" />
          <Skeleton width="70%" height="20px" />
          <Skeleton width="90%" height="16px" />
          <div style= display: 'flex', gap: SPACING[2], marginBlockStart: SPACING[2], width: '100%', justifyContent: 'center' >
            <Skeleton width="120px" height="36px" borderRadius="6px" />
            <Skeleton width="90px" height="36px" borderRadius="6px" />
          </div>
        </Surface>
      </div>
    )
  }

  const { token, workspaceName, workspaceIcon, inviterName, role, status } = invite

  return (
    <div className={className} style={wrapStyle}>
      <Surface variant="raised" style={cardStyle}>
        {status === 'validating' && (
          <>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${theme.border.default}`, borderTopColor: theme.accent.default, animation: 'spin 800ms linear infinite' }} />
            <span style= color: theme.text.secondary, fontSize: 13 >Verifying invite…</span>
          </>
        )}

        {status === 'valid' && (
          <>
            <span style= fontSize: 40, lineHeight: 1 >{workspaceIcon ?? '🏢'}</span>
            <h2 style= fontSize: 20, fontWeight: 600, color: theme.text.primary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' >{workspaceName}</h2>
            <p style= fontSize: 13, color: theme.text.secondary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' >{inviterName} invited you as <strong>{role}</strong></p>
            <span style= fontSize: 12, color: countdown === 'Expired' ? theme.destructive.default : theme.text.tertiary >{countdown}</span>
            <div style= display: 'flex', gap: SPACING[2], marginBlockStart: SPACING[2] >
              <Button variant="primary" onClick={() => onAccept(token)} disabled={accepting}>{accepting ? 'Joining…' : 'Accept'}</Button>
              {!accepting && <Button variant="ghost" onClick={() => onDecline(token)}>Decline</Button>}
            </div>
          </>
        )}

        {(status === 'expired' || status === 'invalid' || status === 'accepted' || status === 'error') && (
          <>
            <Badge variant={STATUS_CONFIG[status].variant}>{STATUS_CONFIG[status].label}</Badge>
            <p style= fontSize: 13, color: theme.text.secondary, margin: 0 >
              {status === 'expired' && 'This invite has expired. Request a new invite from the workspace admin.'}
              {status === 'invalid' && 'This invite link is not valid.'}
              {status === 'accepted' && 'Redirecting to workspace…'}
              {status === 'error' && (errorMessage ?? 'Something went wrong.')}
            </p>
            {status === 'error' && <Button variant="secondary" onClick={() => onAccept(token)}>Try again</Button>}
          </>
        )}
      </Surface>

      {errorMessage && status !== 'error' && (
        <p style= color: theme.destructive.default, fontSize: 12, marginBlockStart: SPACING[2], textAlign: 'center' >{errorMessage}</p>
      )}
    </div>
  )
}
