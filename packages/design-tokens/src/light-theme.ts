/**
 rename-brimair-to-aircraft
 * light-theme.ts — Aircraft Light Theme
 * light-theme.ts — Brimair Light Theme
 * @package @aircraft/design-tokens
 */

import type { ThemeMode } from '@aircraft/shared-types'
import type { SemanticColorTokens } from './colors-semantic'
import { LIGHT_COLORS } from './colors-semantic'
import { SHADOWS } from './shadows'
import { SPACING, SPACING_ALIAS } from './spacing'
import { RADIUS } from './radius'
import { FONT_FAMILY, TEXT_STYLES } from './typography-tokens'
import { DURATION, EASING } from './motion-tokens'
import { Z_INDEX } from './z-index'

export type AircraftTheme = {
  readonly mode: ThemeMode
  readonly colors: SemanticColorTokens
  readonly color: SemanticColorTokens
  readonly bg: { canvas: string; surface: string; elevated: string; overlay: string }
  readonly surface: SemanticColorTokens['surface']
  readonly text: SemanticColorTokens['text']
  readonly border: SemanticColorTokens['border']
  readonly accent: SemanticColorTokens['accent']
  readonly destructive: SemanticColorTokens['destructive']
  readonly success: SemanticColorTokens['success']
  readonly warning: SemanticColorTokens['warning']
  readonly textPrimary: string
  readonly textSecondary: string
  readonly textOnAccent: string
  readonly accentPrimary: string
  readonly errorText: string
  readonly surfacePrimary: string
  readonly surfaceSecondary: string
  readonly shadowElevated: string
  readonly radii: typeof RADIUS
  readonly zIndex: typeof Z_INDEX & { readonly panel: number }
  readonly shadows: typeof SHADOWS
  readonly spacing: typeof SPACING
  readonly spacingAlias: typeof SPACING_ALIAS
  readonly radius: typeof RADIUS
  readonly fontFamily: typeof FONT_FAMILY
  readonly textStyles: typeof TEXT_STYLES
  readonly duration: typeof DURATION
  readonly easing: typeof EASING
}

export function withLegacyAliases(mode: ThemeMode, colors: SemanticColorTokens): AircraftTheme {
  return {
    mode,
    colors,
    color: colors,
    bg: {
      canvas: colors.background.primary,
      surface: colors.surface.default,
      elevated: colors.surface.raised,
      overlay: colors.surface.overlay,
    },
    surface: colors.surface,
    text: colors.text,
    border: colors.border,
    accent: colors.accent,
    destructive: colors.destructive,
    success: colors.success,
    warning: colors.warning,
    textPrimary: colors.text.primary,
    textSecondary: colors.text.secondary,
    textOnAccent: colors.text.inverse,
    accentPrimary: colors.accent.default,
    errorText: colors.destructive.default,
    surfacePrimary: colors.surface.default,
    surfaceSecondary: colors.surface.raised,
    shadowElevated: SHADOWS.md,
    radii: RADIUS,
    zIndex: Z_INDEX,
    shadows: SHADOWS,
    spacing: SPACING,
    spacingAlias: SPACING_ALIAS,
    radius: RADIUS,
    fontFamily: FONT_FAMILY,
    textStyles: TEXT_STYLES,
    duration: DURATION,
    easing: EASING,
  }
}

export const lightTheme: AircraftTheme = withLegacyAliases('light', LIGHT_COLORS)

export type BrimairTheme = AircraftTheme
