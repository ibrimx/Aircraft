import type { JSX, ReactNode } from 'react';

import { useBreakpoint } from '@aircraft/ui';

import { AppShell } from '../shell/app-shell';
import { DesktopLayout } from '../shell/desktop-layout';
import { Inspector } from '../shell/inspector';
import { MobileLayout } from '../shell/mobile-layout';
import { Sidebar } from '../shell/sidebar';
import { StatusBar } from '../shell/status-bar';
import { Toolbar } from '../shell/toolbar';
import { Workspace } from '../shell/workspace';

export type StudioLayoutProps = {
  children: ReactNode;
};

export function StudioLayout({ children }: StudioLayoutProps): JSX.Element {
  const { isMobile } = useBreakpoint();

  return (
    <AppShell>
      {isMobile ? (
        <MobileLayout
          toolbar={<Toolbar />}
          workspace={<Workspace>{children}</Workspace>}
          statusBar={<StatusBar />}
        />
      ) : (
        <DesktopLayout
          sidebar={<Sidebar open onToggle={() => {}} />}
          toolbar={<Toolbar />}
          workspace={<Workspace>{children}</Workspace>}
          inspector={<Inspector open={false} onClose={() => {}} />}
          statusBar={<StatusBar />}
        />
      )}
    </AppShell>
  );
}
