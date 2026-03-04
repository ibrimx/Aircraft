import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import {
  ActiveSelection,
  Canvas as FabricCanvas,
  Ellipse,
  Group,
  IText,
  Image as FabricImage,
  Point,
  Rect,
} from 'fabric'
import type { CSSProperties } from 'react'
import type { FabricObject, TEvent, TPointerEvent } from 'fabric'
import type { CanvasElement, CanvasEventCallback, CanvasEventType, ElementType } from './types'

export type AircraftCanvasProps = {
  width?: number
  height?: number
  backgroundColor?: string
  onReady?: (canvas: FabricCanvas) => void
  onSelectionChange?: (ids: string[]) => void
  onElementChange?: (element: CanvasElement) => void
  onZoomChange?: (zoom: number) => void
  className?: string
  style?: CSSProperties
}

export type AircraftCanvasRef = {
  canvas: FabricCanvas | null
  addElement: (element: CanvasElement) => void
  removeElement: (id: string) => void
  updateElement: (id: string, updates: Partial<CanvasElement>) => void
  selectElement: (id: string) => void
  selectElements: (ids: string[]) => void
  clearSelection: () => void
  getSelectedIds: () => string[]
  zoomTo: (zoom: number) => void
  panTo: (x: number, y: number) => void
  exportJSON: () => string
  importJSON: (json: string) => void
}

type PointerEventPayload = TEvent<TPointerEvent> & { e: TPointerEvent }
type FabricObjectWithData = FabricObject & { data?: { id?: string; name?: string } }

const isDefinedString = (value: string | undefined): value is string => Boolean(value)
const getObjectId = (obj: FabricObject): string | undefined => (obj as FabricObjectWithData).data?.id

