import { useRef, useCallback } from 'react'
import type { AircraftCanvasRef } from '../canvas'
import type { CanvasElement, CreateElementOptions } from '../types'
import { createRectangle, createEllipse, createText, createFrame } from '../elements/create-element'

export function useCanvas() {
  const canvasRef = useRef<AircraftCanvasRef>(null)

  const addRectangle = useCallback((options?: CreateElementOptions) => {
    const element = createRectangle(options)
    canvasRef.current?.addElement(element)
    return element.id
  }, [])

  const addEllipse = useCallback((options?: CreateElementOptions) => {
    const element = createEllipse(options)
    canvasRef.current?.addElement(element)
    return element.id
  }, [])

  const addText = useCallback((options?: CreateElementOptions) => {
    const element = createText(options)
    canvasRef.current?.addElement(element)
    return element.id
  }, [])

  const addFrame = useCallback((options?: CreateElementOptions) => {
    const element = createFrame(options)
    canvasRef.current?.addElement(element)
    return element.id
  }, [])

  const removeElement = useCallback((id: string) => {
    canvasRef.current?.removeElement(id)
  }, [])

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    canvasRef.current?.updateElement(id, updates)
  }, [])

  const selectElement = useCallback((id: string) => {
    canvasRef.current?.selectElement(id)
  }, [])

  const selectElements = useCallback((ids: string[]) => {
    canvasRef.current?.selectElements(ids)
  }, [])

  const clearSelection = useCallback(() => {
    canvasRef.current?.clearSelection()
  }, [])

  const zoomTo = useCallback((zoom: number) => {
    canvasRef.current?.zoomTo(zoom)
  }, [])

  const panTo = useCallback((x: number, y: number) => {
    canvasRef.current?.panTo(x, y)
  }, [])

  return {
    canvasRef,
    addRectangle,
    addEllipse,
    addText,
    addFrame,
    removeElement,
    updateElement,
    selectElement,
    selectElements,
    clearSelection,
    zoomTo,
    panTo,
  }
}
