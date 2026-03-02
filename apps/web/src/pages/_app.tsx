import type { AppProps } from 'next/app'
import { useMemo } from 'react'
import { AuthContext, CmsContext, I18nProvider, type AuthState } from '@aircraft/ui'
import type { CmsSource } from '@aircraft/shared-types'

export default function App({ Component, pageProps }: AppProps) {
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
    <AuthContext.Provider value={authState}>
      <CmsContext.Provider value={cmsContextValue}>
        <I18nProvider>
          <Component {...pageProps} />
        </I18nProvider>
      </CmsContext.Provider>
    </AuthContext.Provider>
  )
}
