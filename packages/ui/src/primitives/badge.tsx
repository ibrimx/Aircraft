// P33
import type { ReactNode, CSSProperties } from 'react'
import { useThemeTokens } from '@brimair/design-tokens'

export type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'destructive'

export type BadgeProps = {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function Badge({
  variant = 'default', children, className, style,
}: BadgeProps) {
  const theme = useThemeTokens()

  const variantStyles: Record<BadgeVariant, { bg: string; color: string }> = {
    default:     { bg: theme.colors.surface.sunken, color: theme.colors.text.secondary },
    accent:      { bg: theme.colors.accent.subtle,  color: theme.colors.accent.default },
    success:     { bg: theme.colors.success.subtle,  color: theme.colors.success.default },
    warning:     { bg: theme.colors.warning.subtle,  color: theme.colors.warning.default },
    destructive: { bg: theme.colors.destructive.subtle, color: theme.colors.destructive.default },
  }

  const v = variantStyles[variant]

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'center',
        padding: `2px ${theme.spacing[2]}`,
        borderRadius: theme.radius.pill,
        background: v.bg, color: v.color,
        fontSize: theme.textStyles.caption.fontSize,
        fontFamily: theme.fontFamily.sans,
        fontWeight: theme.textStyles.caption.fontWeight,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  )
}
