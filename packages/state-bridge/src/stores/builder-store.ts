import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { CanvasElement } from '@aircraft/fabric-adapter'
import type { BuilderState } from '../types'

const initialState = {
  documentId: null,
  documentName: 'Untitled',
  isDirty: false,
  lastSaved: null,
  elements: new Map<string, CanvasElement>(),
  elementOrder: [] as string[],
  selectedIds: new Set<string>(),
  hoveredId: null,
  zoom: 100,
  panX: 0,
  panY: 0,
}

export const useBuilderStore = create<BuilderState>()(
  immer((set, get) => ({
    ...initialState,

    setDocumentName: (name: string) => {
      set((state) => {
        state.documentName = name
        state.isDirty = true
      })
    },

    setDirty: (dirty: boolean) => {
      set((state) => {
        state.isDirty = dirty
        if (!dirty) {
          state.lastSaved = Date.now()
        }
      })
    },

    addElement: (element: CanvasElement) => {
      set((state) => {
        state.elements.set(element.id, element)
        state.elementOrder.push(element.id)
        state.isDirty = true
      })
    },

    removeElement: (id: string) => {
      set((state) => {
        state.elements.delete(id)
        state.elementOrder = state.elementOrder.filter((eid) => eid !== id)
        state.selectedIds.delete(id)
        state.isDirty = true
      })
    },

    updateElement: (id: string, updates: Partial<CanvasElement>) => {
      set((state) => {
        const element = state.elements.get(id)
        if (element) {
          state.elements.set(id, { ...element, ...updates })
          state.isDirty = true
        }
      })
    },

    setSelectedIds: (ids: string[]) => {
      set((state) => {
        state.selectedIds = new Set(ids)
      })
    },

    addToSelection: (id: string) => {
      set((state) => {
        state.selectedIds.add(id)
      })
    },

    removeFromSelection: (id: string) => {
      set((state) => {
        state.selectedIds.delete(id)
      })
    },

    clearSelection: () => {
      set((state) => {
        state.selectedIds.clear()
      })
    },

    setHoveredId: (id: string | null) => {
      set((state) => {
        state.hoveredId = id
      })
    },

    setZoom: (zoom: number) => {
      set((state) => {
        state.zoom = Math.min(Math.max(zoom, 10), 400)
      })
    },

    setPan: (x: number, y: number) => {
      set((state) => {
        state.panX = x
        state.panY = y
      })
    },

    reorderElement: (id: string, newIndex: number) => {
      set((state) => {
        const currentIndex = state.elementOrder.indexOf(id)
        if (currentIndex === -1) return

        state.elementOrder.splice(currentIndex, 1)
        state.elementOrder.splice(newIndex, 0, id)
        state.isDirty = true
      })
    },

    duplicateElements: (ids: string[]) => {
      const newIds: string[] = []
      set((state) => {
        ids.forEach((id) => {
          const element = state.elements.get(id)
          if (element) {
            const newId = `${element.id}_copy_${Date.now()}`
            const newElement: CanvasElement = {
              ...element,
              id: newId,
              name: `${element.name} Copy`,
              x: element.x + 20,
              y: element.y + 20,
            }
            state.elements.set(newId, newElement)
            state.elementOrder.push(newId)
            newIds.push(newId)
          }
        })
        state.selectedIds = new Set(newIds)
        state.isDirty = true
      })
      return newIds
    },

    groupElements: (ids: string[]) => {
      let groupId = ''
      set((state) => {
        if (ids.length < 2) return

        groupId = `group_${Date.now()}`
        const elements = ids.map((id) => state.elements.get(id)).filter(Boolean) as CanvasElement[]

        // Calculate bounding box
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
        elements.forEach((el) => {
          minX = Math.min(minX, el.x)
          minY = Math.min(minY, el.y)
          maxX = Math.max(maxX, el.x + el.width)
          maxY = Math.max(maxY, el.y + el.height)
        })

        const group: CanvasElement = {
          id: groupId,
          type: 'group',
          name: 'Group',
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          fill: null,
          stroke: null,
          strokeWidth: 0,
          opacity: 1,
          visible: true,
          locked: false,
          children: ids,
        }

        // Update children parent
        ids.forEach((id) => {
          const el = state.elements.get(id)
          if (el) {
            state.elements.set(id, { ...el, parentId: groupId })
          }
        })

        // Remove children from order, add group
        state.elementOrder = state.elementOrder.filter((id) => !ids.includes(id))
        state.elements.set(groupId, group)
        state.elementOrder.push(groupId)
        state.selectedIds = new Set([groupId])
        state.isDirty = true
      })
      return groupId
    },

    ungroupElement: (groupId: string) => {
      const childIds: string[] = []
      set((state) => {
        const group = state.elements.get(groupId)
        if (!group || group.type !== 'group' || !group.children) return

        // Restore children
        group.children.forEach((childId) => {
          const child = state.elements.get(childId)
          if (child) {
            state.elements.set(childId, { ...child, parentId: null })
            childIds.push(childId)
          }
        })

        // Remove group, add children back to order
        state.elements.delete(groupId)
        const groupIndex = state.elementOrder.indexOf(groupId)
        state.elementOrder.splice(groupIndex, 1, ...childIds)
        state.selectedIds = new Set(childIds)
        state.isDirty = true
      })
      return childIds
    },

    getElement: (id: string) => {
      return get().elements.get(id)
    },

    getSelectedElements: () => {
      const state = get()
      return Array.from(state.selectedIds)
        .map((id) => state.elements.get(id))
        .filter(Boolean) as CanvasElement[]
    },

    reset: () => {
      set((state) => {
        Object.assign(state, {
          ...initialState,
          elements: new Map(),
          elementOrder: [],
          selectedIds: new Set(),
        })
      })
    },
  }))
)
