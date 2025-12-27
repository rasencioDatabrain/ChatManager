// src/types.ts

export interface AppConversation {
  id: string;
  customerName: string;
  customerPhone: string;
  lastMessage: string;
  timestamp: string;
  status: 'active' | 'pending' | 'closed';
  agent: string | null;
}
