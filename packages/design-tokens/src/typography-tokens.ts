// packages/design-tokens/src/typography-tokens.ts
// P19 — Typography Tokens (font families, weights, sizes, line-heights, text styles)
// Guides: DSG §3 Typography, FRAMER §2 Motion, PBG §6 Mobile, STUDIO §2 Canvas

export const FONT_FAMILY = {
  sans: "'Inter', 'Noto Sans Arabic', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
  arabic: "'Noto Sans Arabic', 'Inter', sans-serif",
} as const

export const FONT_WEIGHT = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const

export const FONT_SIZE = {
  xs: '0.75rem',     // 12px
  sm: '0.875rem',    // 14px
  base: '1rem',      // 16px
  lg: '1.125rem',    // 18px
  xl: '1.25rem',     // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
} as const

export const LINE_HEIGHT = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const

export type TextStyle = {
  fontFamily: string
  fontWeight: number
  fontSize: string
  lineHeight: number
}

export const TEXT_STYLES: Record<string, TextStyle> = {
  caption:  { fontFamily: FONT_FAMILY.sans, fontWeight: FONT_WEIGHT.regular,  fontSize: FONT_SIZE.xs,     lineHeight: LINE_HEIGHT.normal },
  body:     { fontFamily: FONT_FAMILY.sans, fontWeight: FONT_WEIGHT.regular,  fontSize: FONT_SIZE.base,   lineHeight: LINE_HEIGHT.normal },
  bodyBold: { fontFamily: FONT_FAMILY.sans, fontWeight: FONT_WEIGHT.semibold, fontSize: FONT_SIZE.base,   lineHeight: LINE_HEIGHT.normal },
  subtitle: { fontFamily: FONT_FAMILY.sans, fontWeight: FONT_WEIGHT.medium,   fontSize: FONT_SIZE.lg,     lineHeight: LINE_HEIGHT.snug },
  title:    { fontFamily: FONT_FAMILY.sans, fontWeight: FONT_WEIGHT.semibold, fontSize: FONT_SIZE['2xl'], lineHeight: LINE_HEIGHT.tight },
  heading:  { fontFamily: FONT_FAMILY.sans, fontWeight: FONT_WEIGHT.bold,     fontSize: FONT_SIZE['3xl'], lineHeight: LINE_HEIGHT.tight },
  display:  { fontFamily: FONT_FAMILY.sans, fontWeight: FONT_WEIGHT.bold,     fontSize: FONT_SIZE['4xl'], lineHeight: LINE_HEIGHT.none },
  code:     { fontFamily: FONT_FAMILY.mono, fontWeight: FONT_WEIGHT.regular,  fontSize: FONT_SIZE.sm,     lineHeight: LINE_HEIGHT.normal },
}

export type TextStyleKey = keyof typeof TEXT_STYLES
