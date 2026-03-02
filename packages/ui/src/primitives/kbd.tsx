// P33
import type { ReactNode, CSSProperties } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'

export type KbdProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function Kbd({ children, className, style }: KbdProps) {
  const theme = useThemeTokens()

  return (
    <kbd
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'center',
        padding: `2px ${theme.spacing[1]}`,
        borderRadius: theme.radius.sm,
        background: theme.colors.surface.sunken,
        border: `1px solid ${theme.colors.border.default}`,
        boxShadow: theme.shadows.sm,
        fontSize: theme.textStyles.caption.fontSize,
        fontFamily: theme.fontFamily.mono,
        lineHeight: 1,
        ...style,
      }}
    >
      {children}
    </kbd>
  )
}
