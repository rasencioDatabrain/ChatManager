
import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { MessageTemplate } from '../data/mockMessageTemplates';

interface MessageTemplateListProps {
  templates: MessageTemplate[];
  onEdit: (template: MessageTemplate) => void;
  onDelete: (template: MessageTemplate) => void;
}

const MessageTemplateList: React.FC<MessageTemplateListProps> = ({ templates, onEdit, onDelete }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Asunto</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {templates.map((template) => (
          <tr key={template.id}>
            <td>{template.name}</td>
            <td>{template.subject}</td>
            <td>
              <Button variant="outline-primary" size="sm" onClick={() => onEdit(template)}>
                <FaEdit />
              </Button>{' '}
              <Button variant="outline-danger" size="sm" onClick={() => onDelete(template)}>
                <FaTrash />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default MessageTemplateList;
