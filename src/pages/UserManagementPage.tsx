
import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import UserList from '../components/UserList';
import UserEditModal from '../components/UserEditModal';
import UserDeleteModal from '../components/UserDeleteModal';
import { mockUsers } from '../data/mockUsers';
import type { User } from '../data/mockUsers';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowEditModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleSaveUser = (user: User) => {
    if (user.id) {
      // Edit
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
    } else {
      // Add
      const newUser = { ...user, id: Math.max(...users.map(u => u.id)) + 1 };
      setUsers([...users, newUser]);
    }
    setShowEditModal(false);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Usuarios y Roles</h1>
        <Button variant="primary" onClick={handleAddUser}>
          Agregar Nuevo Usuario
        </Button>
      </div>
      
      <UserList users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />

      <UserEditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />

      <UserDeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onDelete={confirmDelete}
        user={selectedUser}
      />
    </Container>
  );
};

export default UserManagementPage;
