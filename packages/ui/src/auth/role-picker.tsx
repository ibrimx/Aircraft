import { type CSSProperties } from 'react'
import { Badge } from '@aircraft/ui'
import { useThemeTokens, SPACING, cssTransition } from '@aircraft/design-tokens'

export type RoleInfo = {
  id: string
  name: string
  description?: string
  memberCount: number
  isSystem: boolean
  permissions: string[]
}

export type RolePickerProps = {
  roles: RoleInfo[]
  selectedId?: string
  onSelect: (id: string) => void
  disabled?: boolean
  compact?: boolean
  className?: string
  style?: CSSProperties
}

export function RolePicker({ roles, selectedId, onSelect, disabled = false, compact = false, className, style }: RolePickerProps) {
  const theme = useThemeTokens()

  if (compact) {
    return (
      <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: SPACING[1], ...style }} role="radiogroup" aria-label="Role selection">
        {roles.map((role) => {
          const selected = role.id === selectedId
          return (
            <button
              key={role.id}
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onSelect(role.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: SPACING[3],
                paddingInline: SPACING[3],
                paddingBlock: SPACING[2],
                minHeight: 44,
                border: 'none',
                borderRadius: 6,
                background: selected ? theme.colors.accent.subtle : 'transparent',
                color: theme.colors.text.primary,
                cursor: disabled ? 'default' : 'pointer',
                opacity: disabled ? 0.4 : 1,
                transition: cssTransition('all', 'fast', 'easeInOut'),
                width: '100%',
                textAlign: 'start',
                fontSize: 13,
              }}
            >
              <span style={{
                width: 16, height: 16, borderRadius: '50%',
                border: `2px solid ${selected ? theme.colors.accent.default : theme.colors.border.strong}`,
                background: selected ? theme.colors.accent.default : 'transparent',
                flexShrink: 0,
                transition: cssTransition('all', 'fast', 'easeInOut'),
              }} />
              <span style={{ fontWeight: 500, flex: 1 }}>{role.name}</span>
              <span style={{ fontSize: 12, color: theme.colors.text.tertiary }}>{role.memberCount} member{role.memberCount !== 1 ? 's' : ''}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: SPACING[2], ...style }} role="radiogroup" aria-label="Role selection">
      {roles.map((role) => {
        const selected = role.id === selectedId
        const visiblePerms = role.permissions.slice(0, 3)
        const extraCount = role.permissions.length - 3

        return (
          <div key={role.id}><button
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onSelect(role.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: SPACING[2],
              paddingInline: SPACING[4],
              paddingBlock: SPACING[3],
              border: `2px solid ${selected ? theme.colors.accent.default : theme.colors.border.default}`,
              borderRadius: 8,
              background: selected ? theme.colors.accent.subtle : undefined,
              cursor: disabled ? 'default' : 'pointer',
              opacity: disabled ? 0.4 : 1,
              transition: cssTransition('all', 'fast', 'easeInOut'),
              textAlign: 'start',
              width: '100%',
              transform: selected ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: SPACING[2] }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: theme.colors.text.primary }}>{role.name}</span>
              {role.isSystem && <Badge variant="default">System</Badge>}
            </div>
            {role.description && (
              <span style={{ fontSize: 12, color: theme.colors.text.secondary, lineHeight: '16px' }}>{role.description}</span>
            )}
            <span style={{ fontSize: 12, color: theme.colors.text.tertiary }}>
              {role.memberCount > 0 ? `${role.memberCount} member${role.memberCount !== 1 ? 's' : ''}` : 'No members'}
            </span>
            {visiblePerms.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: SPACING[1] }}>
                {visiblePerms.map((p) => <Badge key={p} variant="default">{p}</Badge>)}
                {extraCount > 0 && <Badge variant="default">+{extraCount} more</Badge>}
              </div>
            )}
          </button></div>
        )
      })}
    </div>
  )
}
