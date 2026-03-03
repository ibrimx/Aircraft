/**
 * App Shell — Framer 2025 Style
 * Now with BuilderProvider
 * @package apps/web
 */

'use client'

import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { BREAKPOINT_VALUES } from '@aircraft/design-tokens'
import { BuilderProvider, useKeyboardShortcuts } from '@aircraft/builder-engine'
import { DesktopLayout } from './desktop-layout'
import { MobileLayout } from './mobile-layout'
import { Sidebar } from './sidebar'
import { Toolbar } from './toolbar'
import { Inspector } from './inspector'
import { Workspace } from './workspace'
import { StatusBar } from './status-bar'
import { CommandPalette } from './command-palette'

export type AppShellProps = {
  children?: ReactNode
  projectName?: string
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

function AppShellContent({
  children,
  defaultSidebarOpen,
  defaultInspectorOpen = true,
}: AppShellProps) {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(defaultSidebarOpen ?? !isMobile)
  const [inspectorOpen, setInspectorOpen] = useState(defaultInspectorOpen)
  const [cmdOpen, setCmdOpen] = useState(false)

  // Enable keyboard shortcuts
  useKeyboardShortcuts()

  // Command palette: ⌘K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen((p) => !p)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  if (isMobile) {
    return (
      <>
        <MobileLayout
          workspace={<Workspace>{children}</Workspace>}
          statusBar={<StatusBar />}
        />
        {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}
      </>
    )
  }

  return (
    <>
      <DesktopLayout
        sidebar={
          <Sidebar
            open={sidebarOpen}
            onToggle={() => setSidebarOpen((p) => !p)}
          />
        }
        toolbar={
          <Toolbar
            onToggleSidebar={() => setSidebarOpen((p) => !p)}
            onToggleInspector={() => setInspectorOpen((p) => !p)}
          />
        }
        workspace={<Workspace>{children}</Workspace>}
        inspector={
          <Inspector
            open={inspectorOpen}
            onClose={() => setInspectorOpen(false)}
          />
        }
        statusBar={<StatusBar />}
      />
      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}
    </>
  )
}

export function AppShell(props: AppShellProps) {
  const handleSave = async (data: string) => {
    console.log('Saving document...', data.substring(0, 100))
    // TODO: Implement actual save to storage
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Document saved')
  }

  return (
    <BuilderProvider onSave={handleSave}>
      <AppShellContent {...props} />
    </BuilderProvider>
  )
}
