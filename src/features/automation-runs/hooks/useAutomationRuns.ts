import { useEffect, useRef, useState } from 'react';
import { getAutomationRuns, retryAutomationRun } from '../api/runsApi';
import type { AutomationRun } from '../types/automationRun';

export function useAutomationRuns() {
  const [runs, setRuns] = useState<AutomationRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestCount, setRequestCount] = useState(0);

  const [retryingRunId, setRetryingRunId] = useState<number | null>(null);
  const [retryError, setRetryError] = useState<string | null>(null);

  const retryInProgress = useRef(false);

  useEffect(() => {
    let isActive = true;

    async function loadRuns() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getAutomationRuns();

        if (isActive) {
          setRuns(data);
        }
      } catch {
        if (isActive) {
          setError('Failed to load automation runs.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadRuns();

    return () => {
      isActive = false;
    };
  }, [requestCount]);

  useEffect(() => {
    if (!retryError) return;

    const timeoutId = setTimeout(() => {
      setRetryError(null);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [retryError]);

  function refetch() {
    setRequestCount((count) => count + 1);
  }

  async function retryRun(id: number) {
    if (retryInProgress.current) {
      return;
    }

    retryInProgress.current = true;
    setRetryingRunId(id);
    setRetryError(null);

    try {
      const result = await retryAutomationRun(id);

      setRuns((currentRuns) =>
        currentRuns.map((run) =>
          run.id === result.id ? { ...run, status: result.status, duration_ms: null } : run,
        ),
      );
    } catch {
      setRetryError('Failed to retry automation run. Please try again.');
    } finally {
      retryInProgress.current = false;
      setRetryingRunId(null);
    }
  }
  function clearRetryError() {
    setRetryError(null);
  }
  return {
    runs,
    isLoading,
    error,
    refetch,
    retryRun,
    retryingRunId,
    retryError,
    clearRetryError,
  };
}
