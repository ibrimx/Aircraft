/**
 * Public runtime exports (stable surface)
 *
 * R7 ✅ We expose createEditorRuntime as stable name.
 */
export type { EditorRuntime } from './createRuntime'
export { createRuntime as createEditorRuntime } from './createRuntime'
