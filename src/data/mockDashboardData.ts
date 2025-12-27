
export interface AgentPerformance {
  id: string;
  name: string;
  activeConversations: number;
  closedConversations: number;
  avgResponseTime: string; // in minutes
}

export const mockAgentPerformance: AgentPerformance[] = [
  {
    id: 'agent-1',
    name: 'Sofía',
    activeConversations: 1,
    closedConversations: 15,
    avgResponseTime: '2m',
  },
  {
    id: 'agent-2',
    name: 'Juan',
    activeConversations: 0,
    closedConversations: 25,
    avgResponseTime: '4m',
  },
  {
    id: 'agent-3',
    name: 'Admin',
    activeConversations: 0,
    closedConversations: 5,
    avgResponseTime: '1m',
  },
];

export interface DailySales {
  date: string;
  sales: number;
}

export const mockDailySales: DailySales[] = [
  { date: '2025-10-19', sales: 5 },
  { date: '2025-10-20', sales: 8 },
  { date: '2025-10-21', sales: 6 },
  { date: '2025-10-22', sales: 12 },
  { date: '2025-10-23', sales: 10 },
  { date: '2025-10-24', sales: 15 },
  { date: '2025-10-25', sales: 9 },
];
