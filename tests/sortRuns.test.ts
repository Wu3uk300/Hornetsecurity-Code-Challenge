import { describe, expect, it } from 'vitest';
import { sortRuns } from '../src/features/automation-runs/utils/sortRuns';
import type { AutomationRun } from '../src/features/automation-runs/types/automationRun';

const runs: AutomationRun[] = [
  {
    id: 1,
    name: 'Backup',
    application: 'Microsoft 365',
    status: 'success',
    created_at: '2026-01-10T10:00:00Z',
    duration_ms: 500,
  },
  {
    id: 2,
    name: 'Sync',
    application: 'Google Workspace',
    status: 'running',
    created_at: '2026-01-11T10:00:00Z',
    duration_ms: null,
  },
  {
    id: 3,
    name: 'Report',
    application: 'Salesforce',
    status: 'success',
    created_at: '2026-01-12T10:00:00Z',
    duration_ms: 100,
  },
];

describe('sortRuns', () => {
  it('sorts runs by duration in ascending order', () => {
    const result = sortRuns(runs, 'duration_ms', 'asc');

    expect(result.map((run) => run.id)).toEqual([3, 1, 2]);
  });

  it('places null durations last in descending order', () => {
    const result = sortRuns(runs, 'duration_ms', 'desc');

    expect(result.map((run) => run.id)).toEqual([1, 3, 2]);
  });

  it('sorts runs by creation date in descending order', () => {
    const result = sortRuns(runs, 'created_at', 'desc');

    expect(result.map((run) => run.id)).toEqual([3, 2, 1]);
  });

  it('does not mutate the original array', () => {
    const originalOrder = runs.map((run) => run.id);

    sortRuns(runs, 'duration_ms', 'asc');

    expect(runs.map((run) => run.id)).toEqual(originalOrder);
  });
});
