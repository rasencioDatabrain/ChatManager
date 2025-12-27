
export interface GroupMember {
  id: string;
  name: string;
  phone: string;
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  creationDate: string;
  lastUpdated: string;
  members: GroupMember[];
}

export const mockUserGroups: UserGroup[] = [
  {
    id: 'group-1',
    name: 'Clientes VIP',
    description: 'Clientes con historial de compras alto.',
    creationDate: '2025-10-01',
    lastUpdated: '2025-10-20',
    members: [
      { id: 'user-1', name: 'Ana García', phone: '+56 9 1234 5678' },
      { id: 'user-2', name: 'Carlos Vera', phone: '+56 9 8765 4321' },
    ],
  },
  {
    id: 'group-2',
    name: 'Nuevos Leads',
    description: 'Contactos del último webinar.',
    creationDate: '2025-10-15',
    lastUpdated: '2025-10-15',
    members: [
      { id: 'user-3', name: 'Pedro Pascal', phone: '+56 9 1111 2222' },
    ],
  },
  {
    id: 'group-3',
    name: 'Soporte Técnico',
    description: 'Grupo para escalar casos de soporte.',
    creationDate: '2025-09-20',
    lastUpdated: '2025-10-18',
    members: [
      { id: 'user-4', name: 'Laura Martínez', phone: '+56 9 5555 4444' },
      { id: 'user-5', name: 'Juan Soto', phone: '+56 9 9999 8888' },
      { id: 'user-6', name: 'Maria Lopez', phone: '+56 9 7777 6666' },
    ],
  },
];
