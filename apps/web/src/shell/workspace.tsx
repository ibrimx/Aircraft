/**
 * Workspace — Framer 2025 Desktop Style
 * Now with Canvas integration
 * @package apps/web
 */

'use client'

import { useRef, type ReactNode, type CSSProperties } from 'react'
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react'
import { useThemeTokens } from '@aircraft/design-tokens'
import { AircraftCanvas, type AircraftCanvasRef } from '@aircraft/fabric-adapter'
import { useBuilder } from '@aircraft/builder-engine'

export type WorkspaceProps = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export function Workspace({ children, className, style }: WorkspaceProps) {
  const theme = useThemeTokens()
  const builder = useBuilder()

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
    zIndex: 10,
  }

  const zoomBtnStyle = (isHovered: boolean): CSSProperties => ({
    width: '26px',
    height: '26px',
    display: 'grid',
    placeItems: 'center',
    background: isHovered ? 'rgba(255,255,255,0.04)' : 'transparent',
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

  const [hoveredZoomBtn, setHoveredZoomBtn] = React.useState<string | null>(null)

  return (
    <main className={className} style={mainStyle}>
      <div style={gridStyle} />

      <div style={canvasContainerStyle}>
        <AircraftCanvas
          ref={builder.canvasRef}
          width={1440}
          height={900}
          backgroundColor="#ffffff"
          onSelectionChange={(ids) => {
            // Sync selection to store
          }}
          onElementChange={(element) => {
            // Sync element changes to store
          }}
          onZoomChange={(zoom) => {
            // Sync zoom to store
          }}
          style={{
            borderRadius: '2px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        />
      </div>

      <div style={zoomBarStyle}>
        <button
          onClick={builder.zoomOut}
          onPointerEnter={() => setHoveredZoomBtn('out')}
          onPointerLeave={() => setHoveredZoomBtn(null)}
          aria-label="Zoom out"
          style={zoomBtnStyle(hoveredZoomBtn === 'out')}
        >
          <ZoomOut size={14} />
        </button>
        <button
          onClick={builder.fitToScreen}
          style={zoomLabelStyle}
          aria-label="Reset zoom"
        >
          {Math.round(builder.zoom)}%
        </button>
        <button
          onClick={builder.zoomIn}
          onPointerEnter={() => setHoveredZoomBtn('in')}
          onPointerLeave={() => setHoveredZoomBtn(null)}
          aria-label="Zoom in"
          style={zoomBtnStyle(hoveredZoomBtn === 'in')}
        >
          <ZoomIn size={14} />
        </button>
        <div style={{ width: '1px', height: '16px', background: theme.colors.border.subtle, marginInline: '2px' }} />
        <button
          onClick={builder.fitToScreen}
          onPointerEnter={() => setHoveredZoomBtn('fit')}
          onPointerLeave={() => setHoveredZoomBtn(null)}
          aria-label="Fit to screen"
          style={zoomBtnStyle(hoveredZoomBtn === 'fit')}
        >
          <Maximize size={14} />
        </button>
      </div>

      {children}
    </main>
  )
}
