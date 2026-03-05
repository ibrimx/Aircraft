import type { Tool, ToolContext } from './types'
import type { Point } from '../state/types'

/**
 * Text tool MVP
 *
 * R5 ✅ Arabic-first: default direction RTL via reducer defaults.
 */
export function createTextTool(ctx: ToolContext): Tool {
  return {
    id: 'text',
    onPointerDown: (pt: Point) => {
      ctx.runtime.dispatch({ type: 'text.createAt', at: pt })
    },
    onKeyDown: (e: KeyboardEvent) => {
      const st = ctx.runtime.getState()
      const id = st.caret.nodeId
      if (!st.caret.isEditing || !id) return

      if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault()
        ctx.runtime.dispatch({ type: 'text.commit', id })
        return
      }
      if (e.key === 'Backspace') {
        e.preventDefault()
        ctx.runtime.dispatch({ type: 'text.backspace', id })
      }
    },
    onTextInput: (text: string) => {
      const st = ctx.runtime.getState()
      const id = st.caret.nodeId
      if (!st.caret.isEditing || !id || !text) return
      ctx.runtime.dispatch({ type: 'text.insert', id, text })
    },
  }
}
