import type { AutomationRun } from '../../types/automationRun';
import styles from './RunsTable.module.css';

type RunsTableProps = {
  runs: AutomationRun[];
};

const statusLabels: Record<AutomationRun['status'], string> = {
  success: 'Success',
  failed: 'Failed',
  running: 'Running',
};

function formatDuration(duration: number | null): string {
  if (duration === null) {
    return '—';
  }

  return `${(duration / 1000).toFixed(1)}s`;
}

function formatTimestamp(timestamp: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date(timestamp));
}

export function RunsTable({ runs }: RunsTableProps) {
  return (
    <section className={styles.section} aria-labelledby="runs-heading">
      <div className={styles.header}>
        <h2 id="runs-heading" className={styles.title}>
          Execution History
        </h2>

        <span className={styles.count}>{runs.length} runs</span>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Application</th>
              <th scope="col">Status</th>
              <th scope="col">Timestamp</th>
              <th scope="col">Duration</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody>
            {runs.map((run) => (
              <tr key={run.id}>
                <td className={styles.name}>{run.name}</td>
                <td>{run.application}</td>
                <td>
                  <span className={`${styles.status} ${styles[run.status]}`}>
                    {statusLabels[run.status]}
                  </span>
                </td>
                <td>
                  <time dateTime={run.timestamp}>{formatTimestamp(run.timestamp)}</time>
                </td>
                <td>{formatDuration(run.duration)}</td>
                <td>
                  {run.status === 'failed' ? (
                    <span className={styles.pendingAction}>Retry</span>
                  ) : (
                    <span className={styles.muted}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
