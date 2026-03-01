/**
 * theme-provider.tsx — React context provider + useThemeTokens() hook
 * @package @aircraft/design-tokens
 * Prompt: P21 · Phase 1.A — Design Tokens
 *
 * Provides the active BrimairTheme to the entire component tree.
 * Default context value is lightTheme, but Brimair is dark-first:
 * the root <ThemeProvider mode="dark"> wraps the app.
 *
 * useMemo prevents unnecessary re-renders when parent re-renders
 * without changing mode.
 *
 * 📖 DSG §1 Visual Philosophy (dark-first)
 * 📖 FRAMER §2 Spring Presets (gentle spring for theme transitions)
 * 📖 STUDIO §2 Canvas Theming
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { ThemeMode } from '@aircraft/shared-types'
import type { BrimairTheme } from './light-theme'
import { lightTheme } from './light-theme'
import { darkTheme } from './dark-theme'

const ThemeContext = createContext<BrimairTheme>(lightTheme)

export type ThemeProviderProps = {
  readonly mode: ThemeMode
  readonly children: ReactNode
}

/** Provides lightTheme or darkTheme based on the resolved mode. */
export function ThemeProvider({ mode, children }: ThemeProviderProps): JSX.Element {
  const theme = useMemo<BrimairTheme>(
    () => (mode === 'dark' ? darkTheme : lightTheme),
    [mode],
  )

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

/** Returns the active BrimairTheme from the nearest ThemeProvider. */
export function useThemeTokens(): BrimairTheme {
  return useContext(ThemeContext)
}
