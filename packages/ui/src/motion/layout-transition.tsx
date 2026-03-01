// P38 · layout-transition.tsx — FLIP-based layout animation
import { useRef, useEffect } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import { DURATION, EASING } from '@aircraft/design-tokens'
import { REDUCED_MOTION_QUERY } from './presets'

export type LayoutTransitionProps = {
  children: ReactNode
  duration?: string
  enabled?: boolean
  className?: string
  style?: CSSProperties
}

export function LayoutTransition({
  children, duration = DURATION.normal,
  enabled = true, className, style,
}: LayoutTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prevRect = useRef<DOMRect | null>(null)
  const rafRef = useRef<number>()

  // Record rect before render (First)
  useEffect(() => {
    if (!enabled || !ref.current) return
    prevRect.current = ref.current.getBoundingClientRect()
  })

  // After render: compare and animate (Last, Invert, Play)
  useEffect(() => {
    if (!enabled || !ref.current || !prevRect.current) return
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches
    if (reducedMotion) return

    const el = ref.current
    const first = prevRect.current
    const last = el.getBoundingClientRect()

    const dx = first.left - last.left
    const dy = first.top - last.top
    const sw = first.width / last.width
    const sh = first.height / last.height

    if (dx === 0 && dy === 0 && sw === 1 && sh === 1) return

    // Invert
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${sw}, ${sh})`
    el.style.transformOrigin = 'top left'
    el.style.transition = 'none'

    // Play
    rafRef.current = requestAnimationFrame(() => {
      el.style.transition = `transform ${duration} ${EASING.easeInOut}`
      el.style.transform = 'translate(0, 0) scale(1, 1)'
    })
  })

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
