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
  sidebar, toolbar, workspace, inspector, statusBar,
}: DesktopLayoutProps) {
  const theme = useThemeTokens()
  return (
    <div style=455>
      {sidebar}
      <div style=456>
        {toolbar}
        <div style=457>{workspace}</div>
        {statusBar}
      </div>
      {inspector}
    </div>
  )
}
