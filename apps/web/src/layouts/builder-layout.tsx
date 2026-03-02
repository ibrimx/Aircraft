import type { JSX, ReactNode } from 'react';

import { useBreakpoint } from '@aircraft/ui';

import { AppShell } from '../shell/app-shell';
import { DesktopLayout } from '../shell/desktop-layout';
import { Inspector } from '../shell/inspector';
import { MobileLayout } from '../shell/mobile-layout';
import { Sidebar } from '../shell/sidebar';
import { StatusBar } from '../shell/status-bar';
import { Toolbar } from '../shell/toolbar';

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
