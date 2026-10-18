import { useAutomationRuns } from './hooks/useAutomationRuns';
import styles from './AutomationRunsDashboard.module.css';
import { DashboardHeader } from './components/DashboardHeader/DashboardHeader';
import { StatsOverview } from './components/StatsOverview/StatsOverview';
import { RunsTable } from './components/RunsTable/RunsTable';
import { Pagination } from './components/Pagination/Pagination';
import { useState } from 'react';
export function AutomationRunsDashboard() {
  const { runs, isLoading, error } = useAutomationRuns();
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedRuns = runs.slice(startIndex, startIndex + PAGE_SIZE);
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
            <RunsTable runs={paginatedRuns} />
            <Pagination
              currentPage={currentPage}
              totalItems={runs.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </main>
  );
}
