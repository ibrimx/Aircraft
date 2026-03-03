/**
 * App Shell — Framer 2025 Style
 * Responsive: Desktop (3-column) / Mobile (single column + bottom bar)
 * @package apps/web
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
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

export function AppShell({
  children,
  projectName = 'Untitled',
  defaultSidebarOpen,
  defaultInspectorOpen = true,
}: AppShellProps) {
  const isMobile = useIsMobile()

  const [sidebarOpen, setSidebarOpen] = useState(defaultSidebarOpen ?? !isMobile)
  const [inspectorOpen, setInspectorOpen] = useState(defaultInspectorOpen)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [activeTool, setActiveTool] = useState('select')

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

  // Tool shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const map: Record<string, string> = {
        v: 'select', f: 'frame', r: 'rectangle', o: 'ellipse',
        t: 'text', l: 'line', p: 'pen', h: 'hand',
      }
      const tool = map[e.key.toLowerCase()]
      if (tool) setActiveTool(tool)
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
          projectName={projectName}
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
            activeTool={activeTool}
            onToolChange={setActiveTool}
            onToggleSidebar={() => setSidebarOpen((p) => !p)}
            onToggleInspector={() => setInspectorOpen((p) => !p)}
            projectName={projectName}
            saveStatus="saved"
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
