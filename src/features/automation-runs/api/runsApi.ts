import type { AutomationRun } from '../types/automationRun';
import { mockRuns } from '../mock-data/mockRuns';

export async function getAutomationRuns(): Promise<AutomationRun[]> {
  return mockRuns;
}
