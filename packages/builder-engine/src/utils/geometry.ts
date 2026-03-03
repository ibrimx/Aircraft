import type { CanvasElement } from '@aircraft/fabric-adapter'

export type BoundingBox = {
  x: number
  y: number
  width: number
  height: number
  centerX: number
  centerY: number
}

export function calculateBoundingBox(elements: CanvasElement[]): BoundingBox | null {
  if (elements.length === 0) return null

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  elements.forEach((el) => {
    const left = el.x
    const top = el.y
    const right = el.x + el.width * el.scaleX
    const bottom = el.y + el.height * el.scaleY

    minX = Math.min(minX, left)
    minY = Math.min(minY, top)
    maxX = Math.max(maxX, right)
    maxY = Math.max(maxY, bottom)
  })

  const width = maxX - minX
  const height = maxY - minY

  return {
    x: minX,
    y: minY,
    width,
    height,
    centerX: minX + width / 2,
    centerY: minY + height / 2,
  }
}

export function isPointInBounds(
  x: number,
  y: number,
  bounds: BoundingBox
): boolean {
  return (
    x >= bounds.x &&
    x <= bounds.x + bounds.width &&
    y >= bounds.y &&
    y <= bounds.y + bounds.height
  )
}

export function expandBounds(
  bounds: BoundingBox,
  padding: number
): BoundingBox {
  return {
    x: bounds.x - padding,
    y: bounds.y - padding,
    width: bounds.width + padding * 2,
    height: bounds.height + padding * 2,
    centerX: bounds.centerX,
    centerY: bounds.centerY,
  }
}
