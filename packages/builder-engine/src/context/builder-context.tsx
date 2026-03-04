import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react'
import type { AircraftCanvasRef, CanvasElement, CreateElementOptions } from '@aircraft/fabric-adapter'
import { createRectangle, createEllipse, createText, createFrame } from '@aircraft/fabric-adapter'
import { useBuilderStore, useToolStore, useHistoryStore, type Tool } from '@aircraft/state-bridge'

export type BuilderContextValue = {
  // Canvas ref
  canvasRef: React.RefObject<AircraftCanvasRef>

  // Element actions
  addRectangle: (options?: CreateElementOptions) => string
  addEllipse: (options?: CreateElementOptions) => string
  addText: (options?: CreateElementOptions) => string
  addFrame: (options?: CreateElementOptions) => string
  deleteSelected: () => void
  duplicateSelected: () => void
  selectAll: () => void

  // Tool actions
  activeTool: Tool
  setTool: (tool: Tool) => void

  // Clipboard
  copy: () => void
  paste: () => void
  cut: () => void

  // History
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean

  // Selection
  selectedIds: string[]
  selectedElements: CanvasElement[]
  clearSelection: () => void

  // Viewport
  zoom: number
  zoomIn: () => void
  zoomOut: () => void
  zoomTo: (zoom: number) => void
  fitToScreen: () => void

  // Document
  documentName: string
  setDocumentName: (name: string) => void
  isDirty: boolean
  save: () => Promise<void>
}

const BuilderContext = createContext<BuilderContextValue | null>(null)

export type BuilderProviderProps = {
  children: ReactNode
  onSave?: (data: string) => Promise<void>
}

