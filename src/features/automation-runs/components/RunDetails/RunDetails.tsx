import { useEffect, useRef } from 'react';
import type { AutomationRun } from '../../types/automationRun';
import styles from './RunDetails.module.css';

type RunDetailsProps = {
  run: AutomationRun;
  onClose: () => void;
};

const statusLabels: Record<AutomationRun['status'], string> = {
  success: 'Success',
  failed: 'Failed',
  running: 'Running',
};

function formatDuration(duration: number | null): string {
  return duration === null ? '-' : `${(duration / 1000).toFixed(1)}s`;
}

function formatTimestamp(timestamp: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date(timestamp));
}

export function RunDetails({ run, onClose }: RunDetailsProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'Tab') {
        const drawer = closeButtonRef.current?.closest('[role="dialog"]');

        const focusable = drawer?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled)',
        );

        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="run-details-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 id="run-details-title" className={styles.title}>
            Run Details
          </h2>

          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close run details"
          >
            ×
          </button>
        </header>

        <div className={styles.content}>
          <div className={styles.summary}>
            <h3 className={styles.runName}>{run.name}</h3>

            <span className={`${styles.status} ${styles[run.status]}`}>
              {statusLabels[run.status]}
            </span>
          </div>

          <dl className={styles.details}>
            <div className={styles.detailRow}>
              <dt>Application</dt>
              <dd>{run.application}</dd>
            </div>

            <div className={styles.detailRow}>
              <dt>Timestamp</dt>
              <dd>
                <time dateTime={run.timestamp}>{formatTimestamp(run.timestamp)}</time>
              </dd>
            </div>

            <div className={styles.detailRow}>
              <dt>Duration</dt>
              <dd>{formatDuration(run.duration)}</dd>
            </div>

            <div className={styles.detailRow}>
              <dt>Run ID</dt>
              <dd>{run.id}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}
