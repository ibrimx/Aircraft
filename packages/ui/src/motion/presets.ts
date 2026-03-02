// P36 · presets.ts — motion presets & spring configs
import { DURATION, EASING } from '@aircraft/design-tokens'

export type SpringConfig = {
  mass: number
  stiffness: number
  damping: number
}

export const SPRING_CONFIGS = {
  gentle:   { mass: 1, stiffness: 120, damping: 14 },
  bouncy:   { mass: 1, stiffness: 300, damping: 10 },
  stiff:    { mass: 1, stiffness: 500, damping: 30 },
  molasses: { mass: 1, stiffness: 40,  damping: 20 },
} as const

export const SPRING_PRESETS = SPRING_CONFIGS

export type SpringConfigKey = keyof typeof SPRING_CONFIGS

export type TransitionPreset = {
  duration: string
  easing: string
  delay?: string
}

export const TRANSITION_PRESETS = {
  fadeIn:      { duration: DURATION.normal, easing: EASING.easeOut },
  fadeOut:     { duration: DURATION.fast,   easing: EASING.easeIn },
  scaleIn:    { duration: DURATION.normal, easing: EASING.easeOut },
  scaleOut:   { duration: DURATION.fast,   easing: EASING.easeIn },
  slideUp:    { duration: DURATION.normal, easing: EASING.easeOut },
  slideDown:  { duration: DURATION.normal, easing: EASING.easeOut },
  slideLeft:  { duration: DURATION.normal, easing: EASING.easeOut },
  slideRight: { duration: DURATION.normal, easing: EASING.easeOut },
} as const

export type TransitionPresetKey = keyof typeof TRANSITION_PRESETS

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export function getReducedMotionPreset(
  _preset: TransitionPreset,
): TransitionPreset {
  return { duration: '0ms', easing: 'linear', delay: '0ms' }
}
