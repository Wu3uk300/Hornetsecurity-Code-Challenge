import { useState, useMemo } from 'react';
import { useAutomationRuns } from './hooks/useAutomationRuns';
import { DashboardHeader } from './components/DashboardHeader/DashboardHeader';
import { StatsOverview } from './components/StatsOverview/StatsOverview';
import { SearchInput } from './components/SearchInput/SearchInput';
import { RunsTable } from './components/RunsTable/RunsTable';
import { Pagination } from './components/Pagination/Pagination';
import { StatusFilter, type StatusFilterValue } from './components/StatusFilter/StatusFilter';
import { sortRuns, type SortField, type SortDirection } from './utils/sortRuns';
import { RunsState } from './components/RunsState/RunsState';
import { RunDetails } from './components/RunDetails/RunDetails';
import { RunsSkeleton } from './components/RunsSkeleton/RunsSkeleton';
import { Toast } from './components/Toast/Toast';
import type { AutomationRun } from './types/automationRun';
import styles from './AutomationRunsDashboard.module.css';

const PAGE_SIZE = 10;

export function AutomationRunsDashboard() {
  //DATA
  const { runs, isLoading, error, refetch, retryRun, retryingRunId, retryError, clearRetryError } =
    useAutomationRuns();

  //State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedRun, setSelectedRun] = useState<AutomationRun | null>(null);

  //Derived DATA
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const searchedRuns = useMemo(() => {
    return runs.filter(
      (run) =>
        run.name.toLowerCase().includes(normalizedQuery) ||
        run.application.toLowerCase().includes(normalizedQuery),
    );
  }, [runs, normalizedQuery]);

  const filteredRuns = useMemo(() => {
    return searchedRuns.filter((run) => statusFilter === 'all' || run.status === statusFilter);
  }, [searchedRuns, statusFilter]);

  const sortedRuns = useMemo(() => {
    return sortRuns(filteredRuns, sortField, sortDirection);
  }, [filteredRuns, sortField, sortDirection]);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedRuns = sortedRuns.slice(startIndex, startIndex + PAGE_SIZE);

  //Handlers
  function handleStatusChange(value: StatusFilterValue) {
    setStatusFilter(value);
    setCurrentPage(1);
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }

    setCurrentPage(1);
  }

  const handleCloseDetails = () => {
    setSelectedRun(null);
  };

  return (
    <main className={styles.dashboard}>
      <DashboardHeader />

      <div className={styles.content}>
        {isLoading ? (
          <RunsSkeleton />
        ) : // <RunsState state="loading" />
        error ? (
          <RunsState state="error" onRetry={refetch} />
        ) : runs.length === 0 ? (
          <RunsState state="empty" />
        ) : (
          <>
            <StatsOverview runs={runs} />

            <div className={styles.toolbar}>
              <SearchInput value={searchQuery} onChange={handleSearchChange} />

              <StatusFilter value={statusFilter} onChange={handleStatusChange} />
            </div>

            {filteredRuns.length === 0 ? (
              <p role="status">No runs match your search or filters.</p>
            ) : (
              <>
                <RunsTable
                  runs={paginatedRuns}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  onSelectRun={setSelectedRun}
                  onRetry={retryRun}
                  retryingRunId={retryingRunId}
                />

                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredRuns.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </>
        )}
      </div>
      {selectedRun && (
        <RunDetails
          run={runs.find((run) => run.id === selectedRun.id) ?? selectedRun}
          onClose={handleCloseDetails}
          onRetry={retryRun}
          retryingRunId={retryingRunId}
        />
      )}
      {retryError && <Toast message={retryError} onClose={clearRetryError} />}
    </main>
  );
}
