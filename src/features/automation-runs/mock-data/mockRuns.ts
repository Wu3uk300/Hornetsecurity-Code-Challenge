import type { AutomationRun } from '../types/automationRun';

export const mockRuns: AutomationRun[] = [
  {
    id: 'run-001',
    name: 'Customer Data Sync',
    application: 'Salesforce',
    status: 'success',
    timestamp: '2026-10-17T08:30:00Z',
    duration: 125000,
  },
  {
    id: 'run-002',
    name: 'Invoice Processing',
    application: 'SAP',
    status: 'failed',
    timestamp: '2026-10-17T09:15:00Z',
    duration: 45000,
  },
  {
    id: 'run-003',
    name: 'Email Notifications',
    application: 'Microsoft 365',
    status: 'running',
    timestamp: '2026-10-17T10:00:00Z',
    duration: null,
  },
  {
    id: 'run-004',
    name: 'Ticket Synchronization',
    application: 'Zendesk',
    status: 'success',
    timestamp: '2026-10-16T14:20:00Z',
    duration: 82000,
  },
  {
    id: 'run-005',
    name: 'Daily Report Generation',
    application: 'Power BI',
    status: 'failed',
    timestamp: '2026-10-16T07:00:00Z',
    duration: null,
  },
  {
    id: 'run-006',
    name: 'User Provisioning',
    application: 'Microsoft Entra ID',
    status: 'success',
    timestamp: '2026-10-17T07:45:00Z',
    duration: 310000,
  },
];
