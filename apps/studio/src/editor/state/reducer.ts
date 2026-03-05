import type { RuntimeState } from './runtimeState'
import type { RuntimeAction } from './actions'
import type { TextNode } from './doc'

function uid(prefix = 'n'): string {
  return `${prefix}_${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`
}

export function runtimeReducer(state: RuntimeState, action: RuntimeAction): RuntimeState {
  switch (action.type) {
    case 'tool.set':
      return { ...state, tool: action.tool }
    case 'selection.set':
      return { ...state, doc: { ...state.doc, selectedIds: action.ids } }
    case 'doc.rename':
      return { ...state, doc: { ...state.doc, title: action.title } }
    case 'text.createAt': {
      const id = uid('text')
      const node: TextNode = {
        id,
        type: 'text',
        name: 'Text',
        visible: true,
        locked: false,
        position: { x: action.at.x, y: action.at.y },
        size: { w: 320, h: 80 },
        rotation: 0,
        text: '',
        style: {
          fontFamily: 'Noto Sans Arabic',
          fontSize: 48,
          fontWeight: 600,
          lineHeight: 1.15,
          letterSpacing: 0,
          fill: 'rgba(255,255,255,0.92)',
          align: 'start',
          direction: 'rtl',
          stroke: { enabled: false, width: 2, color: 'rgba(0,0,0,1)', opacity: 1 },
          shadow: { enabled: false, blur: 10, x: 0, y: 6, color: 'rgba(0,0,0,1)', opacity: 0.35 },
          warp: { enabled: false, kind: 'none', amount: 0 },
        },
      }

      return {
        ...state,
        doc: {
          ...state.doc,
          nodes: { ...state.doc.nodes, [id]: node },
          order: [...state.doc.order, id],
          selectedIds: [id],
        },
        caret: { isEditing: true, nodeId: id, index: 0 },
      }
    }
    case 'text.setEditing':
      return {
        ...state,
        caret: {
          isEditing: action.editing,
          nodeId: action.editing ? action.id : null,
          index: action.editing ? state.caret.index : 0,
        },
      }
    case 'text.insert': {
      const node = state.doc.nodes[action.id]
      if (!node || node.type !== 'text') return state
      const before = node.text.slice(0, state.caret.index)
      const after = node.text.slice(state.caret.index)
      const nextText = before + action.text + after
      const nextIndex = state.caret.index + action.text.length
      return {
        ...state,
        doc: { ...state.doc, nodes: { ...state.doc.nodes, [action.id]: { ...node, text: nextText } } },
        caret: { ...state.caret, isEditing: true, nodeId: action.id, index: nextIndex },
      }
    }
    case 'text.backspace': {
      const node = state.doc.nodes[action.id]
      if (!node || node.type !== 'text') return state
      if (state.caret.index <= 0) return state
      const before = node.text.slice(0, state.caret.index - 1)
      const after = node.text.slice(state.caret.index)
      return {
        ...state,
        doc: { ...state.doc, nodes: { ...state.doc.nodes, [action.id]: { ...node, text: before + after } } },
        caret: { ...state.caret, index: Math.max(0, state.caret.index - 1) },
      }
    }
    case 'text.commit':
      return { ...state, caret: { isEditing: false, nodeId: null, index: 0 } }
    default:
      return state
  }
}
