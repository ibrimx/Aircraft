// P39 · stagger-list.tsx — staggered child entrance animations
import { useState, useEffect, useRef, Children } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import { TRANSITION_PRESETS, REDUCED_MOTION_QUERY } from './presets'
import type { TransitionPresetKey } from './presets'

export type StaggerListProps = {
  children: ReactNode[]
  staggerDelay?: number
  animationPreset?: TransitionPresetKey
  enabled?: boolean
  className?: string
  style?: CSSProperties
}

export function StaggerList({
  children, staggerDelay = 50,
  animationPreset = 'fadeIn',
  enabled = true, className, style,
}: StaggerListProps) {
  const [visibleCount, setVisibleCount] = useState(enabled ? 0 : children.length)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const preset = TRANSITION_PRESETS[animationPreset]

  useEffect(() => {
    if (!enabled) { setVisibleCount(children.length); return }
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches
    if (reducedMotion) { setVisibleCount(children.length); return }

    let count = 0
    const reveal = () => {
      count++
      setVisibleCount(count)
      if (count < children.length) {
        timerRef.current = setTimeout(reveal, staggerDelay)
      }
    }
    reveal()
    return () => clearTimeout(timerRef.current)
  }, [children.length, staggerDelay, enabled])

  return (
    <div className={className} style={style}>
      {Children.map(children, (child, i) => (
        <div
          key={i}
          style={{
            opacity: i < visibleCount ? 1 : 0,
            transform: i < visibleCount ? 'translateY(0)' : 'translateY(8px)',
            transition: `opacity ${preset.duration} ${preset.easing}, transform ${preset.duration} ${preset.easing}`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
