// P37 · fade-scale.tsx — opacity + scale enter/exit
import type { ReactNode, CSSProperties } from 'react'
import { AnimatedPresence } from './animated-presence'
import { TRANSITION_PRESETS } from './presets'

export type FadeScaleProps = {
  visible: boolean
  children: ReactNode
  duration?: string
  initialScale?: number
  className?: string
  style?: CSSProperties
}

export function FadeScale({
  visible,
  children,
  duration = TRANSITION_PRESETS.fadeIn.duration,
  initialScale = 0.95,
  className,
  style,
}: FadeScaleProps) {
  return (
    <AnimatedPresence present={visible}>
      <div
        className={className}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : `scale(${initialScale})`,
          transition: `opacity ${duration} ${TRANSITION_PRESETS.fadeIn.easing}, transform ${duration} ${TRANSITION_PRESETS.fadeIn.easing}`,
          ...style,
        }}
      >
        {children}
      </div>
    </AnimatedPresence>
  )
}
