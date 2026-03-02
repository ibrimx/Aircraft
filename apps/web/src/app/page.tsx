import { AppShell } from '../shell/app-shell';
import DashboardPage from '../pages/dashboard'; // هنا التغيير

export const runtime = 'edge';

export default function RootPage() {
  return (
    <AppShell>
      <DashboardPage />
    </AppShell>
  );
}
