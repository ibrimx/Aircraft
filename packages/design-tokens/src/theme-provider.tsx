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
 * ThemeTokens = AircraftTheme + ergonomic aliases used across apps/web + packages/ui
 * Keep it backward compatible:
 * - Expose theme.colors
 * - Also expose bg/text/accent/border aliases
 */
export type ThemeTokens = AircraftTheme & {
  readonly bg: {
    readonly canvas: string
    readonly surface: string
    readonly default: string
  }
  readonly text: {
    readonly primary: string
    readonly secondary: string
    readonly muted: string
    readonly inverse: string
    // Back-compat alias used in web pages
    readonly tertiary: string
  }
  readonly accent: {
    readonly default: string
  }
  readonly border: {
    readonly default: string
  }
}

// Map AircraftTheme -> ThemeTokens (safe defaults)
function toTokens(theme: AircraftTheme): ThemeTokens {
  // IMPORTANT:
  // We assume theme.colors is SemanticColorTokens.
  // If naming differs, adjust these field reads once based on colors-semantic.ts.
  const c: any = theme.colors as any

  const canvas = c?.bg?.canvas ?? c?.background?.canvas ?? c?.surface?.canvas ?? '#0b0d10'
  const surface = c?.bg?.surface ?? c?.background?.surface ?? c?.surface?.default ?? '#11151b'
  const bgDefault = c?.bg?.default ?? c?.background?.default ?? surface

  const textPrimary = c?.text?.primary ?? c?.foreground?.primary ?? '#e8eef6'
  const textSecondary = c?.text?.secondary ?? c?.foreground?.secondary ?? '#a7b2c3'
  const textMuted = c?.text?.muted ?? c?.foreground?.muted ?? textSecondary
  const textInverse = c?.text?.inverse ?? c?.foreground?.inverse ?? '#0b0d10'

  const accentDefault = c?.accent?.default ?? c?.brand?.primary ?? '#4c8dff'
  const borderDefault = c?.border?.default ?? c?.stroke?.default ?? 'rgba(255,255,255,0.10)'

  return {
    ...theme,
    bg: {
      canvas,
      surface,
      default: bgDefault,
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
      muted: textMuted,
      inverse: textInverse,
      tertiary: textMuted, // alias
    },
    accent: {
      default: accentDefault,
    },
    border: {
      default: borderDefault,
    },
  }
}

const ThemeContext = createContext<ThemeTokens>(toTokens(lightTheme))

export type ThemeProviderProps = {
  readonly mode: ThemeMode
  readonly children: ReactNode
}

export function ThemeProvider({ mode, children }: ThemeProviderProps): JSX.Element {
  const tokens = useMemo<ThemeTokens>(() => {
    const theme = mode === 'dark' ? darkTheme : lightTheme
    return toTokens(theme)
  }, [mode])

  return <ThemeContext.Provider value={tokens}>{children}</ThemeContext.Provider>
}

export function useThemeTokens(): ThemeTokens {
  return useContext(ThemeContext)
}
