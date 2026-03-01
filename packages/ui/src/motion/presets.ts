/**
 * @file presets.ts
 * @package @brimair/ui
 * @description Motion spring & transition presets for Brimair design tool.
 * Zero enum — uses const objects. Zero any. Named exports only.
 */

import type { Transition } from 'framer-motion';

// ---------------------------------------------------------------------------
// Reduced-motion helper
// ---------------------------------------------------------------------------
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------------------
// Spring presets
// ---------------------------------------------------------------------------
export const SPRING_PRESETS = {
  /** Snappy UI feedback (buttons, chips) */
  snappy: { type: 'spring', stiffness: 400, damping: 30, mass: 1 },
  /** Default smooth spring for most transitions */
  smooth: { type: 'spring', stiffness: 260, damping: 24, mass: 1 },
  /** Gentle entrance for cards / panels */
  gentle: { type: 'spring', stiffness: 160, damping: 22, mass: 1 },
  /** Bouncy micro-interaction */
  bouncy: { type: 'spring', stiffness: 500, damping: 20, mass: 0.8 },
} as const;

export type SpringPresetKey = keyof typeof SPRING_PRESETS;

// ---------------------------------------------------------------------------
// Transition presets (Framer Motion Transition type)
// ---------------------------------------------------------------------------
export const TRANSITION_PRESETS: Record<string, Transition> = {
  /** Instant — for reduced-motion contexts */
  instant: { duration: 0 },
  /** Fast fade / scale */
  fast: { type: 'tween', duration: 0.15, ease: 'easeInOut' },
  /** Standard UI transition */
  standard: { type: 'tween', duration: 0.25, ease: 'easeInOut' },
  /** Slower entrance for large surfaces */
  enter: { type: 'tween', duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  /** Exit transition */
  exit: { type: 'tween', duration: 0.2, ease: [0.4, 0, 1, 1] },
};

export type TransitionPresetKey = keyof typeof TRANSITION_PRESETS;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the spring preset — falls back to `instant` when user prefers reduced motion.
 */
export const getSpring = (key: SpringPresetKey): Transition =>
  prefersReducedMotion() ? TRANSITION_PRESETS.instant : (SPRING_PRESETS[key] as Transition);

/**
 * Returns the transition preset — falls back to `instant` when user prefers reduced motion.
 */
export const getTransition = (key: TransitionPresetKey): Transition =>
  prefersReducedMotion() ? TRANSITION_PRESETS.instant : TRANSITION_PRESETS[key];
