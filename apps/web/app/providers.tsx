'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { AuthContext, CmsContext, I18nProvider, type AuthState } from '@aircraft/ui';
import { ThemeProvider } from '@aircraft/design-tokens';
import type { CmsSource, ThemeMode } from '@aircraft/shared-types';

export function Providers({ children }: { children: ReactNode }): React.JSX.Element {
  const [themeMode] = useState<ThemeMode>('dark');

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
    []
  );

  const cmsContextValue = useMemo(
    () => ({
      fetchSources: async (_signal: AbortSignal): Promise<CmsSource[]> => [],
    }),
    []
  );

  return (
    <ThemeProvider mode={themeMode}>
      <AuthContext.Provider value={authState}>
        <CmsContext.Provider value={cmsContextValue}>
          <I18nProvider>{children}</I18nProvider>
        </CmsContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
