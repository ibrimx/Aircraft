import { useCallback, useRef } from 'react'
import type { CanvasElement } from '@aircraft/fabric-adapter'
import { useBuilderStore } from '@aircraft/state-bridge'

export function useClipboard() {
  const clipboardRef = useRef<CanvasElement[]>([])
  const builderStore = useBuilderStore()

  const copyToClipboard = useCallback(() => {
    const selected = builderStore.getSelectedElements()
    clipboardRef.current = selected.map((el) => ({ ...el }))
    return selected.length
  }, [builderStore])

  const pasteFromClipboard = useCallback(() => {
    return clipboardRef.current.map((el) => ({
      ...el,
      id: `${el.id}_paste_${Date.now()}`,
      x: el.x + 20,
      y: el.y + 20,
    }))
  }, [])

  const hasClipboardContent = useCallback(() => {
    return clipboardRef.current.length > 0
  }, [])

  const clearClipboard = useCallback(() => {
    clipboardRef.current = []
  }, [])

  return {
    copyToClipboard,
    pasteFromClipboard,
    hasClipboardContent,
    clearClipboard,
  }
}
