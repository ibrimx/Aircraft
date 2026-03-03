const counters: Map<string, number> = new Map()

export function generateElementName(type: string): string {
  const current = counters.get(type) || 0
  const next = current + 1
  counters.set(type, next)

  const typeNames: Record<string, string> = {
    rectangle: 'Rectangle',
    ellipse: 'Ellipse',
    text: 'Text',
    frame: 'Frame',
    image: 'Image',
    group: 'Group',
    line: 'Line',
  }

  const name = typeNames[type] || 'Element'
  return `${name} ${next}`
}

export function resetCounters(): void {
  counters.clear()
}
