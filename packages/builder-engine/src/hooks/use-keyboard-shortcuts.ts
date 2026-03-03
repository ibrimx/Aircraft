import { useEffect, useCallback } from 'react'
import { useBuilder } from '../context/builder-context'

export function useKeyboardShortcuts() {
  const {
    deleteSelected,
    duplicateSelected,
    selectAll,
    copy,
    paste,
    cut,
    undo,
    redo,
    zoomIn,
    zoomOut,
    fitToScreen,
    setTool,
    save,
  } = useBuilder()

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isMod = e.metaKey || e.ctrlKey
    const isShift = e.shiftKey
    const target = e.target as HTMLElement

    // Ignore if typing in input
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return
    }

    // Delete
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault()
      deleteSelected()
      return
    }

    // Tool shortcuts (single key)
    if (!isMod && !isShift) {
      const toolMap: Record<string, string> = {
        v: 'select',
        f: 'frame',
        r: 'rectangle',
        o: 'ellipse',
        t: 'text',
        l: 'line',
        p: 'pen',
        h: 'hand',
        z: 'zoom',
      }
      const tool = toolMap[e.key.toLowerCase()]
      if (tool) {
        e.preventDefault()
        setTool(tool)
        return
      }
    }

    // Mod + key shortcuts
    if (isMod) {
      switch (e.key.toLowerCase()) {
        case 'a':
          e.preventDefault()
          selectAll()
          break
        case 'c':
          e.preventDefault()
          copy()
          break
        case 'v':
          e.preventDefault()
          paste()
          break
        case 'x':
          e.preventDefault()
          cut()
          break
        case 'd':
          e.preventDefault()
          duplicateSelected()
          break
        case 'z':
          e.preventDefault()
          if (isShift) {
            redo()
          } else {
            undo()
          }
          break
        case 'y':
          e.preventDefault()
          redo()
          break
        case 's':
          e.preventDefault()
          save()
          break
        case '=':
        case '+':
          e.preventDefault()
          zoomIn()
          break
        case '-':
          e.preventDefault()
          zoomOut()
          break
        case '0':
          e.preventDefault()
          fitToScreen()
          break
      }
    }
  }, [
    deleteSelected,
    duplicateSelected,
    selectAll,
    copy,
    paste,
    cut,
    undo,
    redo,
    zoomIn,
    zoomOut,
    fitToScreen,
    setTool,
    save,
  ])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