export const AircraftCanvas = forwardRef<AircraftCanvasRef, AircraftCanvasProps>(
  function AircraftCanvas(
    {
      width = 1440,
      height = 900,
      backgroundColor = '#ffffff',
      onReady,
      onSelectionChange,
      onElementChange,
      onZoomChange,
      className,
      style,
    },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fabricRef = useRef<FabricCanvas | null>(null)
    const eventListeners = useRef<Map<CanvasEventType, Set<CanvasEventCallback>>>(new Map())

    // Keep declared listener map behavior intact
    void eventListeners

    // Initialize canvas
    useEffect(() => {
      if (!canvasRef.current || fabricRef.current) return

      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor,
        selection: true,
        preserveObjectStacking: true,
        renderOnAddRemove: true,
        enableRetinaScaling: true,
      })

      // Selection events
      canvas.on('selection:created', (e) => {
        const ids = e.selected?.map((obj) => getObjectId(obj)).filter(isDefinedString) || []
        onSelectionChange?.(ids)
      })

      canvas.on('selection:updated', (e) => {
        const ids = e.selected?.map((obj) => getObjectId(obj)).filter(isDefinedString) || []
        onSelectionChange?.(ids)
      })

      canvas.on('selection:cleared', () => {
        onSelectionChange?.([])
      })

      // Object modified
      canvas.on('object:modified', (e) => {
        if (e.target && getObjectId(e.target)) {
          const element = fabricObjectToElement(e.target as FabricObjectWithData)
          onElementChange?.(element)
        }
      })

      // Zoom with mouse wheel
      canvas.on('mouse:wheel', (opt: PointerEventPayload) => {
        const wheelEvent = opt.e as WheelEvent
        const delta = wheelEvent.deltaY
        let zoom = canvas.getZoom()
        zoom *= 0.999 ** delta
        zoom = Math.min(Math.max(0.1, zoom), 5)
        canvas.zoomToPoint(new Point(wheelEvent.offsetX, wheelEvent.offsetY), zoom)
        wheelEvent.preventDefault()
        wheelEvent.stopPropagation()
        onZoomChange?.(zoom * 100)
      })

      // Pan with space + drag
      let isPanning = false
      let lastPosX = 0
      let lastPosY = 0

      canvas.on('mouse:down', (opt: PointerEventPayload) => {
        const pointerEvent = opt.e as MouseEvent & { code?: string }
        if (pointerEvent.altKey || pointerEvent.code === 'Space') {
          isPanning = true
          canvas.selection = false
          lastPosX = pointerEvent.clientX
          lastPosY = pointerEvent.clientY
        }
      })

      canvas.on('mouse:move', (opt: PointerEventPayload) => {
        if (isPanning) {
          const pointerEvent = opt.e as MouseEvent
          const vpt = canvas.viewportTransform
          if (vpt) {
            vpt[4] += pointerEvent.clientX - lastPosX
            vpt[5] += pointerEvent.clientY - lastPosY
            canvas.requestRenderAll()
            lastPosX = pointerEvent.clientX
            lastPosY = pointerEvent.clientY
          }
        }
      })

      canvas.on('mouse:up', () => {
        isPanning = false
        canvas.selection = true
      })

      fabricRef.current = canvas
      onReady?.(canvas)

      return () => {
        canvas.dispose()
        fabricRef.current = null
      }
    }, [])

    // Update canvas size
    useEffect(() => {
      if (fabricRef.current) {
        fabricRef.current.setDimensions({ width, height })
      }
    }, [width, height])

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      canvas: fabricRef.current,

      addElement: (element: CanvasElement) => {
        const canvas = fabricRef.current
        if (!canvas) return

        const obj = elementToFabricObject(element)
        if (obj) {
          ;(obj as FabricObjectWithData).data = { id: element.id }
          canvas.add(obj)
          canvas.requestRenderAll()
        }
      },

      removeElement: (id: string) => {
        const canvas = fabricRef.current
        if (!canvas) return

        const obj = canvas
          .getObjects()
          .find((o) => (o as FabricObjectWithData).data?.id === id)
        if (obj) {
          canvas.remove(obj)
          canvas.requestRenderAll()
        }
      },

      updateElement: (id: string, updates: Partial<CanvasElement>) => {
        const canvas = fabricRef.current
        if (!canvas) return

        const obj = canvas
          .getObjects()
          .find((o) => (o as FabricObjectWithData).data?.id === id)
        if (obj) {
          applyUpdatesToObject(obj, updates)
          canvas.requestRenderAll()
        }
      },

      selectElement: (id: string) => {
        const canvas = fabricRef.current
        if (!canvas) return

        const obj = canvas
          .getObjects()
          .find((o) => (o as FabricObjectWithData).data?.id === id)
        if (obj) {
          canvas.setActiveObject(obj)
          canvas.requestRenderAll()
        }
      },

      selectElements: (ids: string[]) => {
        const canvas = fabricRef.current
        if (!canvas) return

        const objects = canvas
          .getObjects()
          .filter((o) => ids.includes((o as FabricObjectWithData).data?.id || ''))
        if (objects.length > 0) {
          const selection = new ActiveSelection(objects, { canvas })
          canvas.setActiveObject(selection)
          canvas.requestRenderAll()
        }
      },

      clearSelection: () => {
        const canvas = fabricRef.current
        if (!canvas) return

        canvas.discardActiveObject()
        canvas.requestRenderAll()
      },

      getSelectedIds: () => {
        const canvas = fabricRef.current
        if (!canvas) return []

        const active = canvas.getActiveObjects()
        return active.map((obj) => getObjectId(obj)).filter(isDefinedString)
      },

      zoomTo: (zoom: number) => {
        const canvas = fabricRef.current
        if (!canvas) return

        canvas.zoomToPoint(new Point(canvas.getWidth() / 2, canvas.getHeight() / 2), zoom / 100)
        canvas.requestRenderAll()
        onZoomChange?.(zoom)
      },

      panTo: (x: number, y: number) => {
        const canvas = fabricRef.current
        if (!canvas) return

        const vpt = canvas.viewportTransform
        if (vpt) {
          vpt[4] = x
          vpt[5] = y
          canvas.requestRenderAll()
        }
      },

      exportJSON: () => {
        const canvas = fabricRef.current
        if (!canvas) return '{}'

        const serializableCanvas = canvas as unknown as { toJSON: (propertiesToInclude?: string[]) => unknown }
        return JSON.stringify(serializableCanvas.toJSON(['data']))
      },

      importJSON: (json: string) => {
        const canvas = fabricRef.current
        if (!canvas) return

        void canvas.loadFromJSON(json).then(() => {
          canvas.requestRenderAll()
        })
      },
    }))

    return (
      <div className={className} style={style}>
        <canvas ref={canvasRef} />
      </div>
    )
  }
)

