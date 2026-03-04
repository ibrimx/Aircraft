import { useEffect } from 'react'
import type { Canvas as FabricCanvas, FabricObject } from 'fabric'
import type { CanvasElement } from '../types'

export type CanvasEventHandlers = {
  onSelectionChange?: (ids: string[]) => void
  onElementModified?: (element: CanvasElement) => void
  onElementAdded?: (element: CanvasElement) => void
  onElementRemoved?: (id: string) => void
  onZoomChange?: (zoom: number) => void
}

type FabricObjectWithData = FabricObject & { data?: { id?: string; name?: string } }

const isDefinedString = (value: string | undefined): value is string => Boolean(value)

export function useCanvasEvents(canvas: FabricCanvas | null, handlers: CanvasEventHandlers) {
  useEffect(() => {
    if (!canvas) return

    const onSelectionCreated = (e: { selected?: FabricObjectWithData[] }) => {
      const ids = e.selected?.map((obj) => obj.data?.id).filter(isDefinedString) || []
      handlers.onSelectionChange?.(ids)
    }

    const onSelectionUpdated = (e: { selected?: FabricObjectWithData[] }) => {
      const ids = e.selected?.map((obj) => obj.data?.id).filter(isDefinedString) || []
      handlers.onSelectionChange?.(ids)
    }

    const onSelectionCleared = () => {
      handlers.onSelectionChange?.([])
    }

    const onObjectModified = (e: { target?: FabricObjectWithData }) => {
      if (e.target?.data?.id) {
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
          fill: (e.target.fill as string) || null,
          stroke: (e.target.stroke as string) || null,
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
