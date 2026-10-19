import type { AutomationRun, RetryResponse } from '../types/automationRun';

const API_URL = import.meta.env.VITE_API_URL;

export async function getAutomationRuns(): Promise<AutomationRun[]> {
  const response = await fetch(`${API_URL}/api/automation-runs`);

  if (!response.ok) {
    throw new Error(`Failed to load automation runs: ${response.status}`);
  }

  const runs: AutomationRun[] = await response.json();

  return runs;
}

export async function retryAutomationRun(id: number): Promise<RetryResponse> {
  const response = await fetch(`${API_URL}/api/automation-runs/${id}/retry`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error(`Failed to retry automation run: ${response.status}`);
  }
  const result = await response.json();
  return result;
}
