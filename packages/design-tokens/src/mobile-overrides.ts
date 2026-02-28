/**
 * mobile-overrides.ts — Design Tokens · Mobile Overrides
 * @package @brimair/design-tokens
 * Prompt: P20 · Phase 1.A — Design Tokens
 *
 * Reduces heavy visual effects for mobile performance.
 * 📖 DSG §6 Shadows · §6.2 Blur · §14 Mobile
 * 📖 PBG §6.3 Touch Targets · §6.4 Gesture System
 */

import { SHADOWS } from './shadows'
import { BLUR } from './blur'
import { SPACING } from './spacing'

export const MOBILE_SHADOWS: Record<string, string> = {
  none: SHADOWS.none,
  sm: SHADOWS.sm,
  md: SHADOWS.md,
  lg: SHADOWS.lg,
  xl: SHADOWS.lg,
  '2xl': SHADOWS.lg,
  inner: SHADOWS.none,
}

export const MOBILE_BLUR: Record<string, string> = {
  none: BLUR.none,
  sm: BLUR.sm,
  md: BLUR.md,
  lg: BLUR.lg,
  xl: BLUR.lg,
  '2xl': BLUR.lg,
  '3xl': BLUR.lg,
}

export const MOBILE_TOUCH_TARGET = {
  minSize: '44px',
  padding: SPACING[3],
} as const

export const MOBILE_REDUCED_MOTION = {
  duration: '0ms',
  easing: 'linear',
} as const
