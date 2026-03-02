// P42 · mobile-layout.tsx — mobile single-column shell layout
import type { ReactNode, CSSProperties } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'

export type MobileLayoutProps = {
  toolbar: ReactNode
  workspace: ReactNode
  statusBar: ReactNode
}

export function MobileLayout({ toolbar, workspace, statusBar }: MobileLayoutProps) {
  const theme = useThemeTokens()

  const rootStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh',
    background: theme.colors.surface.default,
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: 'env(safe-area-inset-bottom)',
  }

  const stickyTopStyle: CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    flexShrink: 0,
  }

  const contentStyle: CSSProperties = {
    flex: 1,
    overflow: 'auto',
  }

  const stickyBottomStyle: CSSProperties = {
    position: 'sticky',
    bottom: 0,
    zIndex: 10,
    flexShrink: 0,
  }

  return (
    <div style={rootStyle}>
      <div style={stickyTopStyle}>{toolbar}</div>
      <div style={contentStyle}>{workspace}</div>
      <div style={stickyBottomStyle}>{statusBar}</div>
    </div>
  )
}
