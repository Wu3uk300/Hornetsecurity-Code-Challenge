import type { AutomationRun } from '../../types/automationRun';
import styles from './StatsOverview.module.css';

type StatsOverviewProps = {
  runs: AutomationRun[];
};

export function StatsOverview({ runs }: StatsOverviewProps) {
  const totalRuns = runs.length;
  const successfulRuns = runs.filter((run) => run.status === 'success').length;
  const failedRuns = runs.filter((run) => run.status === 'failed').length;

  const successRate = totalRuns > 0 ? Math.round((successfulRuns / totalRuns) * 100) : 0;

  const completedDurations = runs
    .map((run) => run.duration)
    .filter((duration) => duration !== null);

  const averageDuration =
    completedDurations.length > 0
      ? completedDurations.reduce((sum, duration) => sum + duration, 0) /
        completedDurations.length /
        1000
      : null;

  return (
    <section className={styles.grid} aria-label="Execution statistics">
      <article className={styles.card}>
        <h2 className={styles.label}>Total Runs</h2>
        <p className={styles.value}>{totalRuns}</p>
      </article>

      <article className={styles.card}>
        <h2 className={styles.label}>Success Rate</h2>
        <p className={`${styles.value} ${styles.success}`}>{successRate}%</p>
      </article>

      <article className={styles.card}>
        <h2 className={styles.label}>Average Duration</h2>
        <p className={styles.value}>
          {averageDuration === null ? '—' : `${averageDuration.toFixed(1)}s`}
        </p>
      </article>

      <article className={styles.card}>
        <h2 className={styles.label}>Failed Runs</h2>
        <p className={`${styles.value} ${styles.failed}`}>{failedRuns}</p>
      </article>
    </section>
  );
}
