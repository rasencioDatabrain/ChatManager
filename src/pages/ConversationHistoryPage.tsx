
import React, { useState } from 'react';
import { Container, Form, Row, Col, Button, Card, Table, Collapse } from 'react-bootstrap';
import { mockConversations } from '../data/mockConversations';
import type { Conversation } from '../data/mockConversations';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const ConversationHistoryPage: React.FC = () => {
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>(mockConversations);
  const [filterName, setFilterName] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [openConversationId, setOpenConversationId] = useState<string | null>(null);

  const handleFilter = () => {
    let filtered = mockConversations;

    if (filterName) {
      filtered = filtered.filter(c => c.customerName.toLowerCase().includes(filterName.toLowerCase()));
    }
    if (filterPhone) {
      filtered = filtered.filter(c => c.customerPhone.includes(filterPhone));
    }
    if (filterStartDate) {
        const start = new Date(filterStartDate);
        filtered = filtered.filter(c => new Date(c.timestamp) >= start);
    }
    if (filterEndDate) {
        const end = new Date(filterEndDate);
        // Set time to end of day for inclusive filtering
        end.setHours(23, 59, 59, 999); 
        filtered = filtered.filter(c => new Date(c.timestamp) <= end);
    }

    setFilteredConversations(filtered);
  };

  const handleClearFilters = () => {
    setFilterName('');
    setFilterPhone('');
    setFilterStartDate('');
    setFilterEndDate('');
    setFilteredConversations(mockConversations);
  }

  const toggleConversation = (id: string) => {
    setOpenConversationId(openConversationId === id ? null : id);
  };

  return (
    <Container fluid className="p-4">
      <h1>Historial de Conversaciones</h1>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Filtros de Búsqueda</Card.Title>
          <Form>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Nombre de Cliente</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Buscar por nombre..." 
                    value={filterName}
                    onChange={e => setFilterName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Número de Teléfono</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Buscar por teléfono..."
                    value={filterPhone}
                    onChange={e => setFilterPhone(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Fecha Inicio</Form.Label>
                  <Form.Control 
                    type="date"
                    value={filterStartDate}
                    onChange={e => setFilterStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Fecha Fin</Form.Label>
                  <Form.Control 
                    type="date"
                    value={filterEndDate}
                    onChange={e => setFilterEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button variant="primary" onClick={handleFilter} className="me-2">Buscar</Button>
                <Button variant="secondary" onClick={handleClearFilters}>Limpiar</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Table hover>
        <thead>
          <tr>
            <th></th>
            <th>Cliente</th>
            <th>Teléfono</th>
            <th>Último Mensaje</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {filteredConversations.map(conv => (
            <React.Fragment key={conv.id}>
              <tr onClick={() => toggleConversation(conv.id)} style={{ cursor: 'pointer' }}>
                <td>
                  {openConversationId === conv.id ? <FaChevronDown /> : <FaChevronRight />}
                </td>
                <td>{conv.customerName}</td>
                <td>{conv.customerPhone}</td>
                <td>{conv.lastMessage}</td>
                <td>{new Date(conv.timestamp).toLocaleString()}</td>
              </tr>
              <Collapse in={openConversationId === conv.id}>
                <tr>
                  <td colSpan={5}>
                    <Card className="m-2">
                      <Card.Body>
                        {conv.messages.map(msg => (
                          <div key={msg.id} className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2`}>
                            <div className={`message-bubble ${msg.sender === 'user' ? 'user' : 'agent'}`}>
                              <div className="message-content">{msg.content}</div>
                              <div className="message-timestamp">{new Date(msg.timestamp).toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </td>
                </tr>
              </Collapse>
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ConversationHistoryPage;
