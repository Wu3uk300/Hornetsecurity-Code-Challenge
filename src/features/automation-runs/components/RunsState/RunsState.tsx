import styles from './RunsState.module.css';
import emptyIcon from '../../../../assets/stateIcons/empty.webp';
type RunsStateProps = {
  state: 'loading' | 'error' | 'empty';
  onRetry?: () => void;
};

const stateContent = {
  loading: {
    title: 'Loading automation runs',
    description: 'Please wait while we fetch your automation runs.',
  },
  error: {
    title: 'Unable to load automation runs',
    description: 'Something went wrong while loading the data',
  },
  empty: {
    title: 'No automation runs yet',
    description: 'Automation runs will appear here once they are available.',
  },
};

export function RunsState({ state, onRetry }: RunsStateProps) {
  const { title, description } = stateContent[state];

  return (
    <section
      className={styles.container}
      role={state === 'error' ? 'alert' : 'status'}
      aria-busy={state === 'loading'}
    >
      <div className={styles.icon} aria-hidden="true">
        {state === 'loading' ? (
          <span className={styles.spinner} />
        ) : state === 'error' ? (
          <div className={styles.errorIcon}>
            <span className={styles.errorIconText}>!</span>
          </div>
        ) : (
          <img src={emptyIcon} alt="Empty" className={styles.emptyIcon} />
        )}
      </div>

      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {state === 'error' && (
        <button type="button" className={styles.retryButton} onClick={onRetry}>
          Try again
        </button>
      )}
    </section>
  );
}
