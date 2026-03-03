import { create } from 'zustand'
import type { HistoryState, HistoryAction } from '../types'

const MAX_HISTORY_SIZE = 100

export const useHistoryStore = create<HistoryState>()((set, get) => ({
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  push: (action: HistoryAction) => {
    set((state) => {
      const newPast = [...state.past, action].slice(-MAX_HISTORY_SIZE)
      return {
        past: newPast,
        future: [],
        canUndo: newPast.length > 0,
        canRedo: false,
      }
    })
  },

  undo: () => {
    const { past, future } = get()
    if (past.length === 0) return

    const action = past[past.length - 1]
    action.undo()

    set({
      past: past.slice(0, -1),
      future: [action, ...future],
      canUndo: past.length > 1,
      canRedo: true,
    })
  },

  redo: () => {
    const { past, future } = get()
    if (future.length === 0) return

    const action = future[0]
    action.redo()

    set({
      past: [...past, action],
      future: future.slice(1),
      canUndo: true,
      canRedo: future.length > 1,
    })
  },

  clear: () => {
    set({
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
    })
  },
}))
