'use client'

// P40 · app-shell.tsx — responsive application shell
import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { BREAKPOINT_VALUES } from '@aircraft/design-tokens'
import { DesktopLayout } from './desktop-layout'
import { MobileLayout } from './mobile-layout'
import { Sidebar } from './sidebar'
import { Toolbar } from './toolbar'
import { Inspector } from './inspector'
import { Workspace } from './workspace'
import { StatusBar } from './status-bar'
import { CommandPalette } from './command-palette'

export type AppShellProps = {
  children: ReactNode
  defaultSidebarOpen?: boolean
  defaultInspectorOpen?: boolean
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${BREAKPOINT_VALUES.tablet - 1}px)`)
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

export function AppShell({
  children, defaultSidebarOpen, defaultInspectorOpen = false,
}: AppShellProps) {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(defaultSidebarOpen ?? !isMobile)
  const [inspectorOpen, setInspectorOpen] = useState(defaultInspectorOpen)
  const [cmdOpen, setCmdOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen(p => !p)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const shell = isMobile
    ? <MobileLayout
        toolbar={<Toolbar onToggleSidebar={() => setSidebarOpen(p => !p)} />}
        workspace={<Workspace>{children}</Workspace>}
        statusBar={<StatusBar />}
      />
    : <DesktopLayout
        sidebar={<Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(p => !p)} />}
        toolbar={<Toolbar
          onToggleSidebar={() => setSidebarOpen(p => !p)}
          onToggleInspector={() => setInspectorOpen(p => !p)}
        />}
        workspace={<Workspace>{children}</Workspace>}
        inspector={<Inspector open={inspectorOpen} onClose={() => setInspectorOpen(false)} />}
        statusBar={<StatusBar />}
      />

  return (
    <>
      {shell}
      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}
    </>
  )
}
