import { DashboardLayout } from '../components/layout/dashboard-layout';
import OverviewPage from './overview/page';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <OverviewPage />
    </DashboardLayout>
  );
}
