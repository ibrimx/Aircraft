/**
 * P43 — sidebar.tsx · Collapsible sidebar shell
 * @package apps/web
 * 📖 DSG §6 Panels (sidebar surface), §10 Interactive States
 * 📖 FRAMER §2 Springs (gentle spring for expand/collapse)
 * 📖 PAGE BUILDER §4 Responsive (sidebar collapses on tablet)
 * 📖 STUDIO §2.1 Sidebar (layer tree, page tree, asset browser)
 */

import type { ReactNode, CSSProperties } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'
import { cssTransition } from '@aircraft/design-tokens'
import { SidebarRail } from './sidebar-rail'

export type SidebarProps = {
  open: boolean
  onToggle: () => void
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export function Sidebar({ open, onToggle, children, className, style }: SidebarProps) {
  const theme = useThemeTokens()
  return (
    <nav className={className} style={{
      width: open ? '240px' : '48px',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      background: theme.colors.surface.default,
      borderInlineEnd: `1px solid ${theme.colors.border.subtle}`,
      transition: cssTransition('width', 'slow', 'easeInOut'),
      overflow: 'hidden',
      height: '100%',
      ...style,
    }}>
      {open ? children : <SidebarRail onExpand={onToggle} />}
    </nav>
  )
}
