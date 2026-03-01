/** P43 — sidebar-rail.tsx · Collapsed sidebar rail (48 px icon strip)
 * 📖 DSG §6 Panels, §10 Interactive States · FRAMER §2 · STUDIO §2.1 */

import type { CSSProperties } from 'react'
import { useThemeTokens } from '@aircraft/design-tokens'

export type SidebarRailProps = {
  onExpand: () => void
  className?: string
  style?: CSSProperties
}

export function SidebarRail({ onExpand, className, style }: SidebarRailProps) {
  const theme = useThemeTokens()
  const rootStyle: CSSProperties = {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', paddingBlock: theme.spacing[2],
    gap: theme.spacing[1], height: '100%', ...style,
  }
  const btnStyle: CSSProperties = {
    width: '36px', height: '36px', display: 'grid', placeItems: 'center',
    background: 'transparent', border: 'none', cursor: 'pointer',
    color: theme.colors.text.secondary, borderRadius: '6px',
  }
  return (
    <div className={className} style={rootStyle}>
      <button onClick={onExpand} aria-label="Expand sidebar" style={btnStyle}>☰</button>
    </div>
  )
}
