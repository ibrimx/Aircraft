/**
 * blur.ts — Design Tokens · Blur Presets + Helpers
 * @package @brimair/design-tokens
 * Prompt: P18 · Phase 1.A — Design Tokens
 */

export const BLUR = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px',
} as const

export type BlurKey = keyof typeof BLUR

export function cssBlur(key: BlurKey): string {
  return `blur(${BLUR[key]})`
}

export function cssBackdropBlur(key: BlurKey): string {
  return `blur(${BLUR[key]})`
}
