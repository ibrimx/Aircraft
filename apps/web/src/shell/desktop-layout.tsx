// P41 · desktop-layout.tsx — desktop 3-column shell layout
import type { ReactNode } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'

export type DesktopLayoutProps = {
  sidebar: ReactNode
  toolbar: ReactNode
  workspace: ReactNode
  inspector: ReactNode
  statusBar: ReactNode
}

export function DesktopLayout({
  sidebar,
  toolbar,
  workspace,
  inspector,
  statusBar,
}: DesktopLayoutProps) {
  const theme = useThemeTokens()

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        height: '100dvh',
        background: theme.colors.surface.default,
      }}
    >
      {sidebar}

      <div
        style={{
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          minWidth: 0,
          borderInlineStart: `1px solid ${theme.colors.border.default}`,
          borderInlineEnd: `1px solid ${theme.colors.border.default}`,
        }}
      >
        {toolbar}
        <div style={{ minWidth: 0, overflow: 'auto' }}>{workspace}</div>
        {statusBar}
      </div>

      {inspector}
    </div>
  )
}
