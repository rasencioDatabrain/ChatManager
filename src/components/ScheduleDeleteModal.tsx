
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import type { Schedule } from '../data/mockSchedules';

interface ScheduleDeleteModalProps {
  show: boolean;
  onHide: () => void;
  onDelete: () => void;
  schedule: Schedule | null;
}

const ScheduleDeleteModal: React.FC<ScheduleDeleteModalProps> = ({ show, onHide, onDelete, schedule }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Horario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar el horario "<strong>{schedule?.name}</strong>"?
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

export default ScheduleDeleteModal;
