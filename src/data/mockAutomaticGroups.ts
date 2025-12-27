
export interface AutomaticGroupTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  isActive: boolean;
}

export const mockAutomaticGroupTemplates: AutomaticGroupTemplate[] = [
  {
    id: 'auto-group-1',
    title: 'Clientes Frecuentes',
    description: 'Agrupa automáticamente a clientes que contactan más de 5 veces por semana.',
    category: 'Frecuencia',
    isActive: true,
  },
  {
    id: 'auto-group-2',
    title: 'Interesados en Ventas',
    description: 'Agrupa a clientes que han sido etiquetados con la etiqueta "ventas".',
    category: 'Etiquetas',
    isActive: false,
  },
  {
    id: 'auto-group-3',
    title: 'Solicitudes de Soporte',
    description: 'Agrupa a clientes que han sido etiquetados con la etiqueta "soporte".',
    category: 'Etiquetas',
    isActive: true,
  },
  {
    id: 'auto-group-4',
    title: 'Clientes de Chile',
    description: 'Agrupa a todos los números que comienzan con el prefijo +56.',
    category: 'Ubicación',
    isActive: true,
  },
  {
    id: 'auto-group-5',
    title: 'Clientes de Argentina',
    description: 'Agrupa a todos los números que comienzan con el prefijo +54.',
    category: 'Ubicación',
    isActive: false,
  },
    {
    id: 'auto-group-6',
    title: 'Atendidos por Sofía',
    description: 'Agrupa a todos los clientes que han sido atendidos por la agente Sofía.',
    category: 'Agente',
    isActive: false,
  },
];
