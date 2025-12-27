
export interface MessageTemplate {
  id: number;
  name: string;
  subject: string;
  htmlContent: string;
}

export const mockMessageTemplates: MessageTemplate[] = [
  {
    id: 1,
    name: 'Bienvenida a nuevo cliente',
    subject: '¡Bienvenido a nuestro servicio!',
    htmlContent: `
      <p>Hola <strong>{{client_name}}</strong>,</p>
      <p>¡Te damos la bienvenida a nuestro servicio! Estamos encantados de tenerte a bordo.</p>
      <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
      <p>Saludos,</p>
      <p>El equipo de Chat Manager</p>
    `,
  },
  {
    id: 2,
    name: 'Confirmación de pedido',
    subject: 'Confirmación de tu pedido #{{order_id}}',
    htmlContent: `
      <p>Hola <strong>{{client_name}}</strong>,</p>
      <p>Tu pedido <strong>#{{order_id}}</strong> ha sido confirmado y será procesado pronto.</p>
      <p>Puedes ver los detalles de tu pedido <a href="{{order_link}}">aquí</a>.</p>
      <p>Gracias por tu compra,</p>
      <p>El equipo de Chat Manager</p>
    `,
  },
  {
    id: 3,
    name: 'Recordatorio de cita',
    subject: 'Recordatorio de tu cita el {{date}}',
    htmlContent: `
      <p>Hola <strong>{{client_name}}</strong>,</p>
      <p>Este es un recordatorio de tu cita programada para el <strong>{{date}}</strong> a las <strong>{{time}}</strong>.</p>
      <p>Por favor, llega a tiempo. Si necesitas reprogramar, contáctanos.</p>
      <p>Atentamente,</p>
      <p>El equipo de Chat Manager</p>
    `,
  },
];
