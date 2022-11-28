import { ReportsList } from '~features/reports/components/ReportsList/ReportsList';

export function ReportsPage({ goToReport }: { goToReport: (id: string) => void }) {
  return (
    <div>
      <ReportsList goToReport={goToReport} />
    </div>
  );
}
