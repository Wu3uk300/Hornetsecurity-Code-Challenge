import styles from './DashboardHeader.module.css';

export function DashboardHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Automation Runs</h1>
        <p className={styles.description}>Monitor and manage your automation executions</p>
      </div>
    </header>
  );
}
