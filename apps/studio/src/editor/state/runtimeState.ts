import type { Doc } from './doc'
import type { Id, ToolId } from './types'

/**
 * Runtime UI/editor state
 *
 * R1 ✅ single state object
 * R6 ✅ keep it serializable & easy to diff for autosave
 */
export type CaretState = {
  isEditing: boolean
  nodeId: Id | null
  index: number
}

export type RuntimeState = {
  tool: ToolId
  doc: Doc
  caret: CaretState
}

export function createInitialRuntimeState(doc: Doc): RuntimeState {
  return {
    tool: 'select',
    doc,
    caret: { isEditing: false, nodeId: null, index: 0 },
  }
}
