import React, { useEffect, useMemo, useRef, useState } from 'react'
import { PixiRenderer } from './renderer/pixi/PixiRenderer'
import { createEmptyDoc } from './state/doc'
import { createInitialRuntimeState } from './state/runtimeState'
import type { ToolId } from './state/types'
import { createEditorRuntime } from './runtime'
import { createSelectTool, createTextTool } from './tools'
import { TopHeader } from '../ui/shell/TopHeader'
import { BottomPill } from '../ui/shell/BottomPill'
import { ContextBar } from '../ui/shell/ContextBar'
import { LayersPopover } from '../ui/popovers/LayersPopover'
import { ActionPopover } from '../ui/popovers/ActionPopover'

/**
 * EditorShell = UI shell + runtime wiring
 *
 * R1 ✅ runtime هو single source of truth
 * R3 ✅ tools through stable contract
 * R4 ✅ renderer draws from state only
 * R6 ✅ minimal re-renders: subscribe once and store snapshot
 */
export function EditorShell({ docId }: { docId: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const rendererRef = useRef<PixiRenderer | null>(null)

  const initialState = useMemo(() => createInitialRuntimeState(createEmptyDoc(docId, docId)), [docId])
  const runtime = useMemo(() => createEditorRuntime(initialState), [initialState])
  const [snap, setSnap] = useState(() => runtime.getState())

  useEffect(() => runtime.subscribe(setSnap), [runtime])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const renderer = new PixiRenderer()
    rendererRef.current = renderer
    renderer.init(host)

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      renderer.render(runtime.getState().doc)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      renderer.destroy()
      rendererRef.current = null
    }
  }, [runtime])

  const tools = useMemo(() => {
    const ctx = { runtime }
    return {
      select: createSelectTool(ctx),
      text: createTextTool(ctx),
    }
  }, [runtime])

  const onPointerDown = (e: React.PointerEvent) => {
    const host = hostRef.current
    const renderer = rendererRef.current
    if (!host || !renderer) return

    const pt = renderer.clientToWorld(host, e.nativeEvent)
    if (snap.tool === 'text') tools.text.onPointerDown?.(pt)
    if (snap.tool === 'select') tools.select.onPointerDown?.(pt)
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (runtime.getState().tool === 'text') tools.text.onKeyDown?.(e)
    }

    const onBeforeInput = (e: Event) => {
      if (runtime.getState().tool !== 'text') return
      const ie = e as InputEvent
      const data = ie.data
      if (!data) return
      tools.text.onTextInput?.(data)
      ie.preventDefault()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('beforeinput', onBeforeInput)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('beforeinput', onBeforeInput)
    }
  }, [runtime, tools])

  const setTool = (tool: ToolId) => runtime.dispatch({ type: 'tool.set', tool })

  return (
    <div style={styles.wrap}>
      <TopHeader title={`Studio • ${snap.doc.title}`} statusRight={snap.caret.isEditing ? 'Editing' : 'Ready'} />
      <div style={styles.canvasHost} ref={hostRef} onPointerDown={onPointerDown} />
      <ContextBar activeTool={snap.tool} />
      <BottomPill activeTool={snap.tool} onSelectTool={setTool} />
      <LayersPopover open={snap.tool === 'layers'} onClose={() => setTool('select')} doc={snap.doc} />
      <ActionPopover open={snap.tool === 'action'} onClose={() => setTool('select')} />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { position: 'relative', width: '100%', height: '100%', overflow: 'hidden' },
  canvasHost: {
    position: 'absolute',
    inset: 0,
    paddingTop: 52,
  },
}
