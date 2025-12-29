
import React from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';

const automaticGroupTemplates = [
  {
    id: 'auto-group-1',
    title: 'Clientes Frecuentes',
    description: 'Agrupa automáticamente a clientes que contactan más de 5 veces por semana.',
    category: 'Frecuencia',
  },
  {
    id: 'auto-group-4',
    title: 'Clientes de Chile',
    description: 'Agrupa a todos los números que comienzan con el prefijo +56.',
    category: 'Ubicación',
  },
];

const AutomaticGroupsPage: React.FC = () => {
  return (
    <Container fluid className="p-4">
      <div className="mb-4">
        <h1>Grupos Automáticos</h1>
        <p className="text-muted">
          Activa las plantillas para crear y mantener grupos de usuarios de forma automática basados en reglas.
        </p>
      </div>

      <Row>
        {automaticGroupTemplates.map(template => (
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
                    label={'Desactivado'}
                    checked={false}
                    disabled
                    onChange={() => {}} // Prevent console warnings on disabled controlled components
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
