import type { fabric } from 'fabric'

export type ElementType = 'frame' | 'rectangle' | 'ellipse' | 'text' | 'image' | 'group'

export type CanvasElement = {
  id: string
  type: ElementType
  name: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  scaleX: number
  scaleY: number
  fill: string | null
  stroke: string | null
  strokeWidth: number
  opacity: number
  visible: boolean
  locked: boolean
  cornerRadius?: number | [number, number, number, number]
  shadow?: {
    color: string
    blur: number
    offsetX: number
    offsetY: number
  } | null
  // Text specific
  text?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: string | number
  textAlign?: 'left' | 'center' | 'right'
  lineHeight?: number
  // Parent/children for frames
  parentId?: string | null
  children?: string[]
}

export type CanvasState = {
  elements: Map<string, CanvasElement>
  selectedIds: Set<string>
  zoom: number
  panX: number
  panY: number
}

export type CreateElementOptions = {
  x?: number
  y?: number
  width?: number
  height?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  text?: string
  fontSize?: number
  fontFamily?: string
}

export type CanvasEventType =
  | 'selection:created'
  | 'selection:updated'
  | 'selection:cleared'
  | 'object:modified'
  | 'object:added'
  | 'object:removed'
  | 'zoom:changed'
  | 'pan:changed'

export type CanvasEventCallback = (data: any) => void
