import type { SemanticColorTokens } from './colors-semantic'
import { FONT_FAMILY, TEXT_STYLES } from './typography-tokens'
import { RADIUS } from './radius'
import { SHADOWS } from './shadows'
import { SPACING, SPACING_ALIAS } from './spacing'

export type ThemeTokens = {
  colors: SemanticColorTokens
  spacing: typeof SPACING
  spacingAlias: typeof SPACING_ALIAS
  radius: typeof RADIUS
  shadows: typeof SHADOWS
  textStyles: typeof TEXT_STYLES
  fontFamily: typeof FONT_FAMILY
}
