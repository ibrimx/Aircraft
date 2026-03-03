import { useEffect, useRef, useCallback } from 'react'
import { useBuilderStore } from '@aircraft/state-bridge'

export type AutoSaveOptions = {
  enabled?: boolean
  interval?: number
  onSave: (data: string) => Promise<void>
  getCanvasJSON: () => string
}

export function useAutoSave({
  enabled = true,
  interval = 30000,
  onSave,
  getCanvasJSON,
}: AutoSaveOptions) {
  const builderStore = useBuilderStore()
  const lastSaveRef = useRef<number>(Date.now())
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const save = useCallback(async () => {
    if (!builderStore.isDirty) return

    try {
      const json = getCanvasJSON()
      await onSave(json)
      builderStore.setDirty(false)
      lastSaveRef.current = Date.now()
    } catch (error) {
      console.error('Auto-save failed:', error)
    }
  }, [builderStore, getCanvasJSON, onSave])

  useEffect(() => {
    if (!enabled) return

    saveTimeoutRef.current = setInterval(() => {
      if (builderStore.isDirty) {
        save()
      }
    }, interval)

    return () => {
      if (saveTimeoutRef.current) {
        clearInterval(saveTimeoutRef.current)
      }
    }
  }, [enabled, interval, save, builderStore.isDirty])

  // Save on unmount if dirty
  useEffect(() => {
    return () => {
      if (builderStore.isDirty) {
        save()
      }
    }
  }, [])

  return {
    save,
    lastSaved: lastSaveRef.current,
    isDirty: builderStore.isDirty,
  }
}
