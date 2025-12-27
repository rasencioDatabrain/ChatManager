
import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { ClientProfileData } from '../data/mockClients';

interface ClientListProps {
  clients: ClientProfileData[];
  onEdit: (client: ClientProfileData) => void;
  onDelete: (client: ClientProfileData) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onEdit, onDelete }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Nombre / Razón Social</th>
          <th>Alias</th>
          <th>Teléfono</th>
          <th>Correo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clients.map((client) => (
          <tr key={client.id}>
            <td>{client.name}</td>
            <td>{client.alias}</td>
            <td>{client.phone}</td>
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
