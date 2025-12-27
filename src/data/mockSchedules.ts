
export interface TimeRange {
  id: number;
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "18:00"
  days: ('Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo')[];
  actions: string[]; // e.g., ["Responder automáticamente", "Transferir a agente"]
}

export interface Schedule {
  id: number;
  name: string;
  description: string;
  timeRanges: TimeRange[];
}

export const mockSchedules: Schedule[] = [
  {
    id: 1,
    name: 'Horario de Oficina',
    description: 'Horario laboral estándar de lunes a viernes.',
    timeRanges: [
      {
        id: 101,
        startTime: '09:00',
        endTime: '18:00',
        days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
        actions: ['Responder automáticamente', 'Transferir a agente'],
      },
    ],
  },
  {
    id: 2,
    name: 'Horario Nocturno y Fines de Semana',
    description: 'Fuera del horario laboral, se usan respuestas automáticas.',
    timeRanges: [
      {
        id: 201,
        startTime: '18:01',
        endTime: '08:59',
        days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
        actions: ['Responder automáticamente', 'Enviar notificación'],
      },
      {
        id: 202,
        startTime: '00:00',
        endTime: '23:59',
        days: ['Sábado', 'Domingo'],
        actions: ['Responder automáticamente', 'Enviar notificación'],
      },
    ],
  },
];
