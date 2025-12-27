
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import type { MessageTemplate } from '../data/mockMessageTemplates';

interface MessageTemplateEditModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (template: MessageTemplate) => void;
  template: MessageTemplate | null;
}

const MessageTemplateEditModal: React.FC<MessageTemplateEditModalProps> = ({ show, onHide, onSave, template }) => {
  const [formData, setFormData] = useState<Partial<MessageTemplate>>({});
  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    if (template) {
      setFormData(template);
      setPreviewHtml(template.htmlContent);
    } else {
      setFormData({});
      setPreviewHtml('');
    }
  }, [template]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'htmlContent') {
      setPreviewHtml(value);
    }
  };

  const handleSave = () => {
    onSave(formData as MessageTemplate);
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{template ? 'Editar Plantilla de Mensaje' : 'Agregar Plantilla de Mensaje'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre de la Plantilla</Form.Label>
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
                <Form.Label>Asunto</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={formData.subject || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Contenido HTML</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              name="htmlContent"
              value={formData.htmlContent || ''}
              onChange={handleInputChange}
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Vista Previa</Form.Label>
            <div style={{ border: '1px solid #dee2e6', padding: '10px', minHeight: '150px', backgroundColor: '#f8f9fa' }}>
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
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

export default MessageTemplateEditModal;
