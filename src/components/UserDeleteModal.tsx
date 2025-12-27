
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import type { Usuario } from '../pages/UserManagementPage';

interface UserDeleteModalProps {
  show: boolean;
  onHide: () => void;
  onDelete: () => void;
  user: Usuario | null;
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({ show, onHide, onDelete, user }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar al usuario "<strong>{user?.nombre}</strong>"?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDeleteModal;
