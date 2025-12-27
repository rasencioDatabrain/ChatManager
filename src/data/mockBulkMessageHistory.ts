
import type { GroupMember } from './mockUserGroups';

export interface BulkMessageHistoryEntry {
  id: string;
  groupName: string;
  message: string;
  timestamp: Date;
  status: 'Sent' | 'Failed';
  attachmentCount: number;
  members: GroupMember[];
}

export const mockBulkMessageHistory: BulkMessageHistoryEntry[] = [
  {
    id: 'hist-1',
    groupName: 'Clientes VIP',
    message: 'Hola! Tenemos una oferta especial para ti esta semana.',
    timestamp: new Date('2025-10-24T10:30:00'),
    status: 'Sent',
    attachmentCount: 1,
    members: [
      { id: 'user-1', name: 'Ana García', phone: '+56 9 1234 5678' },
      { id: 'user-2', name: 'Carlos Vera', phone: '+56 9 8765 4321' },
    ],
  },
  {
    id: 'hist-2',
    groupName: 'Nuevos Leads',
    message: 'Gracias por unirte a nuestro webinar. Aquí tienes el material prometido.',
    timestamp: new Date('2025-10-23T15:00:00'),
    status: 'Sent',
    attachmentCount: 0,
    members: [
      { id: 'user-3', name: 'Pedro Pascal', phone: '+56 9 1111 2222' },
    ],
  },
  {
    id: 'hist-3',
    groupName: 'Soporte Técnico',
    message: 'Recordatorio: Mañana tendremos una breve interrupción del servicio por mantenimiento.',
    timestamp: new Date('2025-10-22T18:45:10'),
    status: 'Sent',
    attachmentCount: 0,
    members: [
      { id: 'user-4', name: 'Laura Martínez', phone: '+56 9 5555 4444' },
      { id: 'user-5', name: 'Juan Soto', phone: '+56 9 9999 8888' },
      { id: 'user-6', name: 'Maria Lopez', phone: '+56 9 7777 6666' },
    ],
  },
];
