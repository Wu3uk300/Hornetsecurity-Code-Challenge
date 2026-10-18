import type { AutomationStatus } from '../../types/automationRun';
import styles from './StatusFilter.module.css';

export type StatusFilterValue = AutomationStatus | 'all';

type StatusFilterProps = {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
};

const options: { value: StatusFilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'Failed' },
  { value: 'running', label: 'Running' },
];

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor="status-filter" className={styles.label}>
        Status
      </label>

      <select
        id="status-filter"
        className={styles.select}
        value={value}
        onChange={(event) => onChange(event.target.value as StatusFilterValue)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
