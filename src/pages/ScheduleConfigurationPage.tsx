
import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import ScheduleList from '../components/ScheduleList';
import ScheduleEditModal from '../components/ScheduleEditModal';
import ScheduleDeleteModal from '../components/ScheduleDeleteModal';
import { mockSchedules } from '../data/mockSchedules';
import type { Schedule } from '../data/mockSchedules';

const ScheduleConfigurationPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAddSchedule = () => {
    setSelectedSchedule(null);
    setShowEditModal(true);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setShowEditModal(true);
  };

  const handleDeleteSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setShowDeleteModal(true);
  };

  const handleSaveSchedule = (schedule: Schedule) => {
    if (schedule.id) {
      // Edit
      setSchedules(schedules.map((s) => (s.id === schedule.id ? schedule : s)));
    } else {
      // Add
      const newSchedule = { ...schedule, id: Math.max(...schedules.map(s => s.id)) + 1 };
      setSchedules([...schedules, newSchedule]);
    }
    setShowEditModal(false);
  };

  const confirmDelete = () => {
    if (selectedSchedule) {
      setSchedules(schedules.filter((s) => s.id !== selectedSchedule.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Configuración de Horarios</h1>
        <Button variant="primary" onClick={handleAddSchedule}>
          Agregar Nuevo Horario
        </Button>
      </div>
      
      <ScheduleList schedules={schedules} onEdit={handleEditSchedule} onDelete={handleDeleteSchedule} />

      <ScheduleEditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSave={handleSaveSchedule}
        schedule={selectedSchedule}
      />

      <ScheduleDeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onDelete={confirmDelete}
        schedule={selectedSchedule}
      />
    </Container>
  );
};

export default ScheduleConfigurationPage;
