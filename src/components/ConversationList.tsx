
import React, { useState, useEffect } from 'react';
import { ListGroup, Badge, ButtonGroup, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import type { AppConversation } from '../types';
import './ConversationList.css';

interface ConversationListProps {
  onSelectConversation: (conversation: AppConversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ onSelectConversation }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed'>('active');
  const [modeFilter, setModeFilter] = useState<'all' | 'manual' | 'automatico'>('manual');
  const [conversations, setConversations] = useState<AppConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      setError(null);

      const statusMap: { [key: string]: 'active' | 'closed' | 'manual' | 'automatico' } = {
        'activa': 'active',
        'cerrada': 'closed',
        'manual': 'manual',
        'automatico': 'automatico',
      };

      const { data, error } = await supabase
        .from('conversaciones')
        .select('*')
        .order('ultimo_mensaje_timestamp', { ascending: false, nulls: 'last' });

      if (error) {
        console.error('Error fetching conversations:', error);
        setError('No se pudieron cargar las conversaciones.');
      } else if (data) {
        const mappedData: AppConversation[] = data.map(c => ({
          id: c.id,
          customerName: c.paciente_id,
          customerPhone: '',
          lastMessage: c.ultimo_mensaje_contenido || 'Conversación iniciada',
          timestamp: c.ultimo_mensaje_timestamp 
            ? new Date(c.ultimo_mensaje_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : new Date(c.fecha_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: statusMap[c.estado] || 'active', // Default to active if status is unknown
          agent: c.agente_id,
        }));
        setConversations(mappedData);
      }
      setLoading(false);
    };

    setLoading(true);
    fetchConversations();

    const intervalId = setInterval(fetchConversations, 15000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Reset mode filter when status filter changes from 'active'
  useEffect(() => {
    if (filterStatus !== 'active') {
      setModeFilter('all');
    }
  }, [filterStatus]);

  const filteredConversations = conversations
    .filter(conv => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'active') {
        return conv.status === 'active' || conv.status === 'manual' || conv.status === 'automatico';
      }
      return conv.status === filterStatus;
    })
    .filter(conv => {
      if (filterStatus !== 'active' || modeFilter === 'all') {
        return true;
      }
      return conv.status === modeFilter;
    });

  return (
    <div className="conversation-list-container">
      <div className="list-header">
        <h4 className="mb-3">Conversaciones</h4>

        <Form.Group className="mb-3">
          <Form.Label>Filtrar por Estado</Form.Label>
          <ButtonGroup className="w-100 filter-buttons">
            <Button variant={filterStatus === 'active' ? 'primary' : 'outline-primary'} onClick={() => setFilterStatus('active')}>Activos</Button>
            <Button variant={filterStatus === 'closed' ? 'primary' : 'outline-primary'} onClick={() => setFilterStatus('closed')}>Cerrados</Button>
            <Button variant={filterStatus === 'all' ? 'primary' : 'outline-primary'} onClick={() => setFilterStatus('all')}>Todos</Button>
          </ButtonGroup>
        </Form.Group>

        {filterStatus === 'active' && (
          <Form.Group>
            <Form.Label>Filtrar por Modo</Form.Label>
            <ButtonGroup className="w-100 filter-buttons">
              <Button variant={modeFilter === 'manual' ? 'info' : 'outline-info'} onClick={() => setModeFilter('manual')}>Manual</Button>
              <Button variant={modeFilter === 'automatico' ? 'info' : 'outline-info'} onClick={() => setModeFilter('automatico')}>Automático</Button>
              <Button variant={modeFilter === 'all' ? 'info' : 'outline-info'} onClick={() => setModeFilter('all')}>Todos</Button>
            </ButtonGroup>
          </Form.Group>
        )}
      </div>

      {loading && <div className="text-center p-4"><Spinner animation="border" /></div>}
      
      {error && <Alert variant="danger" className="m-3">{error}</Alert>}

      {!loading && !error && (
        <ListGroup variant="flush" className="conversation-list">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <ListGroup.Item
                key={conv.id}
                action
                onClick={() => onSelectConversation(conv)}
                className="conversation-item"
              >
                <div className="d-flex w-100 justify-content-between">
                  <h6 className="mb-1 customer-name">{conv.customerName}</h6>
                  <small className="timestamp">{conv.timestamp}</small>
                </div>
                <p className="mb-1 last-message">{conv.lastMessage}</p>
                <Badge
                  pill
                  bg={conv.status === 'closed' ? 'secondary' : 'success'}
                >
                  {conv.status}
                </Badge>
              </ListGroup.Item>
            ))
          ) : (
            <div className="text-center p-4 text-muted">No hay conversaciones que coincidan con el filtro.</div>
          )}
        </ListGroup>
      )}
    </div>
  );
};

export default ConversationList;
