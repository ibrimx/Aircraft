import type { CanvasElement } from '@aircraft/fabric-adapter'

export type Tool =
  | 'select'
  | 'frame'
  | 'rectangle'
  | 'ellipse'
  | 'text'
  | 'line'
  | 'pen'
  | 'hand'
  | 'zoom'

export type BuilderState = {
  // Document
  documentId: string | null
  documentName: string
  isDirty: boolean
  lastSaved: number | null

  // Elements
  elements: Map<string, CanvasElement>
  elementOrder: string[]

  // Selection
  selectedIds: Set<string>
  hoveredId: string | null

  // Viewport
  zoom: number
  panX: number
  panY: number

  // Actions
  setDocumentName: (name: string) => void
  setDirty: (dirty: boolean) => void
  addElement: (element: CanvasElement) => void
  removeElement: (id: string) => void
  updateElement: (id: string, updates: Partial<CanvasElement>) => void
  setSelectedIds: (ids: string[]) => void
  addToSelection: (id: string) => void
  removeFromSelection: (id: string) => void
  clearSelection: () => void
  setHoveredId: (id: string | null) => void
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  reorderElement: (id: string, newIndex: number) => void
  duplicateElements: (ids: string[]) => string[]
  groupElements: (ids: string[]) => string
  ungroupElement: (groupId: string) => string[]
  getElement: (id: string) => CanvasElement | undefined
  getSelectedElements: () => CanvasElement[]
  reset: () => void
}

export type HistoryAction = {
  type: string
  timestamp: number
  data: any
  undo: () => void
  redo: () => void
}

export type HistoryState = {
  past: HistoryAction[]
  future: HistoryAction[]
  canUndo: boolean
  canRedo: boolean

  push: (action: HistoryAction) => void
  undo: () => void
  redo: () => void
  clear: () => void
}

export type ToolState = {
  activeTool: Tool
  previousTool: Tool | null

  setTool: (tool: Tool) => void
  setPreviousTool: () => void
  resetTool: () => void
}
