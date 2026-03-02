/**
 * theme-provider.tsx — React context provider + useThemeTokens() hook
 * @package @aircraft/design-tokens
 *
 * IMPORTANT:
 * - ThemeContext stores canonical AircraftTheme (source of truth).
 * - useThemeTokens() returns an adapter ("tokens") that matches UI usage:
 *   tk.bg.surface / tk.text.secondary / tk.accent.default / tk.border.default ...
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { ThemeMode } from '@aircraft/shared-types'
import type { AircraftTheme } from './light-theme'
import { lightTheme } from './light-theme'
import { darkTheme } from './dark-theme'

/**
 * Tokens adapter type consumed by apps/web and @aircraft/ui
 * (matches existing code expectations).
 */
export type ThemeTokens = {
  /** canonical theme (escape hatch, still useful sometimes) */
  readonly theme: AircraftTheme

  /** common semantic groups expected by the UI */
  readonly bg: {
    readonly canvas: string
    readonly surface: string
    readonly elevated: string
  }
  readonly text: {
    readonly primary: string
    readonly secondary: string
    readonly muted: string
    readonly inverse: string
  }
  readonly accent: {
    readonly default: string
    readonly hover: string
    readonly active: string
    readonly contrast: string
  }
  readonly border: {
    readonly default: string
    readonly subtle: string
    readonly strong: string
  }
}

/**
 * Build a stable adapter from the canonical theme.colors.
 * NOTE: The exact keys inside theme.colors vary by your SemanticColorTokens.
 * So we defensively map from several likely candidates.
 */
function toTokens(theme: AircraftTheme): ThemeTokens {
  const c: any = theme.colors as any

  // Backgrounds (try common naming patterns)
  const bgCanvas =
    c.bg?.canvas ?? c.background?.canvas ?? c.surface?.canvas ?? c.page ?? c.canvas ?? '#0b0f19'
  const bgSurface =
    c.bg?.surface ?? c.background?.surface ?? c.surface?.default ?? c.surface ?? '#121826'
  const bgElevated =
    c.bg?.elevated ?? c.background?.elevated ?? c.surface?.elevated ?? c.elevated ?? bgSurface

  // Text
  const textPrimary =
    c.text?.primary ?? c.foreground?.primary ?? c.onBg?.primary ?? c.onSurface ?? '#e5e7eb'
  const textSecondary =
    c.text?.secondary ?? c.foreground?.secondary ?? c.onBg?.secondary ?? c.muted ?? '#9ca3af'
  const textMuted =
    c.text?.muted ?? c.foreground?.muted ?? c.subtle ?? '#6b7280'
  const textInverse =
    c.text?.inverse ?? c.foreground?.inverse ?? c.onAccent ?? '#0b0f19'

  // Accent
  const accentDefault =
    c.accent?.default ?? c.primary?.default ?? c.brand?.default ?? c.primary ?? '#6d28d9'
  const accentHover =
    c.accent?.hover ?? c.primary?.hover ?? c.brand?.hover ?? accentDefault
  const accentActive =
    c.accent?.active ?? c.primary?.active ?? c.brand?.active ?? accentHover
  const accentContrast =
    c.accent?.contrast ?? c.primary?.contrast ?? c.brand?.contrast ?? textInverse

  // Border
  const borderDefault =
    c.border?.default ?? c.stroke?.default ?? c.outline?.default ?? c.border ?? 'rgba(255,255,255,0.12)'
  const borderSubtle =
    c.border?.subtle ?? c.stroke?.subtle ?? c.outline?.subtle ?? 'rgba(255,255,255,0.08)'
  const borderStrong =
    c.border?.strong ?? c.stroke?.strong ?? c.outline?.strong ?? 'rgba(255,255,255,0.18)'

  return {
    theme,
    bg: { canvas: bgCanvas, surface: bgSurface, elevated: bgElevated },
    text: { primary: textPrimary, secondary: textSecondary, muted: textMuted, inverse: textInverse },
    accent: {
      default: accentDefault,
      hover: accentHover,
      active: accentActive,
      contrast: accentContrast,
    },
    border: { default: borderDefault, subtle: borderSubtle, strong: borderStrong },
  }
}

const ThemeContext = createContext<AircraftTheme>(lightTheme)

export type ThemeProviderProps = {
  readonly mode: ThemeMode
  readonly children: ReactNode
}

/** Provides lightTheme or darkTheme based on the resolved mode. */
export function ThemeProvider({ mode, children }: ThemeProviderProps): JSX.Element {
  const theme = useMemo<AircraftTheme>(
    () => (mode === 'dark' ? darkTheme : lightTheme),
    [mode],
  )

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

/**
 * Returns UI-friendly tokens adapter.
 * This is what your pages/components expect: tk.bg.surface, tk.text.secondary, ...
 */
export function useThemeTokens(): ThemeTokens {
  const theme = useContext(ThemeContext)

  // memoize adapter per theme instance to keep referential stability
  return useMemo(() => toTokens(theme), [theme])
}
