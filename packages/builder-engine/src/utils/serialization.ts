import type { CanvasElement } from '@aircraft/fabric-adapter'
import { useBuilderStore } from '@aircraft/state-bridge'

export type DocumentData = {
  version: string
  name: string
  elements: CanvasElement[]
  elementOrder: string[]
  viewport: {
    zoom: number
    panX: number
    panY: number
  }
  createdAt: number
  updatedAt: number
}

export function exportToJSON(): string {
  const store = useBuilderStore.getState()

  const data: DocumentData = {
    version: '1.0.0',
    name: store.documentName,
    elements: Array.from(store.elements.values()),
    elementOrder: store.elementOrder,
    viewport: {
      zoom: store.zoom,
      panX: store.panX,
      panY: store.panY,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  return JSON.stringify(data, null, 2)
}

export function importFromJSON(json: string): boolean {
  try {
    const data = JSON.parse(json) as DocumentData

    if (!data.version || !Array.isArray(data.elements)) {
      console.error('Invalid document format')
      return false
    }

    const store = useBuilderStore.getState()

    // Reset store
    store.reset()

    // Set document name
    store.setDocumentName(data.name || 'Imported Document')

    // Add elements
    data.elements.forEach((element) => {
      store.addElement(element)
    })

    // Set viewport
    if (data.viewport) {
      store.setZoom(data.viewport.zoom)
      store.setPan(data.viewport.panX, data.viewport.panY)
    }

    return true
  } catch (error) {
    console.error('Failed to import document:', error)
    return false
  }
}

export function downloadJSON(filename: string = 'document.json'): void {
  const json = exportToJSON()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
