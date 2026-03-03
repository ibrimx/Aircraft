import { create } from 'zustand'
import type { ToolState, Tool } from '../types'

export const useToolStore = create<ToolState>()((set, get) => ({
  activeTool: 'select',
  previousTool: null,

  setTool: (tool: Tool) => {
    set((state) => ({
      activeTool: tool,
      previousTool: state.activeTool,
    }))
  },

  setPreviousTool: () => {
    const { previousTool } = get()
    if (previousTool) {
      set({ activeTool: previousTool, previousTool: null })
    }
  },

  resetTool: () => {
    set({ activeTool: 'select', previousTool: null })
  },
}))
