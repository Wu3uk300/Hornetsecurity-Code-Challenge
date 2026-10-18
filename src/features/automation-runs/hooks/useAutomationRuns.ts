import { useCallback, useEffect, useState } from 'react';
import { getAutomationRuns } from '../api/runsApi';
import type { AutomationRun } from '../types/automationRun';

export function useAutomationRuns() {
  const [runs, setRuns] = useState<AutomationRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function loadRuns() {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 3000));
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

  function refetch() {
    setRequestCount((count) => count + 1);
  }

  return { runs, isLoading, error, refetch };
}