export function BuilderProvider({ children, onSave }: BuilderProviderProps) {
  const canvasRef = useRef<AircraftCanvasRef>(null)
  const clipboardRef = useRef<CanvasElement[]>([])

  // Stores
  const builderStore = useBuilderStore()
  const toolStore = useToolStore()
  const historyStore = useHistoryStore()

  // Add element helpers
  const addElement = useCallback((element: CanvasElement) => {
    builderStore.addElement(element)
    canvasRef.current?.addElement(element)

    // Push to history
    historyStore.push({
      type: 'add',
      timestamp: Date.now(),
      data: { element },
      undo: () => {
        builderStore.removeElement(element.id)
        canvasRef.current?.removeElement(element.id)
      },
      redo: () => {
        builderStore.addElement(element)
        canvasRef.current?.addElement(element)
      },
    })

    return element.id
  }, [builderStore, historyStore])

  const addRectangle = useCallback((options?: CreateElementOptions) => {
    const element = createRectangle(options)
    return addElement(element)
  }, [addElement])

  const addEllipse = useCallback((options?: CreateElementOptions) => {
    const element = createEllipse(options)
    return addElement(element)
  }, [addElement])

  const addText = useCallback((options?: CreateElementOptions) => {
    const element = createText(options)
    return addElement(element)
  }, [addElement])

  const addFrame = useCallback((options?: CreateElementOptions) => {
    const element = createFrame(options)
    return addElement(element)
  }, [addElement])

  // Delete selected
  const deleteSelected = useCallback(() => {
    const selectedIds = Array.from(builderStore.selectedIds)
    if (selectedIds.length === 0) return

    const deletedElements = selectedIds
      .map((id) => builderStore.getElement(id))
      .filter(Boolean) as CanvasElement[]

    selectedIds.forEach((id) => {
      builderStore.removeElement(id)
      canvasRef.current?.removeElement(id)
    })

    historyStore.push({
      type: 'delete',
      timestamp: Date.now(),
      data: { elements: deletedElements },
      undo: () => {
        deletedElements.forEach((el) => {
          builderStore.addElement(el)
          canvasRef.current?.addElement(el)
        })
      },
      redo: () => {
        deletedElements.forEach((el) => {
          builderStore.removeElement(el.id)
          canvasRef.current?.removeElement(el.id)
        })
      },
    })
  }, [builderStore, historyStore])

  // Duplicate selected
  const duplicateSelected = useCallback(() => {
    const selectedIds = Array.from(builderStore.selectedIds)
    if (selectedIds.length === 0) return

    const newIds = builderStore.duplicateElements(selectedIds)
    newIds.forEach((id) => {
      const element = builderStore.getElement(id)
      if (element) {
        canvasRef.current?.addElement(element)
      }
    })
  }, [builderStore])

  // Select all
  const selectAll = useCallback(() => {
    const allIds = builderStore.elementOrder
    builderStore.setSelectedIds(allIds)
    canvasRef.current?.selectElements(allIds)
  }, [builderStore])

  // Clipboard
  const copy = useCallback(() => {
    const selected = builderStore.getSelectedElements()
    clipboardRef.current = selected.map((el) => ({ ...el }))
  }, [builderStore])

  const paste = useCallback(() => {
    if (clipboardRef.current.length === 0) return

    const newIds: string[] = []
    clipboardRef.current.forEach((el) => {
      const newElement: CanvasElement = {
        ...el,
        id: `${el.id}_paste_${Date.now()}`,
        x: el.x + 20,
        y: el.y + 20,
      }
      builderStore.addElement(newElement)
      canvasRef.current?.addElement(newElement)
      newIds.push(newElement.id)
    })

    builderStore.setSelectedIds(newIds)
    canvasRef.current?.selectElements(newIds)
  }, [builderStore])

  const cut = useCallback(() => {
    copy()
    deleteSelected()
  }, [copy, deleteSelected])

  // Viewport
  const zoomIn = useCallback(() => {
    const newZoom = Math.min(builderStore.zoom + 25, 400)
    builderStore.setZoom(newZoom)
    canvasRef.current?.zoomTo(newZoom)
  }, [builderStore])

  const zoomOut = useCallback(() => {
    const newZoom = Math.max(builderStore.zoom - 25, 10)
    builderStore.setZoom(newZoom)
    canvasRef.current?.zoomTo(newZoom)
  }, [builderStore])

  const zoomTo = useCallback((zoom: number) => {
    builderStore.setZoom(zoom)
    canvasRef.current?.zoomTo(zoom)
  }, [builderStore])

  const fitToScreen = useCallback(() => {
    zoomTo(100)
  }, [zoomTo])

  // Save
  const save = useCallback(async () => {
    const json = canvasRef.current?.exportJSON() || '{}'
    await onSave?.(json)
    builderStore.setDirty(false)
  }, [builderStore, onSave])

  // Selection sync
  const handleSelectionChange = useCallback((ids: string[]) => {
    builderStore.setSelectedIds(ids)
  }, [builderStore])

  // Element change sync
  const handleElementChange = useCallback((element: CanvasElement) => {
    builderStore.updateElement(element.id, element)
  }, [builderStore])

  // Zoom sync
  const handleZoomChange = useCallback((zoom: number) => {
    builderStore.setZoom(zoom)
  }, [builderStore])

  const value: BuilderContextValue = {
    canvasRef,

    addRectangle,
    addEllipse,
    addText,
    addFrame,
    deleteSelected,
    duplicateSelected,
    selectAll,

    activeTool: toolStore.activeTool,
    setTool: toolStore.setTool,

    copy,
    paste,
    cut,

    undo: historyStore.undo,
    redo: historyStore.redo,
    canUndo: historyStore.canUndo,
    canRedo: historyStore.canRedo,

    selectedIds: Array.from(builderStore.selectedIds),
    selectedElements: builderStore.getSelectedElements(),
    clearSelection: builderStore.clearSelection,

    zoom: builderStore.zoom,
    zoomIn,
    zoomOut,
    zoomTo,
    fitToScreen,

    documentName: builderStore.documentName,
    setDocumentName: builderStore.setDocumentName,
    isDirty: builderStore.isDirty,
    save,
  }

  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  )
}

export function useBuilder(): BuilderContextValue {
  const context = useContext(BuilderContext)
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider')
  }
  return context
}
