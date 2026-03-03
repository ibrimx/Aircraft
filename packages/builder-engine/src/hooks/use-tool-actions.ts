import { useCallback } from 'react'
import { useBuilder } from '../context/builder-context'
import type { CreateElementOptions } from '@aircraft/fabric-adapter'

export function useToolActions() {
  const {
    activeTool,
    addRectangle,
    addEllipse,
    addText,
    addFrame,
  } = useBuilder()

  const executeToolAction = useCallback((x: number, y: number) => {
    const options: CreateElementOptions = { x, y }

    switch (activeTool) {
      case 'rectangle':
        return addRectangle(options)
      case 'ellipse':
        return addEllipse(options)
      case 'text':
        return addText(options)
      case 'frame':
        return addFrame(options)
      default:
        return null
    }
  }, [activeTool, addRectangle, addEllipse, addText, addFrame])

  return { executeToolAction }
}
