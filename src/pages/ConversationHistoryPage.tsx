
import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Button, Card, Table, Collapse, Spinner, Alert, Badge } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

// --- Type Definitions ---
interface ClienteInfo {
  id: string;
  nombre_real: string | null;
  telefono: string;
  rut: string | null;
}

interface ConversationWithClient {
  id: string; // from conversaciones
  paciente_id: string;
  estado: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  ultimo_mensaje_contenido: string | null;
  cliente: ClienteInfo | null; // Joined data
}

interface Message {
  id: string;
  contenido: string;
  emisor: 'paciente' | 'agente';
  fecha_envio: string;
}

const ConversationHistoryPage: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationWithClient[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [filterName, setFilterName] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const [openConversationId, setOpenConversationId] = useState<string | null>(null);

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);

    // 1. Fetch conversations with date filters
    let convQuery = supabase
      .from('conversaciones')
      .select('*')
      .order('fecha_inicio', { ascending: false });

    if (filterStartDate) convQuery = convQuery.gte('fecha_inicio', filterStartDate);
    if (filterEndDate) {
      const end = new Date(filterEndDate);
      end.setHours(23, 59, 59, 999);
      convQuery = convQuery.lte('fecha_inicio', end.toISOString());
    }
    
    const { data: convData, error: convError } = await convQuery;

    if (convError) {
      console.error('Error fetching conversations:', convError);
      setError('No se pudieron cargar las conversaciones.');
      setLoading(false);
      return;
    }

    const pacienteIds = [...new Set(convData.map(c => c.paciente_id))];
    if (pacienteIds.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
    }

    // 2. Fetch corresponding clients with text filters
    let clientQuery = supabase
      .from('clientes')
      .select('id, nombre_real, telefono, rut')
      .in('telefono', pacienteIds);

    if (filterName) clientQuery = clientQuery.ilike('nombre_real', `%${filterName}%`);
    if (filterPhone) clientQuery = clientQuery.like('telefono', `%${filterPhone}%`);

    const { data: clientData, error: clientError } = await clientQuery;

    if (clientError) {
      console.error('Error fetching clients:', clientError);
      setError('No se pudieron cargar los datos de los clientes. Verifique RLS en la tabla \'clientes\'.');
      setLoading(false);
      return;
    }

    // 3. Join data in JS
    const clientsMap = new Map(clientData.map(cli => [cli.telefono, cli]));
    const joinedData = convData
      .map(conv => ({
        ...conv,
        cliente: clientsMap.get(conv.paciente_id) || null,
      }))
      .filter(conv => conv.cliente); // Only show conversations that have a matching client after filters

    setConversations(joinedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleFilter = () => {
    if (!filterName && !filterPhone && !filterStartDate && !filterEndDate) {
      alert('Por favor, ingrese al menos un criterio de búsqueda.');
      return;
    }
    fetchConversations();
  };

  const handleClearFilters = () => {
    setFilterName('');
    setFilterPhone('');
    setFilterStartDate('');
    setFilterEndDate('');
    setTimeout(fetchConversations, 0);
  };

  const toggleConversation = async (id: string) => {
    const newOpenId = openConversationId === id ? null : id;
    setOpenConversationId(newOpenId);

    if (newOpenId && !messages[newOpenId]) {
      setLoadingMessages(true);
      const { data, error } = await supabase
        .from('mensajes')
        .select('id, contenido, emisor, fecha_envio')
        .eq('conversacion_id', newOpenId)
        .order('fecha_envio', { ascending: true });
      
      if (data) {
        setMessages(prev => ({ ...prev, [newOpenId]: data as Message[] }));
      }
      setLoadingMessages(false);
    }
  };

  return (
    <Container fluid className="p-4 d-flex flex-column" style={{ height: 'calc(100vh - 2rem)' }}>
      <div>
        <h1>Historial de Conversaciones</h1>
        
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Filtros de Búsqueda</Card.Title>
            <Form>
              <Row>
                <Col md={3}><Form.Control type="text" placeholder="Nombre Cliente..." value={filterName} onChange={e => setFilterName(e.target.value)} /></Col>
                <Col md={3}><Form.Control type="text" placeholder="Teléfono..." value={filterPhone} onChange={e => setFilterPhone(e.target.value)} /></Col>
                <Col md={2}><Form.Control type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} /></Col>
                <Col md={2}><Form.Control type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} /></Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button variant="primary" onClick={handleFilter} className="me-2">Buscar</Button>
                  <Button variant="secondary" onClick={handleClearFilters}>Limpiar</Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </div>

      {loading && <div className="text-center flex-grow-1 d-flex align-items-center justify-content-center"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      
      {!loading && !error && (
        <div className="flex-grow-1" style={{ overflowY: 'auto' }}>
          <Table hover>
            <thead>
              <tr>
                <th></th>
                <th>Nombre Cliente</th>
                <th>RUT</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Último Mensaje</th>
                <th>Fecha Inicio</th>
              </tr>
            </thead>
            <tbody>
              {conversations.map(conv => (
                <React.Fragment key={conv.id}>
                  <tr onClick={() => toggleConversation(conv.id)} style={{ cursor: 'pointer' }}>
                    <td>{openConversationId === conv.id ? <FaChevronDown /> : <FaChevronRight />}</td>
                    <td>{conv.cliente?.nombre_real || 'N/A'}</td>
                    <td>{conv.cliente?.rut || 'N/A'}</td>
                    <td>{conv.cliente?.telefono}</td>
                    <td><Badge bg={conv.estado === 'cerrada' ? 'secondary' : 'success'}>{conv.estado}</Badge></td>
                    <td>{conv.ultimo_mensaje_contenido}</td>
                    <td>{new Date(conv.fecha_inicio).toLocaleString()}</td>
                  </tr>
                  <Collapse in={openConversationId === conv.id}>
                    <tr>
                      <td colSpan={7}>
                        <Card className="m-2">
                          <Card.Body>
                            {loadingMessages && <div className="text-center"><Spinner size="sm" /></div>}
                            {messages[conv.id] && messages[conv.id].map(msg => (
                              <div key={msg.id} className={`d-flex ${msg.emisor === 'paciente' ? 'justify-content-end' : 'justify-content-start'} mb-2`}>
                                <div className={`message-bubble ${msg.emisor === 'paciente' ? 'user' : 'agent'}`}>
                                  <div className="message-content">{msg.contenido}</div>
                                  <div className="message-timestamp">{new Date(msg.fecha_envio).toLocaleString()}</div>
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
        </div>
      )}
    </Container>
  );
};

export default ConversationHistoryPage;
