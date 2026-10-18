import { useEffect, useState } from 'react';
import { getAutomationRuns } from '../api/runsApi';
import type { AutomationRun } from '../types/automationRun';

export function useAutomationRuns() {
  const [runs, setRuns] = useState<AutomationRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadRuns() {
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

    loadRuns();

    return () => {
      isActive = false;
    };
  }, []);

  return { runs, isLoading, error };
}
