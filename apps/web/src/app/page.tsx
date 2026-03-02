import { AppShell } from '../shell/app-shell';
import { DashboardPage } from '../dashboard';

export const runtime = 'edge';

export default function RootPage() {
  return (
    <AppShell>
      <DashboardPage />
    </AppShell>
  );
}
