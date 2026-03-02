'use client';

import type { JSX, ReactNode } from 'react';
import { useBreakpoint } from '@aircraft/ui';

export type BuilderLayoutProps = {
  children: ReactNode;
};

// Toolbar
type ToolbarProps = { mode?: 'builder' | 'viewer' };
function Toolbar({ mode }: ToolbarProps): JSX.Element {
  return (
    <div
      style={{
        height: 56,
        background: '#0070f3',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
      }}
    >
      Toolbar mode: {mode}
    </div>
  );
}

// Inspector
type InspectorProps = { mode?: 'builder' | 'viewer' };
function Inspector({ mode }: InspectorProps): JSX.Element {
  return (
    <div
      style={{
        width: 240,
        background: '#f0f0f0',
        padding: 16,
      }}
    >
      Inspector mode: {mode}
    </div>
  );
}

// Sidebar
type SidebarProps = { mode?: 'builder' | 'viewer' };
function Sidebar({ mode }: SidebarProps): JSX.Element {
  return (
    <div
      style={{
        width: 200,
        background: '#e0e0e0',
        padding: 16,
      }}
    >
      Sidebar mode: {mode}
    </div>
  );
}

// StatusBar
function StatusBar(): JSX.Element {
  return (
    <div
      style={{
        height: 24,
        background: '#ccc',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
      }}
    >
      Status Bar
    </div>
  );
}

// MobileLayout
type MobileLayoutProps = {
  toolbar: JSX.Element;
  content: ReactNode;
  inspector: JSX.Element;
};
function MobileLayout({ toolbar, content, inspector }: MobileLayoutProps): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {toolbar}
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ flex: 1, padding: 16 }}>{content}</div>
        {inspector}
      </div>
    </div>
  );
}

// DesktopLayout
type DesktopLayoutProps = {
  sidebar: JSX.Element;
  toolbar: JSX.Element;
  content: ReactNode;
  inspector: JSX.Element;
  statusBar: JSX.Element;
};
function DesktopLayout({
  sidebar,
  toolbar,
  content,
  inspector,
  statusBar,
}: DesktopLayoutProps): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {toolbar}
      <div style={{ display: 'flex', flex: 1 }}>
        {sidebar}
        <div style={{ flex: 1, padding: 16 }}>{content}</div>
        {inspector}
      </div>
      {statusBar}
    </div>
  );
}

// AppShell
function AppShell({ children }: { children: ReactNode }): JSX.Element {
  return <div>{children}</div>;
}

// BuilderLayout
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

export default BuilderLayout;
