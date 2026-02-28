// P41 · desktop-layout.tsx — desktop 3-column shell layout
import type { ReactNode } from 'react'
import { useThemeTokens } from '@brimair/design-tokens'

export type DesktopLayoutProps = {
  sidebar: ReactNode
  toolbar: ReactNode
  workspace: ReactNode
  inspector: ReactNode
  statusBar: ReactNode
}

export function DesktopLayout({
  sidebar, toolbar, workspace, inspector, statusBar,
}: DesktopLayoutProps) {
  const theme = useThemeTokens()
  return (
    <div style=
      display: 'flex', flexDirection: 'row',
      height: '100dvh', background: theme.colors.surface.default,
    >
      {sidebar}
      <div style=
        display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0,
      >
        {toolbar}
        <div style= flex: 1, overflow: 'auto' >{workspace}</div>
        {statusBar}
      </div>
      {inspector}
    </div>
  )
}
