
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { mockAutomaticGroupTemplates } from '../data/mockAutomaticGroups';
import type { AutomaticGroupTemplate } from '../data/mockAutomaticGroups';

const AutomaticGroupsPage: React.FC = () => {
  const [templates, setTemplates] = useState<AutomaticGroupTemplate[]>(mockAutomaticGroupTemplates);

  const handleToggle = (templateId: string) => {
    setTemplates(templates.map(t => 
      t.id === templateId ? { ...t, isActive: !t.isActive } : t
    ));
  };

  return (
    <Container fluid className="p-4">
      <div className="mb-4">
        <h1>Grupos Automáticos</h1>
        <p className="text-muted">
          Activa las plantillas para crear y mantener grupos de usuarios de forma automática basados en reglas.
        </p>
      </div>

      <Row>
        {templates.map(template => (
          <Col key={template.id} md={6} lg={4} className="mb-4">
            <Card className="h-100">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{template.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Categoría: {template.category}</Card.Subtitle>
                <Card.Text className="flex-grow-1">
                  {template.description}
                </Card.Text>
                <Form>
                  <Form.Check 
                    type="switch"
                    id={`switch-${template.id}`}
                    label={template.isActive ? 'Activado' : 'Desactivado'}
                    checked={template.isActive}
                    onChange={() => handleToggle(template.id)}
                  />
                </Form>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AutomaticGroupsPage;
