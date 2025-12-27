
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import type { UserGroup } from '../data/mockUserGroups';

interface GroupDeleteModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: (groupId: string) => void;
  groupToDelete?: UserGroup | null;
}

const GroupDeleteModal: React.FC<GroupDeleteModalProps> = ({ show, onHide, onConfirm, groupToDelete }) => {
  if (!groupToDelete) return null;

  const handleConfirm = () => {
    onConfirm(groupToDelete.id);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>¿Estás seguro de que deseas eliminar el grupo "<strong>{groupToDelete.name}</strong>"?</p>
        <p className="text-danger">Esta acción no se puede deshacer.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Eliminar Grupo
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GroupDeleteModal;
