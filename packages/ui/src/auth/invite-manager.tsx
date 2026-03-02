import { type CSSProperties, useMemo } from 'react'
import { Surface, ScrollArea, Button, IconButton, Tooltip, Badge, Skeleton } from '@aircraft/ui'
import { useThemeTokens, SPACING, cssTransition } from '@aircraft/design-tokens'

export type InviteRecord = {
  id: string
  email: string
  role: string
  status: 'pending' | 'accepted' | 'expired' | 'revoked'
  createdAt: number
  expiresAt: number
  acceptedAt?: number
}

export type InviteManagerProps = {
  invites: InviteRecord[]
  loading?: boolean
  onRevoke: (id: string) => void
  onResend: (id: string) => void
  onCreateNew: () => void
  className?: string
  style?: CSSProperties
}

const STATUS_VARIANT: Record<InviteRecord['status'], 'warning' | 'success' | 'destructive' | 'default'> = {
  pending: 'warning',
  accepted: 'success',
  expired: 'destructive',
  revoked: 'default',
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return 'just now'
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function InviteManager({ invites, loading = false, onRevoke, onResend, onCreateNew, className, style }: InviteManagerProps) {
  const theme = useThemeTokens()

  const headerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBlockEnd: SPACING[3],
    borderBlockEnd: `1px solid ${theme.colors.border.default}`,
    marginBlockEnd: SPACING[3],
  }

  const rowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING[3],
    minHeight: 56,
    paddingInline: SPACING[3],
    paddingBlock: SPACING[2],
    borderBlockEnd: `1px solid ${theme.colors.border.default}`,
    transition: cssTransition('all', 'fast', 'easeInOut'),
  }

  if (loading) {
    return (
      <Surface className={className} style={{ padding: SPACING[4], ...style }}>
        <div style={headerStyle}>
          <Skeleton width="120px" height="20px" />
          <Skeleton width="100px" height="32px" borderRadius="6px" />
        </div>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} style={{ ...rowStyle, animationDelay: `${i * 50}ms` }}>
            <Skeleton width="40%" height="16px" />
            <Skeleton width="60px" height="20px" borderRadius="9999px" />
            <Skeleton width="60px" height="14px" />
          </div>
        ))}
      </Surface>
    )
  }

  return (
    <Surface className={className} style={{ padding: SPACING[4], ...style }}>
      <div style={headerStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.colors.text.primary, margin: 0 }}>Invitations</h3>
        <Button variant="primary" onClick={onCreateNew}>New Invite</Button>
      </div>

      {invites.length === 0 ? (
        <div style={{ textAlign: 'center', paddingBlock: SPACING[8], color: theme.colors.text.secondary }}>
          <p style={{ marginBlockEnd: SPACING[3] }}>No invitations sent yet</p>
          <Button variant="secondary" onClick={onCreateNew}>Send your first invite</Button>
        </div>
      ) : (
        <>
          <ScrollArea style={{ maxHeight: 400 }}>
            {invites.map((inv, idx) => (
              <div key={inv.id} style={{ ...rowStyle, animationDelay: `${idx * 50}ms` }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text.primary, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.email}</span>
                  <span style={{ fontSize: 12, color: theme.colors.text.secondary }}>{inv.role}</span>
                </div>
                <Badge variant={STATUS_VARIANT[inv.status]}>{inv.status}</Badge>
                <span style={{ fontSize: 12, color: theme.colors.text.tertiary, whiteSpace: 'nowrap' }}>
                  {inv.status === 'accepted' && inv.acceptedAt ? `Accepted ${relativeTime(inv.acceptedAt)}` : `Sent ${relativeTime(inv.createdAt)}`}
                </span>
                <div style={{ display: 'flex', gap: SPACING[1] }}>
                  {inv.status === 'pending' && (
                    <Tooltip content="Resend invite">
                      <IconButton size="sm" onClick={() => onResend(inv.id)}><span aria-hidden="true">↺</span></IconButton>
                    </Tooltip>
                  )}
                  {inv.status === 'expired' && (
                    <Tooltip content="Resend as new invite">
                      <IconButton size="sm" onClick={() => onResend(inv.id)}><span aria-hidden="true">↺</span></IconButton>
                    </Tooltip>
                  )}
                  {(inv.status === 'pending' || inv.status === 'expired') && (
                    <Tooltip content="Revoke invite">
                      <IconButton size="sm" variant="destructive" onClick={() => onRevoke(inv.id)}><span aria-hidden="true">×</span></IconButton>
                    </Tooltip>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
          <p style={{ fontSize: 12, color: theme.colors.text.tertiary, marginBlockStart: SPACING[2] }}>Showing {invites.length} invitation{invites.length !== 1 ? 's' : ''}</p>
        </>
      )}
    </Surface>
  )
}
