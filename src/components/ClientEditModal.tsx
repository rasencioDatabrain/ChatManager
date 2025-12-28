
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import type { Cliente } from '../pages/ClientProfilePage';

interface ClientEditModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (client: Partial<Cliente>) => void;
  client: Cliente | null;
}

const ClientEditModal: React.FC<ClientEditModalProps> = ({ show, onHide, onSave, client }) => {
  const [formData, setFormData] = useState<Partial<Cliente>>({});

  useEffect(() => {
    if (client) {
      setFormData(client);
    } else {
      setFormData({ es_tutor: true });
    }
  }, [client, show]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{client ? 'Editar Cliente' : 'Agregar Cliente'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono (ID de WhatsApp)</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={formData.telefono || ''}
                  onChange={handleInputChange}
                  required
                  readOnly={!!client} // Prevent editing phone number for existing clients
                />
                {!!client && <Form.Text className="text-muted">El teléfono no se puede editar.</Form.Text>}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre de Perfil (WhatsApp)</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre_perfil_wsp"
                  value={formData.nombre_perfil_wsp || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre Real Completo</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre_real"
                  value={formData.nombre_real || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Alias (Cómo prefiere ser llamado)</Form.Label>
                <Form.Control
                  type="text"
                  name="alias"
                  value={formData.alias || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>RUT</Form.Label>
                <Form.Control
                  type="text"
                  name="rut"
                  value={formData.rut || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Notas</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notas"
              value={formData.notas || ''}
              onChange={handleInputChange as any} // To satisfy textarea change event
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check 
              type="checkbox"
              label="Es tutor/a (útil en pediatría)"
              name="es_tutor"
              checked={formData.es_tutor ?? true}
              onChange={handleInputChange}
            />
          </Form.Group>
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

export default ClientEditModal;
