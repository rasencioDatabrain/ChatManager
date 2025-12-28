
import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Cliente } from '../pages/ClientProfilePage';

interface ClientListProps {
  clients: Cliente[];
  onEdit: (client: Cliente) => void;
  onDelete: (client: Cliente) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onEdit, onDelete }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Nombre Real</th>
          <th>Alias</th>
          <th>Teléfono</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client) => (
          <tr key={client.id}>
            <td>{client.nombre_real || client.nombre_perfil_wsp || 'N/A'}</td>
            <td>{client.alias}</td>
            <td>{client.telefono}</td>
            <td>{client.email}</td>
            <td>
              <Button variant="outline-primary" size="sm" onClick={() => onEdit(client)}>
                <FaEdit />
              </Button>{' '}
              <Button variant="outline-danger" size="sm" onClick={() => onDelete(client)}>
                <FaTrash />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ClientList;
