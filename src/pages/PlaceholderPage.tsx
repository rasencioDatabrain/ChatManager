import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { FaTools } from 'react-icons/fa';

const PlaceholderPage: React.FC<{ title?: string }> = ({ title = "Página" }) => {
  return (
    <Container fluid className="p-4 d-flex align-items-center justify-content-center" style={{ height: '100%' }}>
      <Card className="text-center" style={{ width: '30rem' }}>
        <Card.Body className="p-5">
          <FaTools size={50} className="mb-4 text-warning" />
          <Card.Title as="h2">¡En Construcción!</Card.Title>
          <Card.Text className="text-muted">
            Esta sección está siendo desarrollada y estará disponible próximamente.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PlaceholderPage;
