
import React, { useState } from 'react';
import { Container, Table, Button, ButtonGroup } from 'react-bootstrap';
import { mockUserGroups as initialGroups } from '../data/mockUserGroups';
import type { UserGroup } from '../data/mockUserGroups';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import GroupCreateEditModal from '../components/GroupCreateEditModal';
import GroupDeleteModal from '../components/GroupDeleteModal';

const UserGroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<UserGroup[]>(initialGroups);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);

  const handleShowCreateModal = () => {
    setSelectedGroup(null);
    setShowEditModal(true);
  };

  const handleShowEditModal = (group: UserGroup) => {
    setSelectedGroup(group);
    setShowEditModal(true);
  };

  const handleShowDeleteModal = (group: UserGroup) => {
    setSelectedGroup(group);
    setShowDeleteModal(true);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedGroup(null);
  };

  const handleSaveGroup = (savedGroup: UserGroup) => {
    if (selectedGroup) {
      // Edit
      setGroups(groups.map(g => g.id === savedGroup.id ? savedGroup : g));
    } else {
      // Create
      setGroups([...groups, savedGroup]);
    }
    handleCloseModals();
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter(g => g.id !== groupId));
    handleCloseModals();
  };

  return (
    <>
      <Container fluid className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Grupos de Usuarios</h1>
          <Button variant="primary" onClick={handleShowCreateModal}>
            <FaPlus className="me-2" />
            Crear Nuevo Grupo
          </Button>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nombre del Grupo</th>
              <th>Descripción</th>
              <th>Nº de Miembros</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td>{group.name}</td>
                <td>{group.description}</td>
                <td>{group.members.length}</td>
                <td className="text-center">
                  <ButtonGroup size="sm">
                    <Button variant="outline-primary" onClick={() => handleShowEditModal(group)}>
                      <FaEdit />
                    </Button>
                    <Button variant="outline-danger" onClick={() => handleShowDeleteModal(group)}>
                      <FaTrash />
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <GroupCreateEditModal 
        show={showEditModal}
        onHide={handleCloseModals}
        onSave={handleSaveGroup}
        groupToEdit={selectedGroup}
      />

      <GroupDeleteModal
        show={showDeleteModal}
        onHide={handleCloseModals}
        onConfirm={handleDeleteGroup}
        groupToDelete={selectedGroup}
      />
    </>
  );
};

export default UserGroupsPage;
