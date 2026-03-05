import type { Point } from '../state/types'
import type { EditorRuntime } from '../runtime/createRuntime'

/**
 * Tool contract
 *
 * R3 ✅ contract ثابت: UI ينادي نفس الدوال على أي أداة
 */
export type Tool = {
  id: string
  onPointerDown?: (pt: Point) => void
  onKeyDown?: (e: KeyboardEvent) => void
  onTextInput?: (text: string) => void
}

export type ToolContext = {
  runtime: EditorRuntime
}
