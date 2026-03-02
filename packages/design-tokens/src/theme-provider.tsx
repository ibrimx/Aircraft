/**
 * theme-provider.tsx — React context provider + useThemeTokens() hook
 * @package @aircraft/design-tokens
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { ThemeMode } from '@aircraft/shared-types'
import type { AircraftTheme } from './light-theme'
import { lightTheme } from './light-theme'
import { darkTheme } from './dark-theme'

/**
 * Adapter tokens consumed by apps/ui/web code as tk.bg / tk.text / tk.accent / tk.border.
 * This is intentionally a "view model" derived from AircraftTheme.
 */
export type ThemeTokens = {
  readonly mode: ThemeMode

  readonly bg: {
    readonly canvas: string
    readonly surface: string
    readonly elevated: string
    readonly overlay: string
    /** backward-compat alias used in some older pages */
    readonly default: string
  }

  readonly text: {
    readonly primary: string
    readonly secondary: string
    readonly tertiary: string
    readonly disabled: string
    /** backward-compat alias */
    readonly muted: string
    readonly inverse: string
  }

  readonly accent: {
    readonly default: string
    readonly hover: string
    readonly active: string
    readonly subtle: string
  }

  readonly border: {
    readonly default: string
    readonly subtle: string
    readonly strong: string
  }

  /** keep the canonical theme available for components that need deep tokens */
  readonly theme: AircraftTheme
}

function toThemeTokens(theme: AircraftTheme): ThemeTokens {
  const c: any = theme.colors

  // NOTE:
  // We don’t assume a specific SemanticColorTokens shape yet (project is early).
  // So we derive safely with fallbacks; types stay strict on the output.

  const bgCanvas = (c?.bg?.canvas ?? c?.background?.canvas ?? '#000') as string
  const bgSurface = (c?.bg?.surface ?? c?.background?.surface ?? bgCanvas) as string
  const bgDefault = (c?.bg?.default ?? c?.background?.default ?? bgSurface) as string

  const bgElevated = (c?.bg?.elevated ?? bgSurface) as string
  const bgOverlay = (c?.bg?.overlay ?? bgElevated) as string

  const textPrimary = (c?.text?.primary ?? c?.foreground?.primary ?? '#fff') as string
  const textSecondary = (c?.text?.secondary ?? c?.foreground?.secondary ?? textPrimary) as string
  const textTertiary = (c?.text?.tertiary ?? c?.foreground?.tertiary ?? textSecondary) as string
  const textMuted = (c?.text?.muted ?? c?.foreground?.muted ?? textSecondary) as string
  const textDisabled = (c?.text?.disabled ?? textMuted) as string
  const textInverse = (c?.text?.inverse ?? c?.foreground?.inverse ?? '#000') as string

  const accentDefault = (c?.accent?.default ?? c?.brand?.default ?? textPrimary) as string
  const accentHover = (c?.accent?.hover ?? accentDefault) as string
  const accentActive = (c?.accent?.active ?? accentHover) as string
  const accentSubtle = (c?.accent?.subtle ?? accentDefault) as string

  const borderDefault = (c?.border?.default ?? c?.stroke?.default ?? textMuted) as string
  const borderSubtle = (c?.border?.subtle ?? borderDefault) as string
  const borderStrong = (c?.border?.strong ?? borderDefault) as string

  return {
    mode: theme.mode,

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
      muted: textMuted,
      inverse: textInverse,
    },

    accent: {
      default: accentDefault,
      hover: accentHover,
      active: accentActive,
      subtle: accentSubtle,
    },

    border: {
      default: borderDefault,
      subtle: borderSubtle,
      strong: borderStrong,
    },

    theme,
  }
}

const ThemeContext = createContext<ThemeTokens>(toThemeTokens(lightTheme))

export type ThemeProviderProps = {
  readonly mode: ThemeMode
  readonly children: ReactNode
}

export function ThemeProvider({ mode, children }: ThemeProviderProps): JSX.Element {
  const tokens = useMemo<ThemeTokens>(() => {
    const theme = mode === 'dark' ? darkTheme : lightTheme
    return toThemeTokens(theme)
  }, [mode])

  return <ThemeContext.Provider value={tokens}>{children}</ThemeContext.Provider>
}

/** Returns the active ThemeTokens (adapter) from the nearest ThemeProvider. */
export function useThemeTokens(): ThemeTokens {
  return useContext(ThemeContext)
}

/** If any code needs the canonical AircraftTheme directly. */
export function useAircraftTheme(): AircraftTheme {
  return useContext(ThemeContext).theme
}
