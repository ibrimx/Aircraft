// P42 · mobile-layout.tsx — mobile single-column shell layout
import type { ReactNode } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'

export type MobileLayoutProps = {
  toolbar: ReactNode
  workspace: ReactNode
  statusBar: ReactNode
}

export function MobileLayout({ toolbar, workspace, statusBar }: MobileLayoutProps) {
  const theme = useThemeTokens()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        background: theme.colors.surface.default,
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        {toolbar}
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>{workspace}</div>

      <div
        style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        {statusBar}
      </div>
    </div>
  )
}
