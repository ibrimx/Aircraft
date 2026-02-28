/**
 * spacing.ts — Design Tokens · Spacing Scale
 * @package @brimair/design-tokens
 * Prompt: P17 · Phase 1.A — Design Tokens
 */

export const SPACING = {
  0: '0px', px: '1px',
  0.5: '2px', 1: '4px', 1.5: '6px', 2: '8px', 2.5: '10px',
  3: '12px', 3.5: '14px', 4: '16px', 5: '20px', 6: '24px',
  7: '28px', 8: '32px', 9: '36px', 10: '40px', 11: '44px',
  12: '48px', 14: '56px', 16: '64px', 20: '80px', 24: '96px',
} as const

export const SPACING_ALIAS = {
  xs: SPACING[1],     // 4px
  sm: SPACING[2],     // 8px
  md: SPACING[4],     // 16px
  lg: SPACING[6],     // 24px
  xl: SPACING[8],     // 32px
  '2xl': SPACING[12], // 48px
} as const

export type SpacingKey = keyof typeof SPACING
export type SpacingAlias = keyof typeof SPACING_ALIAS
