/**
 * motion-tokens.ts — Design Tokens · Duration & Easing
 * @package @aircraft/design-tokens
 * Prompt: P20 · Phase 1.A — Design Tokens
 *
 * ⛔ EASING.linear exists ONLY for reduced-motion fallback.
 *    NEVER use linear for UI animations.
 * 📖 DSG §3 Motion · FRAMER §2-§3 Springs/Duration/Easing
 */

export const DURATION = {
  instant: '0ms',
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
  slowest: '800ms',
} as const

export const EASING = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
} as const

export type DurationKey = keyof typeof DURATION
export type EasingKey = keyof typeof EASING

export function cssTransition(
  property: string,
  duration: DurationKey = 'normal',
  easing: EasingKey = 'easeInOut',
): string {
  return `${property} ${DURATION[duration]} ${EASING[easing]}`
}
