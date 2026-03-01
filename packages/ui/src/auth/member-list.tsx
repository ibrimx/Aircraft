import { type CSSProperties, useMemo } from 'react'
import { Surface } from '@brimair/ui/primitives/surface'
import { ScrollArea } from '@brimair/ui/primitives/scroll-area'
import { Input } from '@brimair/ui/primitives/input'
import { IconButton } from '@brimair/ui/primitives/button'
import { Tooltip } from '@brimair/ui/primitives/tooltip'
import { Badge } from '@brimair/ui/primitives/badge'
import { Skeleton } from '@brimair/ui/primitives/skeleton'
import { useThemeTokens } from '@brimair/design-tokens/theme-provider'
import { SPACING } from '@brimair/design-tokens/spacing'
import { cssTransition } from '@brimair/design-tokens/motion-tokens'
import { PermissionBadge, type PermissionLevel } from './permission-badge'

export type MemberInfo = {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role: string
  permissionLevel: PermissionLevel
  joinedAt: number
  lastActiveAt?: number
  isCurrentUser?: boolean
}

export type MemberListProps = {
  members: MemberInfo[]
  loading?: boolean
  searchQuery?: string
  onSearch: (query: string) => void
  onChangeRole: (memberId: string, newRole: string) => void
  onRemove: (memberId: string) => void
  currentUserId: string
  className?: string
  style?: CSSProperties
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

function avatarBg(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 55%, 45%)`
}

export function MemberList({ members, loading = false, searchQuery = '', onSearch, onChangeRole, onRemove, currentUserId, className, style }: MemberListProps) {
  const theme = useThemeTokens()

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase()
    const list = q
      ? members.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
      : members
    const levelOrder: Record<PermissionLevel, number> = { admin: 0, editor: 1, custom: 2, viewer: 3 }
    return [...list].sort((a, b) => (levelOrder[a.permissionLevel] ?? 9) - (levelOrder[b.permissionLevel] ?? 9) || a.name.localeCompare(b.name))
  }, [members, searchQuery])

  const adminCount = members.filter((m) => m.permissionLevel === 'admin').length

  const rowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: SPACING[3],
    minHeight: 64,
    paddingInline: SPACING[3],
    paddingBlock: SPACING[2],
    borderBlockEnd: `1px solid ${theme.border.default}`,
    transition: cssTransition('fast'),
  }

  if (loading) {
    return (
      <Surface className={className} style= paddingBlock: SPACING[4], paddingInline: SPACING[4], ...style >
        <Skeleton width="100%" height="36px" borderRadius="6px" />
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} style={{ ...rowStyle, animationDelay: `${i * 30}ms` }}>
            <Skeleton width="40px" height="40px" borderRadius="50%" />
            <Skeleton width="50%" height="16px" />
            <Skeleton width="60px" height="20px" borderRadius="9999px" />
          </div>
        ))}
      </Surface>
    )
  }

  return (
    <Surface className={className} style= paddingBlock: SPACING[4], paddingInline: SPACING[4], ...style >
      <div style= display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: SPACING[3] >
        <div style= display: 'flex', alignItems: 'center', gap: SPACING[2] >
          <h3 style= fontSize: 16, fontWeight: 600, color: theme.text.primary, margin: 0 >Members</h3>
          <Badge variant="default">{members.length}</Badge>
        </div>
      </div>

      <Input
        placeholder="Search by name or email"
        value={searchQuery}
        onChange={onSearch}
        aria-label="Search members"
        style= marginBlockEnd: SPACING[3] 
      />

      {filtered.length === 0 ? (
        <p style= textAlign: 'center', color: theme.text.secondary, paddingBlock: SPACING[6] >No members found</p>
      ) : (
        <ScrollArea style= maxHeight: 400 >
          {filtered.map((m, idx) => {
            const isSelf = m.id === currentUserId
            const isOnlyAdmin = isSelf && m.permissionLevel === 'admin' && adminCount <= 1

            return (
              <div key={m.id} style={{ ...rowStyle, animationDelay: `${idx * 30}ms` }}>
                {m.avatarUrl ? (
                  <img src={m.avatarUrl} alt="" style= width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0  />
                ) : (
                  <span style=
                    width: 40, height: 40, borderRadius: '50%',
                    background: avatarBg(m.name),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#FFF', fontWeight: 600, fontSize: 16, flexShrink: 0,
                  >
                    {m.name.charAt(0).toUpperCase()}
                  </span>
                )}

                <div style= flex: 1, minWidth: 0 >
                  <span style= fontSize: 14, fontWeight: 600, color: theme.text.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' >
                    {m.name}{isSelf ? ' (You)' : ''}
                  </span>
                  <span style= fontSize: 12, color: theme.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' >
                    {m.email}
                  </span>
                </div>

                <PermissionBadge level={m.permissionLevel} />

                <span style= fontSize: 12, color: theme.text.tertiary, whiteSpace: 'nowrap', flexShrink: 0 >
                  {m.lastActiveAt ? relativeTime(m.lastActiveAt) : 'Never'}
                </span>

                <div style= display: 'flex', gap: SPACING[1], flexShrink: 0 >
                  <Tooltip content="Change role">
                    <IconButton icon="settings" size="sm" onClick={() => onChangeRole(m.id, m.role)} />
                  </Tooltip>
                  {!isSelf && !isOnlyAdmin && (
                    <Tooltip content="Remove member">
                      <IconButton icon="x" size="sm" variant="destructive" onClick={() => onRemove(m.id)} />
                    </Tooltip>
                  )}
                </div>
              </div>
            )
          })}
        </ScrollArea>
      )}

      {searchQuery && (
        <p style= fontSize: 12, color: theme.text.tertiary, marginBlockStart: SPACING[2], textAlign: 'center' >
          Showing {filtered.length} of {members.length}
        </p>
      )}
    </Surface>
  )
}
