import styles from './RunsSkeleton.module.css';

export function RunsSkeleton() {
  return (
    <div className={styles.skeleton} role="status" aria-label="Loading automation runs">
      <span className={styles.srOnly}>Loading automation runs...</span>

      <div className={styles.stats}>
        {Array.from({ length: 4 }, (_, index) => (
          <div className={styles.statCard} key={index}>
            <div className={`${styles.placeholder} ${styles.statLabel}`} />
            <div className={`${styles.placeholder} ${styles.statValue}`} />
          </div>
        ))}
      </div>

      <div className={styles.toolbar}>
        <div className={`${styles.placeholder} ${styles.search}`} />
        <div className={`${styles.placeholder} ${styles.filter}`} />
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={`${styles.placeholder} ${styles.heading}`} />
          <div className={`${styles.placeholder} ${styles.count}`} />
        </div>

        <div className={styles.tableBody}>
          {Array.from({ length: 6 }, (_, index) => (
            <div className={styles.tableRow} key={index}>
              <div className={`${styles.placeholder} ${styles.cell}`} />
              <div className={`${styles.placeholder} ${styles.cell}`} />
              <div className={`${styles.placeholder} ${styles.status}`} />
              <div className={`${styles.placeholder} ${styles.cell}`} />
              <div className={`${styles.placeholder} ${styles.cell}`} />
              <div className={`${styles.placeholder} ${styles.action}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
