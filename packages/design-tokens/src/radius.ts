/**
 * radius.ts — Design Tokens · Border Radius
 * @package @aircraft/design-tokens
 * Prompt: P17 · Phase 1.A — Design Tokens
 */

export const RADIUS = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  pill: '9999px',
} as const

export type RadiusKey = keyof typeof RADIUS
