// P39 · spring-drag.tsx — draggable with spring physics release
import { useRef, useEffect, useCallback } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import { SPRING_CONFIGS } from './presets'
import type { SpringConfigKey } from './presets'
import type { Rect } from '@aircraft/shared-types'

export type SpringDragProps = {
  children: ReactNode
  axis?: 'x' | 'y' | 'both'
  bounds?: Rect | null
  springConfig?: SpringConfigKey
  onDragStart?: (pos: { x: number; y: number }) => void
  onDragMove?: (pos: { x: number; y: number }) => void
  onDragEnd?: (pos: { x: number; y: number }) => void
  disabled?: boolean
  className?: string
  style?: CSSProperties
}

export function SpringDrag({
  children, axis = 'both', bounds = null,
  springConfig = 'gentle', onDragStart, onDragMove, onDragEnd,
  disabled = false, className, style,
}: SpringDragProps) {
  const ref = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const vel = useRef({ x: 0, y: 0 })
  const dragging = useRef(false)
  const rafRef = useRef<number>()
  const spring = SPRING_CONFIGS[springConfig]

  const clamp = useCallback((val: number, min: number, max: number) =>
    Math.max(min, Math.min(max, val)), [])

  const applyBounds = useCallback((x: number, y: number) => {
    if (!bounds) return { x, y }
    return {
      x: clamp(x, bounds.x, bounds.x + bounds.width),
      y: clamp(y, bounds.y, bounds.y + bounds.height),
    }
  }, [bounds, clamp])

  const animate = useCallback(() => {
    const { stiffness, damping, mass } = spring
    const forceX = -stiffness * pos.current.x
    const forceY = -stiffness * pos.current.y
    const dampX = -damping * vel.current.x
    const dampY = -damping * vel.current.y

    vel.current.x += (forceX + dampX) / mass * (1 / 60)
    vel.current.y += (forceY + dampY) / mass * (1 / 60)
    pos.current.x += vel.current.x * (1 / 60)
    pos.current.y += vel.current.y * (1 / 60)

    if (ref.current) {
      const tx = axis === 'y' ? 0 : pos.current.x
      const ty = axis === 'x' ? 0 : pos.current.y
      ref.current.style.transform = `translate(${tx}px, ${ty}px)`
    }

    const threshold = 0.01
    if (Math.abs(vel.current.x) > threshold || Math.abs(vel.current.y) > threshold ||
        Math.abs(pos.current.x) > threshold || Math.abs(pos.current.y) > threshold) {
      rafRef.current = requestAnimationFrame(animate)
    }
  }, [spring, axis])

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (disabled) return
    dragging.current = true
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    onDragStart?.({ x: pos.current.x, y: pos.current.y })
  }, [disabled, onDragStart])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = axis === 'y' ? 0 : e.movementX
    const dy = axis === 'x' ? 0 : e.movementY
    const bounded = applyBounds(pos.current.x + dx, pos.current.y + dy)
    pos.current = bounded
    if (ref.current) {
      ref.current.style.transform = `translate(${bounded.x}px, ${bounded.y}px)`
    }
    onDragMove?.(bounded)
  }, [axis, applyBounds, onDragMove])

  const handlePointerUp = useCallback(() => {
    dragging.current = false
    onDragEnd?.({ x: pos.current.x, y: pos.current.y })
    rafRef.current = requestAnimationFrame(animate)
  }, [onDragEnd, animate])

  return (
    <div
      ref={ref}
      className={className}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        touchAction: 'none',
        cursor: disabled ? 'default' : 'grab',
        userSelect: 'none',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
