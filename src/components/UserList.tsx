
import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Usuario } from '../pages/UserManagementPage';

interface UserListProps {
  users: Usuario[];
  onEdit: (user: Usuario) => void;
  onDelete: (user: Usuario) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.nombre}</td>
            <td>{user.correo}</td>
            <td className="text-capitalize">{user.rol}</td>
            <td>
              <Badge bg={user.estado === 'activo' ? 'success' : 'secondary'} className="text-capitalize">
                {user.estado}
              </Badge>
            </td>
            <td>
              <Button variant="outline-primary" size="sm" onClick={() => onEdit(user)}>
                <FaEdit />
              </Button>{' '}
              <Button variant="outline-danger" size="sm" onClick={() => onDelete(user)}>
                <FaTrash />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserList;
