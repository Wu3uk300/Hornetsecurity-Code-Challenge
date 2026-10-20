import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAutomationRuns } from '../src/features/automation-runs/hooks/useAutomationRuns';

import { getAutomationRuns, retryAutomationRun } from '../src/features/automation-runs/api/runsApi';

import type { AutomationRun } from '../src/features/automation-runs/types/automationRun';

vi.mock('../src/features/automation-runs/api/runsApi', () => ({
  getAutomationRuns: vi.fn(),
  retryAutomationRun: vi.fn(),
}));

const mockRuns: AutomationRun[] = [
  {
    id: 102,
    name: 'Backup',
    application: 'Microsoft 365',
    status: 'failed',
    created_at: '2026-01-10T10:00:00Z',
    duration_ms: 500,
  },
];

describe('useAutomationRuns', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(getAutomationRuns).mockResolvedValue(mockRuns.map((run) => ({ ...run })));
  });

  it('updates a failed run to running after successful retry', async () => {
    vi.mocked(retryAutomationRun).mockResolvedValue({
      id: 102,
      status: 'running',
    });

    const { result } = renderHook(() => useAutomationRuns());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.runs[0].status).toBe('failed');

    await act(async () => {
      await result.current.retryRun(102);
    });

    expect(retryAutomationRun).toHaveBeenCalledWith(102);
    expect(retryAutomationRun).toHaveBeenCalledTimes(1);

    expect(result.current.runs[0].status).toBe('running');
    expect(result.current.runs[0].duration_ms).toBeNull();
    expect(result.current.retryingRunId).toBeNull();
    expect(result.current.retryError).toBeNull();
  });

  it('preserves run status and shows an error when retry fails', async () => {
    vi.mocked(retryAutomationRun).mockRejectedValue(new Error('Server error'));

    const { result } = renderHook(() => useAutomationRuns());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.retryRun(102);
    });

    expect(result.current.runs[0].status).toBe('failed');
    expect(result.current.runs[0].duration_ms).toBe(500);

    expect(result.current.retryError).toBe('Failed to retry automation run. Please try again.');

    expect(result.current.retryingRunId).toBeNull();
  });

  it('prevents duplicate retry requests while a retry is in progress', async () => {
    let resolveRetry!: (value: { id: number; status: 'running' }) => void;

    const pendingRetry = new Promise<{
      id: number;
      status: 'running';
    }>((resolve) => {
      resolveRetry = resolve;
    });

    vi.mocked(retryAutomationRun).mockReturnValue(pendingRetry);

    const { result } = renderHook(() => useAutomationRuns());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      const firstRetry = result.current.retryRun(102);
      const secondRetry = result.current.retryRun(102);

      expect(retryAutomationRun).toHaveBeenCalledTimes(1);

      resolveRetry({
        id: 102,
        status: 'running',
      });

      await Promise.all([firstRetry, secondRetry]);
    });

    expect(result.current.runs[0].status).toBe('running');
    expect(result.current.runs[0].duration_ms).toBeNull();
    expect(result.current.retryingRunId).toBeNull();
  });

  it('handles an error when loading automation runs', async () => {
    vi.mocked(getAutomationRuns).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAutomationRuns());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load automation runs.');

    expect(result.current.runs).toEqual([]);
    expect(getAutomationRuns).toHaveBeenCalledTimes(1);
  });
});
