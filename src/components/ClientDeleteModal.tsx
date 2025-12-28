
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import type { Cliente } from '../pages/ClientProfilePage';

interface ClientDeleteModalProps {
  show: boolean;
  onHide: () => void;
  onDelete: () => void;
  client: Cliente | null;
}

const ClientDeleteModal: React.FC<ClientDeleteModalProps> = ({ show, onHide, onDelete, client }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar al cliente "<strong>{client?.nombre_real || client?.telefono}</strong>"?
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

export default ClientDeleteModal;
