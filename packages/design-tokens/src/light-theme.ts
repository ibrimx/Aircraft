/**
 * light-theme.ts — Brimair Light Theme
 * @package @aircraft/design-tokens
 * Prompt: P21 · Phase 1.A — Design Tokens
 *
 * Defines BrimairTheme type (single source of truth) and lightTheme object.
 * 📖 DSG §1 Visual Philosophy, §2.5 Light Semantic Mapping
 * 📖 FRAMER §2 Spring Presets (theme transitions)
 * 📖 STUDIO §2 Canvas Theming
 */

import type { ThemeMode } from '@aircraft/shared-types'
import type { SemanticColorTokens } from './colors-semantic'
import { LIGHT_COLORS } from './colors-semantic'
import { SHADOWS } from './shadows'
import { SPACING, SPACING_ALIAS } from './spacing'
import { RADIUS } from './radius'
import { FONT_FAMILY, TEXT_STYLES } from './typography-tokens'
import { DURATION, EASING } from './motion-tokens'

/** Canonical theme shape consumed by every UI component via useThemeTokens(). */
export type BrimairTheme = {
  readonly mode: ThemeMode
  readonly colors: SemanticColorTokens
  readonly shadows: typeof SHADOWS
  readonly spacing: typeof SPACING
  readonly spacingAlias: typeof SPACING_ALIAS
  readonly radius: typeof RADIUS
  readonly fontFamily: typeof FONT_FAMILY
  readonly textStyles: typeof TEXT_STYLES
  readonly duration: typeof DURATION
  readonly easing: typeof EASING
}

/** Light theme — secondary mode (Brimair is dark-first). */
export const lightTheme: BrimairTheme = {
  mode: 'light',
  colors: LIGHT_COLORS,
  shadows: SHADOWS,
  spacing: SPACING,
  spacingAlias: SPACING_ALIAS,
  radius: RADIUS,
  fontFamily: FONT_FAMILY,
  textStyles: TEXT_STYLES,
  duration: DURATION,
  easing: EASING,
}
