import type { Tool, ToolContext } from './types'
import type { Point } from '../state/types'

/**
 * Select tool MVP: no hit testing yet.
 * R3 ✅ still respects Tool interface.
 */
export function createSelectTool(_ctx: ToolContext): Tool {
  return {
    id: 'select',
    onPointerDown: (_pt: Point) => {
      // TODO: hit-test and set selection
    },
  }
}
