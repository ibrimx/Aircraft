// P39 · gesture-wrapper.tsx — swipe, pinch, long-press detection
import { useRef, useEffect, useCallback } from 'react'
import type { ReactNode, CSSProperties } from 'react'

export type GestureWrapperProps = {
  children: ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinch?: (scale: number) => void
  onLongPress?: () => void
  swipeThreshold?: number
  longPressDelay?: number
  disabled?: boolean
  className?: string
  style?: CSSProperties
}

export function GestureWrapper({
  children, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown,
  onPinch, onLongPress,
  swipeThreshold = 50, longPressDelay = 500,
  disabled = false, className, style,
}: GestureWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)
  const startPos = useRef({ x: 0, y: 0 })
  const longPressTimer = useRef<ReturnType<typeof setTimeout>>()
  const initialPinchDist = useRef<number | null>(null)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (disabled) return
    startPos.current = { x: e.clientX, y: e.clientY }
    longPressTimer.current = setTimeout(() => {
      onLongPress?.()
    }, longPressDelay)
  }, [disabled, longPressDelay, onLongPress])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const dx = Math.abs(e.clientX - startPos.current.x)
    const dy = Math.abs(e.clientY - startPos.current.y)
    if (dx > 10 || dy > 10) clearTimeout(longPressTimer.current)
  }, [])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    clearTimeout(longPressTimer.current)
    if (disabled) return
    const dx = e.clientX - startPos.current.x
    const dy = e.clientY - startPos.current.y
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    if (absDx > absDy && absDx > swipeThreshold) {
      if (dx > 0) onSwipeRight?.()
      else onSwipeLeft?.()
    } else if (absDy > absDx && absDy > swipeThreshold) {
      if (dy > 0) onSwipeDown?.()
      else onSwipeUp?.()
    }
  }, [disabled, swipeThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  useEffect(() => {
    const el = ref.current
    if (!el || disabled || !onPinch) return

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        )
        initialPinchDist.current = d
      }
    }
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialPinchDist.current !== null) {
        const d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        )
        onPinch(d / initialPinchDist.current)
      }
    }
    const handleTouchEnd = () => { initialPinchDist.current = null }

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [disabled, onPinch])

  useEffect(() => () => clearTimeout(longPressTimer.current), [])

  return (
    <div
      ref={ref}
      className={className}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ touchAction: 'none', ...style }}
    >
      {children}
    </div>
  )
}
