
export interface Message {
  id: number;
  sender: 'user' | 'agent';
  content: string;
  timestamp: string; // ISO 8601 string for full date and time
  type: 'text' | 'image' | 'audio';
}

export interface Conversation {
  id: string;
  customerName: string;
  customerPhone: string;
  lastMessage: string;
  timestamp: string; // ISO 8601 string for full date and time
  status: 'active' | 'pending' | 'closed';
  agent: string | null;
  messages: Message[];
}

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    customerName: 'Ana García',
    customerPhone: '+56 9 1234 5678',
    lastMessage: 'Hola, necesito ayuda con mi pedido.',
    timestamp: '2025-11-09T10:30:00Z',
    status: 'pending',
    agent: null,
    messages: [
      { id: 1, sender: 'user', content: 'Hola, necesito ayuda con mi pedido.', timestamp: '2025-11-09T10:30:00Z', type: 'text' },
    ],
  },
  {
    id: 'conv-2',
    customerName: 'Carlos Vera',
    customerPhone: '+56 9 8765 4321',
    lastMessage: 'Perfecto, muchas gracias por la gestión.',
    timestamp: '2025-11-09T10:25:00Z',
    status: 'active',
    agent: 'Sofía',
    messages: [
      { id: 1, sender: 'user', content: '¿Podrían revisar el estado de mi cuenta?', timestamp: '2025-11-09T10:20:00Z', type: 'text' },
      { id: 2, sender: 'agent', content: 'Claro, un momento por favor.', timestamp: '2025-11-09T10:22:00Z', type: 'text' },
      { id: 3, sender: 'agent', content: 'Hemos actualizado su estado. Ya puede revisar.', timestamp: '2025-11-09T10:24:00Z', type: 'text' },
      { id: 4, sender: 'user', content: 'Perfecto, muchas gracias por la gestión.', timestamp: '2025-11-09T10:25:00Z', type: 'text' },
    ],
  },
  {
    id: 'conv-3',
    customerName: 'Laura Martínez',
    customerPhone: '+56 9 5555 4444',
    lastMessage: 'Gracias, problema resuelto.',
    timestamp: '2025-11-08T15:25:00Z',
    status: 'closed',
    agent: 'Juan',
    messages: [
        { id: 1, sender: 'user', content: 'Mi producto llegó dañado.', timestamp: '2025-11-08T15:15:00Z', type: 'text' },
        { id: 2, sender: 'agent', content: 'Lamentamos el inconveniente, gestionaremos el cambio.', timestamp: '2025-11-08T15:20:00Z', type: 'text' },
        { id: 3, sender: 'user', content: 'Gracias, problema resuelto.', timestamp: '2025-11-08T15:25:00Z', type: 'text' },
    ],
  },
  {
    id: 'conv-4',
    customerName: 'Pedro Gómez',
    customerPhone: '+56 9 1111 2222',
    lastMessage: 'Necesito información sobre un producto.',
    timestamp: '2025-11-07T09:00:00Z',
    status: 'pending',
    agent: null,
    messages: [
      { id: 1, sender: 'user', content: 'Necesito información sobre un producto.', timestamp: '2025-11-07T09:00:00Z', type: 'text' },
    ],
  },
  {
    id: 'conv-5',
    customerName: 'Sofía Díaz',
    customerPhone: '+56 9 3333 4444',
    lastMessage: 'Todo claro, gracias.',
    timestamp: '2025-11-06T11:45:00Z',
    status: 'closed',
    agent: 'Ana',
    messages: [
      { id: 1, sender: 'user', content: 'Consulta sobre mi factura.', timestamp: '2025-11-06T11:30:00Z', type: 'text' },
      { id: 2, sender: 'agent', content: 'Revisando su factura...', timestamp: '2025-11-06T11:35:00Z', type: 'text' },
      { id: 3, sender: 'user', content: 'Todo claro, gracias.', timestamp: '2025-11-06T11:45:00Z', type: 'text' },
    ],
  },
  {
    id: 'conv-6',
    customerName: 'Roberto Fuentes',
    customerPhone: '+56 9 5555 6666',
    lastMessage: 'Problema con el envío.',
    timestamp: '2025-11-05T14:00:00Z',
    status: 'active',
    agent: 'Pedro',
    messages: [
      { id: 1, sender: 'user', content: 'Problema con el envío.', timestamp: '2025-11-05T14:00:00Z', type: 'text' },
    ],
  },
  {
    id: 'conv-7',
    customerName: 'Elena Rojas',
    customerPhone: '+56 9 7777 8888',
    lastMessage: 'Quiero cambiar mi plan.',
    timestamp: '2025-11-04T16:10:00Z',
    status: 'pending',
    agent: null,
    messages: [
      { id: 1, sender: 'user', content: 'Quiero cambiar mi plan.', timestamp: '2025-11-04T16:10:00Z', type: 'text' },
    ],
  },
  {
    id: 'conv-8',
    customerName: 'Miguel Torres',
    customerPhone: '+56 9 9999 0000',
    lastMessage: 'Gracias por la ayuda.',
    timestamp: '2025-11-03T09:30:00Z',
    status: 'closed',
    agent: 'Sofía',
    messages: [
      { id: 1, sender: 'user', content: 'No puedo acceder a mi cuenta.', timestamp: '2025-11-03T09:15:00Z', type: 'text' },
      { id: 2, sender: 'agent', content: 'Le ayudaremos a resetear su contraseña.', timestamp: '2025-11-03T09:20:00Z', type: 'text' },
      { id: 3, sender: 'user', content: 'Gracias por la ayuda.', timestamp: '2025-11-03T09:30:00Z', type: 'text' },
    ],
  },
  {
    id: 'conv-9',
    customerName: 'Isabel Castro',
    customerPhone: '+56 9 1231 2312',
    lastMessage: 'Consulta de saldo.',
    timestamp: '2025-11-02T10:00:00Z',
    status: 'active',
    agent: 'Juan',
    messages: [
      { id: 1, sender: 'user', content: 'Consulta de saldo.', timestamp: '2025-11-02T10:00:00Z', type: 'text' },
    ],
  },
  {
    id: 'conv-10',
    customerName: 'Fernando Soto',
    customerPhone: '+56 9 4564 5645',
    lastMessage: 'Problema con la conexión.',
    timestamp: '2025-11-01T13:00:00Z',
    status: 'pending',
    agent: null,
    messages: [
      { id: 1, sender: 'user', content: 'Problema con la conexión.', timestamp: '2025-11-01T13:00:00Z', type: 'text' },
    ],
  },
];
