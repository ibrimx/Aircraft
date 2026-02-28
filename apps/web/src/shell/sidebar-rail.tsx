/**
 * P43 — sidebar-rail.tsx · Collapsed sidebar rail (48px icon strip)
 * @package apps/web
 * 📖 DSG §6 Panels, §10 Interactive States
 * 📖 FRAMER §2 Springs
 * 📖 STUDIO §2.1 Sidebar
 */

import type { CSSProperties } from 'react'
import { useThemeTokens } from '@brimair/design-tokens'

export type SidebarRailProps = {
  onExpand: () => void
  className?: string
  style?: CSSProperties
}

export function SidebarRail({ onExpand, className, style }: SidebarRailProps) {
  const theme = useThemeTokens()
  return (
    <div className={className} style=
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBlock: theme.spacing[2],
      gap: theme.spacing[1],
      height: '100%',
      ...style,
    >
      <button onClick={onExpand} aria-label="Expand sidebar" style=
        width: '36px',
        height: '36px',
        display: 'grid',
        placeItems: 'center',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: theme.colors.text.secondary,
        borderRadius: '6px',
      >
        ☰
      </button>
    </div>
  )
}
