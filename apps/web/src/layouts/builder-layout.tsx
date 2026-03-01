import type { ReactNode, JSX } from 'react';
import {
  AppShell,
  DesktopLayout,
  MobileLayout,
  Sidebar,
  Toolbar,
  StatusBar,
  Inspector,
  useBreakpoint,
} from '@brimair/ui';

export type BuilderLayoutProps = {
  children: ReactNode;
};

export function BuilderLayout({ children }: BuilderLayoutProps): JSX.Element {
  const { isMobile } = useBreakpoint();

  return (
    <AppShell>
      {isMobile ? (
        <MobileLayout
          toolbar={<Toolbar mode="builder" />}
          content={children}
          inspector={<Inspector mode="builder" />}
        />
      ) : (
        <DesktopLayout
          sidebar={<Sidebar mode="builder" />}
          toolbar={<Toolbar mode="builder" />}
          content={children}
          inspector={<Inspector mode="builder" />}
          statusBar={<StatusBar />}
        />
      )}
    </AppShell>
  );
}
