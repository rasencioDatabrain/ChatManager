
import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Schedule } from '../data/mockSchedules';

interface ScheduleListProps {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({ schedules, onEdit, onDelete }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Rangos de Horario</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {schedules.map((schedule) => (
          <tr key={schedule.id}>
            <td>{schedule.name}</td>
            <td>{schedule.description}</td>
            <td>
              <ul>
                {schedule.timeRanges.map((range) => (
                  <li key={range.id}>
                    {range.startTime} - {range.endTime} ({range.days.join(', ')})
                    <br />
                    Acciones: {range.actions.join(', ')}
                  </li>
                ))}
              </ul>
            </td>
            <td>
              <Button variant="outline-primary" size="sm" onClick={() => onEdit(schedule)}>
                <FaEdit />
              </Button>{' '}
              <Button variant="outline-danger" size="sm" onClick={() => onDelete(schedule)}>
                <FaTrash />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ScheduleList;
