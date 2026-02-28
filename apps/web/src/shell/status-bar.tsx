import type { CSSProperties } from 'react'
import { useThemeTokens } from '@brimair/design-tokens'

export type StatusBarProps = {
  className?: string
  style?: CSSProperties
}

export function StatusBar({ className, style }: StatusBarProps) {
  const theme = useThemeTokens()
  const footerStyle: CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: '28px', paddingInline: theme.spacing[3],
    background: theme.colors.surface.default,
    borderBlockStart: `1px solid ${theme.colors.border.subtle}`,
    fontSize: theme.textStyles.caption.fontSize,
    color: theme.colors.text.secondary,
    flexShrink: 0,
    ...style,
  }
  return (
    <footer className={className} style={footerStyle}>
      <span>100%</span>
      <span>Saved</span>
    </footer>
  )
}
