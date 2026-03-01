import type { ReactNode, JSX } from 'react';
import {
  AppShell,
  DesktopLayout,
  MobileLayout,
  Sidebar,
  Toolbar,
  StatusBar,
  Inspector,
  Workspace,
  useBreakpoint,
} from '@aircraft/ui';

export type StudioLayoutProps = {
  children: ReactNode;
};

export function StudioLayout({ children }: StudioLayoutProps): JSX.Element {
  const { isMobile } = useBreakpoint();

  return (
    <AppShell>
      {isMobile ? (
        <MobileLayout
          toolbar={<Toolbar mode="studio" />}
          content={<Workspace>{children}</Workspace>}
          inspector={<Inspector mode="studio" />}
        />
      ) : (
        <DesktopLayout
          sidebar={<Sidebar mode="studio" />}
          toolbar={<Toolbar mode="studio" />}
          content={<Workspace>{children}</Workspace>}
          inspector={<Inspector mode="studio" />}
          statusBar={<StatusBar />}
        />
      )}
    </AppShell>
  );
}
