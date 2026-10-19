import styles from './Toast.module.css';

type ToastProps = {
  message: string;
  onClose: () => void;
};

export function Toast({ message, onClose }: ToastProps) {
  return (
    <div className={styles.toast} role="alert">
      <div className={styles.content}>
        <span className={styles.title}>Retry failed</span>
        <p className={styles.message}>{message}</p>
      </div>

      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}
