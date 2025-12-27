
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import type { Schedule, TimeRange } from '../data/mockSchedules';

interface ScheduleEditModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (schedule: Schedule) => void;
  schedule: Schedule | null;
}

const daysOfWeek: TimeRange['days'][number][] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const possibleActions: TimeRange['actions'][number][] = ['Responder automáticamente', 'Transferir a agente', 'Enviar notificación', 'Cerrar conversación'];

const ScheduleEditModal: React.FC<ScheduleEditModalProps> = ({ show, onHide, onSave, schedule }) => {
  const [formData, setFormData] = useState<Partial<Schedule>>({});

  useEffect(() => {
    if (schedule) {
      setFormData(schedule);
    } else {
      setFormData({
        name: '',
        description: '',
        timeRanges: [{ id: 1, startTime: '09:00', endTime: '18:00', days: [], actions: [] }],
      });
    }
  }, [schedule]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTimeRangeChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newTimeRanges = [...(formData.timeRanges || [])];
    newTimeRanges[index] = { ...newTimeRanges[index], [name]: value };
    setFormData({ ...formData, timeRanges: newTimeRanges });
  };

  const handleDayToggle = (rangeIndex: number, day: TimeRange['days'][number]) => {
    const newTimeRanges = [...(formData.timeRanges || [])];
    const currentDays = newTimeRanges[rangeIndex].days;
    if (currentDays.includes(day)) {
      newTimeRanges[rangeIndex].days = currentDays.filter((d) => d !== day);
    } else {
      newTimeRanges[rangeIndex].days = [...currentDays, day];
    }
    setFormData({ ...formData, timeRanges: newTimeRanges });
  };

  const handleActionToggle = (rangeIndex: number, action: TimeRange['actions'][number]) => {
    const newTimeRanges = [...(formData.timeRanges || [])];
    const currentActions = newTimeRanges[rangeIndex].actions;
    if (currentActions.includes(action)) {
      newTimeRanges[rangeIndex].actions = currentActions.filter((a) => a !== action);
    } else {
      newTimeRanges[rangeIndex].actions = [...currentActions, action];
    }
    setFormData({ ...formData, timeRanges: newTimeRanges });
  };

  const addTimeRange = () => {
    const newTimeRanges = [...(formData.timeRanges || [])];
    newTimeRanges.push({
      id: newTimeRanges.length > 0 ? Math.max(...newTimeRanges.map(tr => tr.id)) + 1 : 1,
      startTime: '09:00',
      endTime: '18:00',
      days: [],
      actions: [],
    });
    setFormData({ ...formData, timeRanges: newTimeRanges });
  };

  const removeTimeRange = (id: number) => {
    const newTimeRanges = (formData.timeRanges || []).filter((tr) => tr.id !== id);
    setFormData({ ...formData, timeRanges: newTimeRanges });
  };

  const handleSave = () => {
    onSave(formData as Schedule);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{schedule ? 'Editar Horario' : 'Agregar Horario'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Horario</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
            />
          </Form.Group>

          <h5 className="mt-4">Rangos de Horario</h5>
          {(formData.timeRanges || []).map((range, rangeIndex) => (
            <Card key={range.id} className="mb-3">
              <Card.Body>
                <Row className="align-items-end">
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Hora Inicio</Form.Label>
                      <Form.Control
                        type="time"
                        name="startTime"
                        value={range.startTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTimeRangeChange(rangeIndex, e)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Hora Fin</Form.Label>
                      <Form.Control
                        type="time"
                        name="endTime"
                        value={range.endTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTimeRangeChange(rangeIndex, e)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="text-end">
                    <Button variant="danger" size="sm" onClick={() => removeTimeRange(range.id)}>
                      <FaMinus /> Eliminar Rango
                    </Button>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Días de la Semana</Form.Label>
                  <div>
                    {daysOfWeek.map((day) => (
                      <Form.Check
                        inline
                        key={day}
                        label={day}
                        type="checkbox"
                        checked={range.days.includes(day)}
                        onChange={() => handleDayToggle(rangeIndex, day)}
                      />
                    ))}
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Acciones</Form.Label>
                  <div>
                    {possibleActions.map((action) => (
                      <Form.Check
                        inline
                        key={action}
                        label={action}
                        type="checkbox"
                        checked={range.actions.includes(action)}
                        onChange={() => handleActionToggle(rangeIndex, action)}
                      />
                    ))}
                  </div>
                </Form.Group>
              </Card.Body>
            </Card>
          ))}
          <Button variant="success" size="sm" onClick={addTimeRange}>
            <FaPlus /> Añadir Rango de Horario
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScheduleEditModal;
