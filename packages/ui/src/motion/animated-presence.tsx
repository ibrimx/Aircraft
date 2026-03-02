// P37 · animated-presence.tsx — mount/unmount lifecycle orchestrator
import { useState, useRef, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { REDUCED_MOTION_QUERY } from './presets'

export type AnimatedPresenceProps = {
  present: boolean
  children: ReactNode
  onExitComplete?: () => void
}

export function AnimatedPresence({
  present, children, onExitComplete,
}: AnimatedPresenceProps) {
  const [mounted, setMounted] = useState(present)
  const [phase, setPhase] = useState<'enter' | 'exit' | 'idle'>('idle')
  const rafRef = useRef<number | null>(null)
  const reducedMotion = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION_QUERY)
    reducedMotion.current = mq.matches
    const handler = (e: MediaQueryListEvent) => { reducedMotion.current = e.matches }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (present) {
      setMounted(true)
      setPhase('enter')
    } else if (mounted) {
      if (reducedMotion.current) {
        setMounted(false)
        setPhase('idle')
        onExitComplete?.()
      } else {
        setPhase('exit')
      }
    }
  }, [present])

  const handleExitEnd = useCallback(() => {
    setMounted(false)
    setPhase('idle')
    onExitComplete?.()
  }, [onExitComplete])

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  if (!mounted) return null

  return (
    <div data-phase={phase} onTransitionEnd={
      phase === 'exit' ? handleExitEnd : undefined
    }>
      {children}
    </div>
  )
}
