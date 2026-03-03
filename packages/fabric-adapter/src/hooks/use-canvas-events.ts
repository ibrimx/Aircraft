import { useEffect } from 'react'
import type { fabric } from 'fabric'
import type { CanvasElement } from '../types'

export type CanvasEventHandlers = {
  onSelectionChange?: (ids: string[]) => void
  onElementModified?: (element: CanvasElement) => void
  onElementAdded?: (element: CanvasElement) => void
  onElementRemoved?: (id: string) => void
  onZoomChange?: (zoom: number) => void
}

export function useCanvasEvents(
  canvas: fabric.Canvas | null,
  handlers: CanvasEventHandlers
) {
  useEffect(() => {
    if (!canvas) return

    const onSelectionCreated = (e: any) => {
      const ids = e.selected?.map((obj: any) => obj.data?.id).filter(Boolean) || []
      handlers.onSelectionChange?.(ids)
    }

    const onSelectionUpdated = (e: any) => {
      const ids = e.selected?.map((obj: any) => obj.data?.id).filter(Boolean) || []
      handlers.onSelectionChange?.(ids)
    }

    const onSelectionCleared = () => {
      handlers.onSelectionChange?.([])
    }

    const onObjectModified = (e: any) => {
      if (e.target?.data?.id) {
        // Element modified - could extract and pass element data
        handlers.onElementModified?.({
          id: e.target.data.id,
          type: 'rectangle',
          name: e.target.data.name || 'Element',
          x: e.target.left || 0,
          y: e.target.top || 0,
          width: e.target.getScaledWidth() || 0,
          height: e.target.getScaledHeight() || 0,
          rotation: e.target.angle || 0,
          scaleX: e.target.scaleX || 1,
          scaleY: e.target.scaleY || 1,
          fill: e.target.fill || null,
          stroke: e.target.stroke || null,
          strokeWidth: e.target.strokeWidth || 0,
          opacity: e.target.opacity || 1,
          visible: e.target.visible !== false,
          locked: !e.target.selectable,
        })
      }
    }

    canvas.on('selection:created', onSelectionCreated)
    canvas.on('selection:updated', onSelectionUpdated)
    canvas.on('selection:cleared', onSelectionCleared)
    canvas.on('object:modified', onObjectModified)

    return () => {
      canvas.off('selection:created', onSelectionCreated)
      canvas.off('selection:updated', onSelectionUpdated)
      canvas.off('selection:cleared', onSelectionCleared)
      canvas.off('object:modified', onObjectModified)
    }
  }, [canvas, handlers])
}
