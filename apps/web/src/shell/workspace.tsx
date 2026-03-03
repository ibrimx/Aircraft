/**
 * Workspace — Framer 2025 Desktop Style
 * @package apps/web
 */

import { useState, useCallback, type ReactNode, type CSSProperties } from 'react'
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react'
import { useThemeTokens } from '@aircraft/design-tokens'

export type WorkspaceProps = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export function Workspace({ children, className, style }: WorkspaceProps) {
  const theme = useThemeTokens()
  const [zoom, setZoom] = useState(100)
  const [hoveredZoomBtn, setHoveredZoomBtn] = useState<string | null>(null)

  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(z + 25, 400)), [])
  const handleZoomOut = useCallback(() => setZoom((z) => Math.max(z - 25, 25)), [])
  const handleZoomReset = useCallback(() => setZoom(100), [])

  const mainStyle: CSSProperties = {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    background: theme.colors.background.secondary,
    ...style,
  }

  const gridStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    opacity: 0.02,
    backgroundImage: `
      linear-gradient(${theme.colors.text.primary} 1px, transparent 1px),
      linear-gradient(90deg, ${theme.colors.text.primary} 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px',
    pointerEvents: 'none',
  }

  const canvasContainerStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const canvasStyle: CSSProperties = {
    width: '1440px',
    height: '900px',
    background: '#ffffff',
    borderRadius: '2px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
    transform: `scale(${zoom / 100})`,
    transformOrigin: 'center center',
    transition: 'transform 0.15s ease-out',
  }

  const zoomBarStyle: CSSProperties = {
    position: 'absolute',
    insetBlockEnd: '12px',
    insetInlineEnd: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    background: theme.colors.surface.default,
    border: `1px solid ${theme.colors.border.subtle}`,
    borderRadius: '6px',
    padding: '3px',
  }

  const zoomBtnStyle = (id: string): CSSProperties => ({
    width: '26px',
    height: '26px',
    display: 'grid',
    placeItems: 'center',
    background: hoveredZoomBtn === id ? 'rgba(255,255,255,0.04)' : 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: theme.colors.text.secondary,
    transition: 'background 0.08s ease',
  })

  const zoomLabelStyle: CSSProperties = {
    minWidth: '44px',
    textAlign: 'center',
    fontSize: '11px',
    fontWeight: 500,
    color: theme.colors.text.primary,
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
  }

  return (
    <main className={className} style={mainStyle}>
      <div style={gridStyle} />

      <div style={canvasContainerStyle}>
        <div style={canvasStyle}>
          {children}
        </div>
      </div>

      <div style={zoomBarStyle}>
        <button
          onClick={handleZoomOut}
          onPointerEnter={() => setHoveredZoomBtn('out')}
          onPointerLeave={() => setHoveredZoomBtn(null)}
          aria-label="Zoom out"
          style={zoomBtnStyle('out')}
        >
          <ZoomOut size={14} />
        </button>
        <button
          onClick={handleZoomReset}
          style={zoomLabelStyle}
          aria-label="Reset zoom"
        >
          {zoom}%
        </button>
        <button
          onClick={handleZoomIn}
          onPointerEnter={() => setHoveredZoomBtn('in')}
          onPointerLeave={() => setHoveredZoomBtn(null)}
          aria-label="Zoom in"
          style={zoomBtnStyle('in')}
        >
          <ZoomIn size={14} />
        </button>
        <div style={{ width: '1px', height: '16px', background: theme.colors.border.subtle, marginInline: '2px' }} />
        <button
          onClick={handleZoomReset}
          onPointerEnter={() => setHoveredZoomBtn('fit')}
          onPointerLeave={() => setHoveredZoomBtn(null)}
          aria-label="Fit to screen"
          style={zoomBtnStyle('fit')}
        >
          <Maximize size={14} />
        </button>
      </div>
    </main>
  )
}
