import styles from './SearchInput.module.css';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor="runs-search" className={styles.label}>
        Search automation runs
      </label>

      <input
        id="runs-search"
        type="search"
        className={styles.input}
        placeholder="Search by name or application..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
