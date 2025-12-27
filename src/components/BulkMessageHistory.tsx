
import React from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import type { BulkMessageHistoryEntry } from '../data/mockBulkMessageHistory';
import './BulkMessageHistory.css';
import { FaEye } from 'react-icons/fa';

interface BulkMessageHistoryProps {
  history: BulkMessageHistoryEntry[];
  onShowDetails: (entry: BulkMessageHistoryEntry) => void;
}

const BulkMessageHistory: React.FC<BulkMessageHistoryProps> = ({ history, onShowDetails }) => {

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('es-CL', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  };

  return (
    <Table striped bordered hover responsive size="sm">
      <thead>
        <tr>
          <th>Fecha y Hora</th>
          <th>Grupo</th>
          <th>Mensaje</th>
          <th>Adjuntos</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map(entry => (
          <tr key={entry.id}>
            <td>{formatTimestamp(entry.timestamp)}</td>
            <td>{entry.groupName}</td>
            <td className="message-cell">{entry.message}</td>
            <td>{entry.attachmentCount}</td>
            <td>
              <Badge bg={entry.status === 'Sent' ? 'success' : 'danger'}>
                {entry.status}
              </Badge>
            </td>
            <td>
                <Button variant="outline-info" size="sm" onClick={() => onShowDetails(entry)}>
                    <FaEye />
                </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default BulkMessageHistory;
