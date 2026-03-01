/**
 * dark-theme.ts — Aircraft Dark Theme (Primary / Default)
 * @package @aircraft/design-tokens
 * Prompt: P21 · Phase 1.A — Design Tokens
 *
 * Aircraft is dark-first — this is the primary theme.
 * 📖 DSG §1 Visual Philosophy (dark-first), §2.4 Dark Semantic Mapping
 * 📖 FRAMER §2 Spring Presets (theme transitions)
 * 📖 STUDIO §2 Canvas Theming
 */

import { DARK_COLORS } from './colors-semantic'
import { SHADOWS } from './shadows'
import { SPACING, SPACING_ALIAS } from './spacing'
import { RADIUS } from './radius'
import { FONT_FAMILY, TEXT_STYLES } from './typography-tokens'
import { DURATION, EASING } from './motion-tokens'
import type { AircraftTheme } from './light-theme'

/** Dark theme — primary mode (Aircraft default). */
export const darkTheme: AircraftTheme = {
  mode: 'dark',
  colors: DARK_COLORS,
  shadows: SHADOWS,
  spacing: SPACING,
  spacingAlias: SPACING_ALIAS,
  radius: RADIUS,
  fontFamily: FONT_FAMILY,
  textStyles: TEXT_STYLES,
  duration: DURATION,
  easing: EASING,
}
