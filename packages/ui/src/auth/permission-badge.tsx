import { type CSSProperties } from 'react'
import { Badge } from '@aircraft/ui/primitives/badge'
import { useThemeTokens } from '@aircraft/design-tokens/theme-provider'

export type PermissionLevel = 'admin' | 'editor' | 'viewer' | 'custom'

export type PermissionBadgeProps = {
  level: PermissionLevel
  label?: string
  size?: 'sm' | 'md'
  showIcon?: boolean
  className?: string
  style?: CSSProperties
}

const LEVEL_ICON: Record<PermissionLevel, string> = {
  admin: '\uD83D\uDD11',
  editor: '\u270F\uFE0F',
  viewer: '\uD83D\uDC41',
  custom: '\u2699\uFE0F',
}

export function PermissionBadge({ level, label, size = 'sm', showIcon = false, className, style }: PermissionBadgeProps) {
  const theme = useThemeTokens()

  const colorMap: Record<PermissionLevel, { bg: string; text: string }> = {
    admin: { bg: theme.accent.default, text: '#FFFFFF' },
    editor: { bg: theme.success.default, text: '#FFFFFF' },
    viewer: { bg: theme.bg.surface ?? theme.surface?.sunken ?? theme.border.default, text: theme.text.secondary },
    custom: { bg: theme.warning.default, text: theme.text.primary },
  }

  const colors = colorMap[level]
  const displayLabel = label ?? level.charAt(0).toUpperCase() + level.slice(1)

  return (
    <Badge
      className={className}
      style=
        background: colors.bg,
        color: colors.text,
        fontSize: size === 'sm' ? 12 : 13,
        fontWeight: 500,
        ...style,
      
    >
      {showIcon && <span style= marginInlineEnd: 4 >{LEVEL_ICON[level]}</span>}
      {displayLabel}
    </Badge>
  )
}
