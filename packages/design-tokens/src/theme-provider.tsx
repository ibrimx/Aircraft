import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { ThemeMode } from '@aircraft/shared-types'
import { getSemanticColors } from './colors-semantic'
import { FONT_FAMILY, TEXT_STYLES } from './typography-tokens'
import { RADIUS } from './radius'
import { SHADOWS } from './shadows'
import { SPACING, SPACING_ALIAS } from './spacing'
import type { ThemeTokens } from './theme-tokens'

function createThemeTokens(mode: ThemeMode): ThemeTokens {
  return {
    colors: getSemanticColors(mode),
    spacing: SPACING,
    spacingAlias: SPACING_ALIAS,
    radius: RADIUS,
    radii: RADIUS,
    shadows: SHADOWS,
    textStyles: TEXT_STYLES,
    fontFamily: FONT_FAMILY,
    color: getSemanticColors(mode),
    textPrimary: getSemanticColors(mode).text.primary,
    textSecondary: getSemanticColors(mode).text.secondary,
    textOnAccent: getSemanticColors(mode).text.inverse,
    accentPrimary: getSemanticColors(mode).accent.default,
    errorText: getSemanticColors(mode).destructive.default,
    surfacePrimary: getSemanticColors(mode).surface.default,
    surfaceSecondary: getSemanticColors(mode).surface.raised,
    border: getSemanticColors(mode).border.default,
  }
}

const ThemeContext = createContext<ThemeTokens>(createThemeTokens('light'))

export type ThemeProviderProps = {
  readonly mode: ThemeMode
  readonly children: ReactNode
}

export function ThemeProvider({ mode, children }: ThemeProviderProps): JSX.Element {
  const tokens = useMemo<ThemeTokens>(() => createThemeTokens(mode), [mode])

  return <ThemeContext.Provider value={tokens}>{children}</ThemeContext.Provider>
}

export function useThemeTokens(): ThemeTokens {
  return useContext(ThemeContext)
}