// Helper: Convert CanvasElement to Fabric object
function elementToFabricObject(element: CanvasElement): FabricObject | null {
  const baseOptions = {
    left: element.x,
    top: element.y,
    angle: element.rotation,
    scaleX: element.scaleX,
    scaleY: element.scaleY,
    opacity: element.opacity,
    visible: element.visible,
    selectable: !element.locked,
    evented: !element.locked,
  }

  switch (element.type) {
    case 'rectangle':
    case 'frame':
      return new Rect({
        ...baseOptions,
        width: element.width,
        height: element.height,
        fill: element.fill || 'transparent',
        stroke: element.stroke || undefined,
        strokeWidth: element.strokeWidth || 0,
        rx: typeof element.cornerRadius === 'number' ? element.cornerRadius : 0,
        ry: typeof element.cornerRadius === 'number' ? element.cornerRadius : 0,
      })

    case 'ellipse':
      return new Ellipse({
        ...baseOptions,
        rx: element.width / 2,
        ry: element.height / 2,
        fill: element.fill || 'transparent',
        stroke: element.stroke || undefined,
        strokeWidth: element.strokeWidth || 0,
      })

    case 'text':
      return new IText(element.text || 'Text', {
        ...baseOptions,
        fontSize: element.fontSize || 16,
        fontFamily: element.fontFamily || 'Inter',
        fontWeight: element.fontWeight || 'normal',
        fill: element.fill || '#000000',
        textAlign: element.textAlign || 'left',
      })

    default:
      return null
  }
}

// Helper: Convert Fabric object to CanvasElement
function fabricObjectToElement(obj: FabricObjectWithData): CanvasElement {
  const resolvedType = getElementType(obj)
  const base: CanvasElement = {
    id: obj.data?.id || '',
    type: resolvedType,
    name: obj.data?.name || resolvedType,
    x: obj.left || 0,
    y: obj.top || 0,
    width: obj.getScaledWidth() || 0,
    height: obj.getScaledHeight() || 0,
    rotation: obj.angle || 0,
    scaleX: obj.scaleX || 1,
    scaleY: obj.scaleY || 1,
    fill: (obj.fill as string) || null,
    stroke: (obj.stroke as string) || null,
    strokeWidth: obj.strokeWidth || 0,
    opacity: obj.opacity || 1,
    visible: obj.visible !== false,
    locked: !obj.selectable,
  }

  if (obj instanceof Rect) {
    base.cornerRadius = obj.rx || 0
  }

  if (obj instanceof IText) {
    base.text = obj.text || ''
    base.fontSize = obj.fontSize
    base.fontFamily = obj.fontFamily
    base.fontWeight = obj.fontWeight
    base.textAlign = obj.textAlign as 'left' | 'center' | 'right'
  }

  return base
}

// Helper: Get element type from Fabric object
function getElementType(obj: FabricObjectWithData): ElementType {
  if (obj instanceof IText) return 'text'
  if (obj instanceof Ellipse) return 'ellipse'
  if (obj instanceof Rect) return 'rectangle'
  if (obj instanceof Group) return 'group'
  if (obj instanceof FabricImage) return 'image'
  return 'rectangle'
}

// Helper: Apply updates to Fabric object
function applyUpdatesToObject(obj: FabricObject, updates: Partial<CanvasElement>): void {
  if (updates.x !== undefined) obj.set('left', updates.x)
  if (updates.y !== undefined) obj.set('top', updates.y)
  if (updates.rotation !== undefined) obj.set('angle', updates.rotation)
  if (updates.opacity !== undefined) obj.set('opacity', updates.opacity)
  if (updates.visible !== undefined) obj.set('visible', updates.visible)
  if (updates.locked !== undefined) {
    obj.set('selectable', !updates.locked)
    obj.set('evented', !updates.locked)
  }
  if (updates.fill !== undefined) obj.set('fill', updates.fill)
  if (updates.stroke !== undefined) obj.set('stroke', updates.stroke)
  if (updates.strokeWidth !== undefined) obj.set('strokeWidth', updates.strokeWidth)

  if (obj instanceof Rect && updates.cornerRadius !== undefined) {
    const r = typeof updates.cornerRadius === 'number' ? updates.cornerRadius : 0
    obj.set('rx', r)
    obj.set('ry', r)
  }

  if (obj instanceof IText) {
    if (updates.text !== undefined) obj.set('text', updates.text)
    if (updates.fontSize !== undefined) obj.set('fontSize', updates.fontSize)
    if (updates.fontFamily !== undefined) obj.set('fontFamily', updates.fontFamily)
    if (updates.fontWeight !== undefined) obj.set('fontWeight', updates.fontWeight)
    if (updates.textAlign !== undefined) obj.set('textAlign', updates.textAlign)
  }

  obj.setCoords()
}
