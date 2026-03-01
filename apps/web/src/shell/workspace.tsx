import type { ReactNode, CSSProperties } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'

export type WorkspaceProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function Workspace({ children, className, style }: WorkspaceProps) {
  const theme = useThemeTokens()

  const mainStyle: CSSProperties = {
    flex: 1,
    overflow: 'auto',
    background: theme.colors.background.secondary,
    ...style,
  }

  return (
    <main className={className} style={mainStyle}>
      {children}
    </main>
  )
}
