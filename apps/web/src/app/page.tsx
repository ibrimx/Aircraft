// apps/web/src/app/page.tsx
import { AppShell } from '@aircraft/ui';
import { DashboardPage } from '../dashboard'; // مسار حسب المشروع

export const runtime = 'edge';

export default function RootPage() {
  return (
    <AppShell>
      <DashboardPage />
    </AppShell>
  );
}
