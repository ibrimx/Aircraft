/**
 * Workspace — Canvas with Tool Actions
 * @package apps/web
 */

'use client'

import React from 'react'
import { useRef, useCallback, type ReactNode, type CSSProperties } from 'react'
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react'
import { useThemeTokens } from '@aircraft/design-tokens'
import { AircraftCanvas } from '@aircraft/fabric-adapter/canvas'
import { useBuilder } from '@aircraft/builder-engine'

export type WorkspaceProps = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export function Workspace({ children, className, style }: WorkspaceProps) {
  const theme = useThemeTokens()
  const builder = useBuilder()
  const [hoveredZoomBtn, setHoveredZoomBtn] = React.useState<string | null>(null)

  // Handle canvas click to add elements
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - 720 + 100 // Adjust for canvas center (1440/2 - default element size)
    const y = e.clientY - rect.top - 450 + 75   // Adjust for canvas center (900/2 - default element size)

    switch (builder.activeTool) {
      case 'rectangle':
        builder.addRectangle({ x, y })
        builder.setTool('select') // Auto-switch back to select
        break
      case 'ellipse':
        builder.addEllipse({ x, y })
        builder.setTool('select')
        break
      case 'text':
        builder.addText({ x, y })
        builder.setTool('select')
        break
      case 'frame':
        builder.addFrame({ x, y })
        builder.setTool('select')
        break
    }
  }, [builder])

  const mainStyle: CSSProperties = {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    background: theme.colors.background.secondary,
    cursor: getCursor(builder.activeTool),
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

  return (
    <main className={className} style={mainStyle} onClick={handleCanvasClick}>
      <div style={gridStyle} />

      <div style={canvasContainerStyle}>
        <AircraftCanvas
          ref={builder.canvasRef}
          width={1440}
          height={900}
          backgroundColor="#ffffff"
          onSelectionChange={(ids) => {
            // Selection handled by store
          }}
          onElementChange={(element) => {
            // Element changes handled by store
          }}
          onZoomChange={(zoom) => {
            // Zoom handled by store
          }}
          style={{
            borderRadius: '2px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
            pointerEvents: builder.activeTool === 'select' ? 'auto' : 'none', // Disable canvas events when drawing
          }}
        />
      </div>

      <div style={zoomBarStyle}>
        <button
          onClick={(e) => {
            e.stopPropagation()
            builder.zoomOut()
          }}
          onPointerEnter={() => setHoveredZoomBtn('out')}
          onPointerLeave={() => setHoveredZoomBtn(null)}
          aria-label="Zoom out"
          style={zoomBtnStyle(hoveredZoomBtn === 'out')}
        >
          <ZoomOut size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            builder.fitToScreen()
          }}
          style={zoomLabelStyle}
          aria-label="Reset zoom"
        >
          {Math.round(builder.zoom)}%
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            builder.zoomIn()
          }}
          onPointerEnter={() => setHoveredZoomBtn('in')}
          onPointerLeave={() => setHoveredZoomBtn(null)}
          aria-label="Zoom in"
          style={zoomBtnStyle(hoveredZoomBtn === 'in')}
        >
          <ZoomIn size={14} />
        </button>
        <div style={{ width: '1px', height: '16px', background: theme.colors.border.subtle, marginInline: '2px' }} />
        <button
          onClick={(e) => {
            e.stopPropagation()
            builder.fitToScreen()
          }}
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

function getCursor(tool: string): string {
  switch (tool) {
    case 'select':
      return 'default'
    case 'hand':
      return 'grab'
    case 'zoom':
      return 'zoom-in'
    case 'rectangle':
    case 'ellipse':
    case 'text':
    case 'frame':
    case 'line':
    case 'pen':
      return 'crosshair'
    default:
      return 'default'
  }
}
