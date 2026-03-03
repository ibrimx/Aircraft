import type { AppProps } from 'next/app'
import { useMemo, useState } from 'react'
import { AuthContext, CmsContext, I18nProvider, type AuthState } from '@aircraft/ui'
import { ThemeProvider } from '@aircraft/design-tokens'
import type { CmsSource, ThemeMode } from '@aircraft/shared-types'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const [themeMode] = useState<ThemeMode>('dark')

  const authState = useMemo<AuthState>(() => ({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: false,
    login: async () => {},
    logout: async () => {},
    refresh: async () => {},
  }), [])

  const cmsContextValue = useMemo(() => ({
    fetchSources: async (_signal: AbortSignal): Promise<CmsSource[]> => [],
  }), [])

  return (
    <ThemeProvider mode={themeMode}>
      <AuthContext.Provider value={authState}>
        <CmsContext.Provider value={cmsContextValue}>
          <I18nProvider>
            <Component {...pageProps} />
          </I18nProvider>
        </CmsContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  )
}
