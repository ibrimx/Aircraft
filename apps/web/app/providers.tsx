'use client'

import { useMemo } from 'react'
import { ThemeProvider } from '@aircraft/design-tokens'
import { AuthContext, CmsContext, I18nProvider, type AuthState } from '@aircraft/ui'
import type { CmsSource } from '@aircraft/shared-types'

export function Providers({ children }: { children: React.ReactNode }): JSX.Element {
  const authState = useMemo<AuthState>(
    () => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      login: async () => {},
      logout: async () => {},
      refresh: async () => {},
    }),
    [],
  )

  const cmsContextValue = useMemo(
    () => ({
      fetchSources: async (_signal: AbortSignal): Promise<CmsSource[]> => [],
    }),
    [],
  )

  return (
    <ThemeProvider mode="light">
      <AuthContext.Provider value={authState}>
        <CmsContext.Provider value={cmsContextValue}>
          <I18nProvider>{children}</I18nProvider>
        </CmsContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  )
}
