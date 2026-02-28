/**
 * P25 — floating-panel.tsx · Floating panel with RTL-safe placement
 * @package @brimair/ui
 * Absolute-positioned GlassPanel using Z_INDEX tokens + logical properties.
 * 📖 DSG §6.2 Glass · §7 Z-Index · §11 RTL
 * 📖 PAGE BUILDER §6 RTL logical properties
 * 📖 STUDIO §11 z-index tokens only
 */

import type { ReactNode, CSSProperties } from 'react'
import { Z_INDEX } from '@brimair/design-tokens'
import { GlassPanel } from './glass-panel'

export type FloatingPanelPlacement = 'top' | 'bottom' | 'left' | 'right'

export type FloatingPanelProps = {
  placement?: FloatingPanelPlacement
  offset?: number
  width?: number | string
  zIndex?: number
  children: ReactNode
  className?: string
  style?: CSSProperties
}

const PLACEMENT_STYLES: Record<FloatingPanelPlacement, (o: number) => CSSProperties> = {
  top:    (o) => ({ bottom: '100%', marginBottom: o, insetInlineStart: 0 }),
  bottom: (o) => ({ top: '100%', marginTop: o, insetInlineStart: 0 }),
  left:   (o) => ({ insetInlineEnd: '100%', marginInlineEnd: o, top: 0 }),
  right:  (o) => ({ insetInlineStart: '100%', marginInlineStart: o, top: 0 }),
}

export function FloatingPanel({
  placement = 'right',
  offset = 8,
  width = 280,
  zIndex = Z_INDEX.popover,
  children,
  className,
  style,
}: FloatingPanelProps): JSX.Element {
  return (
    <GlassPanel
      className={className}
      style=
        position: 'absolute',
        width,
        zIndex,
        ...PLACEMENT_STYLES[placement](offset),
        ...style,
      
    >
      {children}
    </GlassPanel>
  )
}
