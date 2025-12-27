
import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import MessageTemplateList from '../components/MessageTemplateList';
import MessageTemplateEditModal from '../components/MessageTemplateEditModal';
import MessageTemplateDeleteModal from '../components/MessageTemplateDeleteModal';
import { mockMessageTemplates } from '../data/mockMessageTemplates';
import type { MessageTemplate } from '../data/mockMessageTemplates';

const MessageTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>(mockMessageTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAddTemplate = () => {
    setSelectedTemplate(null);
    setShowEditModal(true);
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setShowEditModal(true);
  };

  const handleDeleteTemplate = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setShowDeleteModal(true);
  };

  const handleSaveTemplate = (template: MessageTemplate) => {
    if (template.id) {
      // Edit
      setTemplates(templates.map((t) => (t.id === template.id ? template : t)));
    } else {
      // Add
      const newTemplate = { ...template, id: Math.max(...templates.map(t => t.id)) + 1 };
      setTemplates([...templates, newTemplate]);
    }
    setShowEditModal(false);
  };

  const confirmDelete = () => {
    if (selectedTemplate) {
      setTemplates(templates.filter((t) => t.id !== selectedTemplate.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mantenedor de Plantillas de Mensajes</h1>
        <Button variant="primary" onClick={handleAddTemplate}>
          Agregar Nueva Plantilla
        </Button>
      </div>
      
      <MessageTemplateList templates={templates} onEdit={handleEditTemplate} onDelete={handleDeleteTemplate} />

      <MessageTemplateEditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSave={handleSaveTemplate}
        template={selectedTemplate}
      />

      <MessageTemplateDeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onDelete={confirmDelete}
        template={selectedTemplate}
      />
    </Container>
  );
};

export default MessageTemplatesPage;
