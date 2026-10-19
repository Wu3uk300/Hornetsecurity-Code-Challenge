export type AutomationStatus = 'success' | 'failed' | 'running';

export type AutomationRun = {
  id: number;
  name: string;
  application: string;
  status: AutomationStatus;
  created_at: string;
  duration_ms: number | null;
};

export type RetryResponse = {
  id: number;
  status: 'running';
};
