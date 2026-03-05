import type { Point, ToolId, Id } from './types'

/**
 * R2 ✅ typed actions (single dispatch surface)
 */
export type RuntimeAction =
  | { type: 'tool.set'; tool: ToolId }
  | { type: 'selection.set'; ids: Id[] }
  | { type: 'text.createAt'; at: Point }
  | { type: 'text.setEditing'; id: Id; editing: boolean }
  | { type: 'text.insert'; id: Id; text: string }
  | { type: 'text.backspace'; id: Id }
  | { type: 'text.commit'; id: Id }
  | { type: 'doc.rename'; title: string }
