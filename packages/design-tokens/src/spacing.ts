/**
 * spacing.ts — Design Tokens · 4px Grid Spacing System
 * @package @aircraft/design-tokens
 * Prompt: P18 · Phase 1.A — Design Tokens
 */

export const SPACING = {
  0.5: '2px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
} as const

export type SpacingKey = keyof typeof SPACING

export const SPACING_ALIAS = {
  none: SPACING[0.5],
  xs: SPACING[1],
  sm: SPACING[2],
  md: SPACING[4],
  lg: SPACING[6],
  xl: SPACING[8],
  '2xl': SPACING[10],
  '3xl': SPACING[12],
} as const

export type SpacingAlias = keyof typeof SPACING_ALIAS
