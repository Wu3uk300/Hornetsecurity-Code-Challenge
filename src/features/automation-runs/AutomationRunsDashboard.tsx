import { useAutomationRuns } from './hooks/useAutomationRuns';
import styles from './AutomationRunsDashboard.module.css';
import { DashboardHeader } from './components/DashboardHeader/DashboardHeader';
import { StatsOverview } from './components/StatsOverview/StatsOverview';
import { RunsTable } from './components/RunsTable/RunsTable';
export function AutomationRunsDashboard() {
  const { runs, isLoading, error } = useAutomationRuns();

  return (
    <main className={styles.dashboard}>
      <DashboardHeader />

      <div className={styles.content}>
        {isLoading ? (
          <p role="status">Loading automation runs...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : runs.length === 0 ? (
          <p>No automation runs found.</p>
        ) : (
          <>
            <StatsOverview runs={runs} />
            <RunsTable runs={runs} />
          </>
        )}
      </div>
    </main>
  );
}
