// Colors
export { PALETTE } from './colors'
export type { PaletteColor, PaletteStep } from './colors'

export { LIGHT_COLORS, DARK_COLORS, getSemanticColors } from './colors-semantic'
export type { SemanticColorTokens } from './colors-semantic'

// Spacing & Radius
export { SPACING, SPACING_ALIAS } from './spacing'
export type { SpacingKey, SpacingAlias } from './spacing'

export { RADIUS } from './radius'
export type { RadiusKey } from './radius'

// Shadows & Blur
export { SHADOWS } from './shadows'
export type { ShadowKey } from './shadows'

export { BLUR, cssBlur, cssBackdropBlur } from './blur'
export type { BlurKey } from './blur'

// Typography
export {
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  TEXT_STYLES,
} from './typography-tokens'
export type { TextStyle, TextStyleKey } from './typography-tokens'

// Z-Index & Breakpoints
export { Z_INDEX } from './z-index'
export type { ZIndexKey } from './z-index'

export { BREAKPOINTS, BREAKPOINT_VALUES, mediaQuery, mediaQueryRange } from './breakpoints'

// Motion
export { DURATION, EASING, cssTransition } from './motion-tokens'
export type { DurationKey, EasingKey } from './motion-tokens'

// Mobile Overrides
export {
  MOBILE_SHADOWS,
  MOBILE_BLUR,
  MOBILE_TOUCH_TARGET,
  MOBILE_REDUCED_MOTION,
} from './mobile-overrides'

// Themes
export { lightTheme } from './light-theme'
export type { BrimairTheme } from './light-theme'

export { darkTheme } from './dark-theme'

// Theme Provider
export { ThemeProvider, useThemeTokens } from './theme-provider'
