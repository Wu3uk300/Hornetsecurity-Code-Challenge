import type { AutomationRun } from '../types/automationRun';

export type SortField = 'name' | 'application' | 'status' | 'created_at' | 'duration_ms';

export type SortDirection = 'asc' | 'desc';

export function sortRuns(
  runs: AutomationRun[],
  field: SortField,
  direction: SortDirection,
): AutomationRun[] {
  return [...runs].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (aValue === null) return bValue === null ? 0 : 1;
    if (bValue === null) return -1;

    let comparison: number;

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}
