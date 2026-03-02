/**
 * theme-provider.tsx — React context provider + useThemeTokens() hook
 * @package @aircraft/design-tokens
 *
 * Canonical theme is AircraftTheme (light-theme.ts / dark-theme.ts).
 * UI consumes ThemeTokens (adapter) to support tk.bg/text/accent/border shape.
 */
import React, { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { ThemeMode } from '@aircraft/shared-types'
import type { AircraftTheme } from './light-theme'
import { lightTheme } from './light-theme'
import { darkTheme } from './dark-theme'

/**
 * Adapter tokens consumed by UI/pages.
 * Keep `colors` to support existing calls like `tk.colors.*`
 * and expose legacy flattened groups: bg/text/accent/border.
 */
export type ThemeTokens = AircraftTheme & {
  readonly colors: AircraftTheme['colors']
  readonly bg: AircraftTheme['bg'] & {
    readonly default: string
  }
  readonly text: AircraftTheme['text'] & {
    readonly muted: string
  }
  readonly accent: AircraftTheme['accent']
  readonly border: AircraftTheme['border']
}

/**
 * Map SemanticColorTokens => ThemeTokens.
 */
function toThemeTokens(theme: AircraftTheme): ThemeTokens {
  const c = theme.colors
  
  // Helpers: pick first defined string
  const pick = (...vals: unknown[]): string => {
    for (const v of vals) if (typeof v === 'string' && v.length) return v
    return '#000000'
  }

  const bgCanvas = pick(c.background?.primary, c.surface?.default)
  const bgSurface = pick(c.surface?.default, c.background?.primary)
  const bgElevated = pick(c.surface?.raised, bgSurface)
  const bgOverlay = pick(c.surface?.overlay, 'rgba(0,0,0,0.4)')
  const bgDefault = bgSurface

  const textPrimary = pick(c.text?.primary, '#000000')
  const textSecondary = pick(c.text?.secondary, textPrimary)
  const textTertiary = pick(c.text?.tertiary, textSecondary)
  const textDisabled = pick(c.text?.disabled, textSecondary)
  const textInverse = pick(c.text?.inverse, '#ffffff')
  const textMuted = textSecondary

  return {
    ...theme,
    colors: theme.colors,
    bg: {
      canvas: bgCanvas,
      surface: bgSurface,
      elevated: bgElevated,
      overlay: bgOverlay,
      default: bgDefault,
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
      tertiary: textTertiary,
      disabled: textDisabled,
      inverse: textInverse,
      muted: textMuted,
    },
    accent: {
      ...theme.accent,
    },
    border: {
      ...theme.border,
    },
  }
}

const ThemeContext = createContext<ThemeTokens>(toThemeTokens(lightTheme))

export type ThemeProviderProps = {
  readonly mode: ThemeMode
  readonly children: ReactNode
}

/** Provides ThemeTokens based on resolved mode. */
export function ThemeProvider({ mode, children }: ThemeProviderProps): React.JSX.Element {
  const tokens = useMemo<ThemeTokens>(
    () => toThemeTokens(mode === 'dark' ? darkTheme : lightTheme),
    [mode],
  )
  return <ThemeContext.Provider value={tokens}>{children}</ThemeContext.Provider>
}

/** Returns the active ThemeTokens from the nearest ThemeProvider. */
export function useThemeTokens(): ThemeTokens {
  return useContext(ThemeContext)
}
