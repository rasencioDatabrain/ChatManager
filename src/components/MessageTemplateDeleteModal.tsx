
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import type { MessageTemplate } from '../data/mockMessageTemplates';

interface MessageTemplateDeleteModalProps {
  show: boolean;
  onHide: () => void;
  onDelete: () => void;
  template: MessageTemplate | null;
}

const MessageTemplateDeleteModal: React.FC<MessageTemplateDeleteModalProps> = ({ show, onHide, onDelete, template }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Plantilla de Mensaje</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar la plantilla "<strong>{template?.name}</strong>"?
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

export default MessageTemplateDeleteModal;
