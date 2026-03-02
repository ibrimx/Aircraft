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

  readonly bg: {
    readonly canvas: string
    readonly surface: string
    readonly default: string
  }

  readonly text: {
    readonly primary: string
    readonly secondary: string
    readonly tertiary: string
    readonly muted: string
    readonly inverse: string
  }

  readonly accent: {
    readonly default: string
  }

  readonly border: {
    readonly default: string
    readonly subtle: string
  }
}

/**
 * Map SemanticColorTokens => ThemeTokens.
 *
 * NOTE: Because we don't have the exact semantic key names for your `SemanticColorTokens`,
 * we map defensively:
 * - prefer common keys if present
 * - fall back to safe equivalents
 *
 * This keeps builds green while you normalize semantic naming later.
 */
function toThemeTokens(theme: AircraftTheme): ThemeTokens {
  const c: any = theme.colors

  // Helpers: pick first defined string
  const pick = (...vals: unknown[]): string => {
    for (const v of vals) if (typeof v === 'string' && v.length) return v
    return '#000000'
  }

  const bgCanvas = pick(c.bg?.canvas, c.background?.canvas, c.surface?.canvas, c.bg?.default, c.background?.default, c.surface?.default)
  const bgSurface = pick(c.bg?.surface, c.background?.surface, c.surface?.surface, c.bg?.default, c.background?.default, c.surface?.default, bgCanvas)
  const bgDefault = pick(c.bg?.default, c.background?.default, c.surface?.default, bgSurface)

  const textPrimary = pick(c.text?.primary, c.foreground?.primary, c.content?.primary, c.text?.default)
  const textSecondary = pick(c.text?.secondary, c.foreground?.secondary, c.content?.secondary, c.text?.muted, textPrimary)
  // ✅ web currently uses tk.text.tertiary — ensure it exists
  const textTertiary = pick(c.text?.tertiary, c.foreground?.tertiary, c.content?.tertiary, c.text?.muted, textSecondary)
  const textMuted = pick(c.text?.muted, c.foreground?.muted, c.content?.muted, textSecondary)
  const textInverse = pick(c.text?.inverse, c.foreground?.inverse, c.content?.inverse, bgCanvas)

  const accentDefault = pick(c.accent?.default, c.brand?.primary, c.primary?.default, c.primary, textPrimary)
  const borderDefault = pick(c.border?.default, c.outline?.default, c.stroke?.default, c.border?.muted, textMuted)
  const borderSubtle = pick(c.border?.subtle, c.outline?.subtle, c.stroke?.subtle, borderDefault)

  return {
    ...theme,
    colors: theme.colors,

    bg: {
      canvas: bgCanvas,
      surface: bgSurface,
      default: bgDefault,
    },

    text: {
      primary: textPrimary,
      secondary: textSecondary,
      tertiary: textTertiary,
      muted: textMuted,
      inverse: textInverse,
    },

    accent: {
      default: accentDefault,
    },

    border: {
      default: borderDefault,
      subtle: borderSubtle,
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
