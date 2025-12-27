
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Agent' | 'Admin' | 'Supervisor';
  status: 'Active' | 'Inactive';
}

export const mockUsers: User[] = [
  { id: 1, name: 'Carlos Rodriguez', email: 'carlos.rodriguez@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Sofia Lopez', email: 'sofia.lopez@example.com', role: 'Supervisor', status: 'Active' },
  { id: 3, name: 'Juan Gomez', email: 'juan.gomez@example.com', role: 'Agent', status: 'Active' },
  { id: 4, name: 'Maria Fernandez', email: 'maria.fernandez@example.com', role: 'Agent', status: 'Inactive' },
];
