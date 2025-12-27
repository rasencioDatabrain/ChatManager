export interface ClientProfileData {
  id: number;
  name: string;
  alias: string;
  rut: string;
  phone: string;
  email: string;
  location: string;
  timezone: string;
}

export const mockClients: ClientProfileData[] = [
  {
    id: 1,
    name: 'Constructora XYZ S.A.',
    alias: 'Constructora',
    rut: '76.123.456-7',
    phone: '+56 9 1234 5678',
    email: 'contacto@constructoraxyz.cl',
    location: 'Santiago, RM, Chile',
    timezone: 'GMT-4',
  },
  {
    id: 2,
    name: 'Juan Pérez',
    alias: 'Juanito',
    rut: '12.345.678-9',
    phone: '+56 9 8765 4321',
    email: 'juan.perez@email.com',
    location: 'Valparaíso, V, Chile',
    timezone: 'GMT-4',
  },
  {
    id: 3,
    name: 'Importadora Global Ltda.',
    alias: 'Global',
    rut: '77.890.123-4',
    phone: '+56 2 2345 6789',
    email: 'info@global.cl',
    location: 'Concepción, VIII, Chile',
    timezone: 'GMT-4',
  },
];
