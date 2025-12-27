
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import type { ClientProfileData } from '../data/mockClients';

interface ClientEditModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (client: ClientProfileData) => void;
  client: ClientProfileData | null;
}

const ClientEditModal: React.FC<ClientEditModalProps> = ({ show, onHide, onSave, client }) => {
  const [formData, setFormData] = useState<Partial<ClientProfileData>>({});

  useEffect(() => {
    if (client) {
      setFormData(client);
    } else {
      setFormData({});
    }
  }, [client]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData as ClientProfileData);
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
                <Form.Label>Nombre / Razón Social</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Alias / Nombre corto</Form.Label>
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
                <Form.Label>RUT (si empresa)</Form.Label>
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
                <Form.Label>Teléfono principal (WhatsApp)</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Ciudad / Región / País</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Zona horaria</Form.Label>
            <Form.Control
              type="text"
              name="timezone"
              value={formData.timezone || ''}
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
