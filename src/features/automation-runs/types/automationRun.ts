export type AutomationStatus = 'success' | 'failed' | 'running';

export type AutomationRun = {
  id: string;
  name: string;
  application: string;
  status: AutomationStatus;
  timestamp: string;
  duration: number | null;
};
