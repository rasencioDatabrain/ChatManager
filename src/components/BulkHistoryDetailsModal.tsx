
import React from 'react';
import { Modal, Button, Table, Badge } from 'react-bootstrap';
import type { BulkMessageHistoryEntry } from '../data/mockBulkMessageHistory';

interface BulkHistoryDetailsModalProps {
  show: boolean;
  onHide: () => void;
  entry?: BulkMessageHistoryEntry | null;
}

const BulkHistoryDetailsModal: React.FC<BulkHistoryDetailsModalProps> = ({ show, onHide, entry }) => {
  if (!entry) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalle de Envío Masivo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Resumen del Envío</h5>
        <p><strong>Grupo:</strong> {entry.groupName}</p>
        <p><strong>Fecha:</strong> {entry.timestamp.toLocaleString('es-CL')}</p>
        <p><strong>Mensaje:</strong></p>
        <blockquote className="blockquote">
          <p>{entry.message}</p>
        </blockquote>
        <p><strong>Adjuntos:</strong> <Badge bg="info">{entry.attachmentCount}</Badge></p>
        
        <hr />

        <h5>Destinatarios ({entry.members.length})</h5>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <Table striped bordered size="sm">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                    </tr>
                </thead>
                <tbody>
                    {entry.members.map(member => (
                        <tr key={member.id}>
                            <td>{member.name}</td>
                            <td>{member.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BulkHistoryDetailsModal;
