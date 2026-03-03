import type { CanvasElement } from './types'

export type SerializedCanvas = {
  version: string
  elements: CanvasElement[]
  viewport: {
    zoom: number
    panX: number
    panY: number
  }
}

export function serializeCanvas(
  elements: CanvasElement[],
  zoom: number = 100,
  panX: number = 0,
  panY: number = 0
): string {
  const data: SerializedCanvas = {
    version: '1.0.0',
    elements,
    viewport: { zoom, panX, panY },
  }
  return JSON.stringify(data, null, 2)
}

export function deserializeCanvas(json: string): SerializedCanvas | null {
  try {
    const data = JSON.parse(json) as SerializedCanvas
    if (!data.version || !Array.isArray(data.elements)) {
      return null
    }
    return data
  } catch {
    return null
  }
}
