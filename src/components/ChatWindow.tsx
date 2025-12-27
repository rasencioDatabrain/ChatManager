
import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Button, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import type { AppConversation } from './ConversationList';
import { FaPaperPlane } from 'react-icons/fa';
import './ChatWindow.css';

interface ChatWindowProps {
  conversation: AppConversation | null;
}

interface Message {
  id: string;
  conversacion_id: string;
  emisor: 'paciente' | 'agente';
  contenido: string;
  fecha_envio: string;
  tipo: 'texto' | 'imagen' | 'audio';
  estado?: string; // Added new optional field
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isClosed, setIsClosed] = useState(conversation?.estado === 'cerrada');
  const messageAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (conversation) {
      setIsClosed(conversation.estado === 'cerrada');
    }

    if (!conversation) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('mensajes')
        .select('*')
        .eq('conversacion_id', conversation.id)
        .order('fecha_envio', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        setError('No se pudieron cargar los mensajes.');
      } else {
        setMessages(data as Message[]);
      }
      setLoading(false);
    };

    setLoading(true);
    setMessages([]);
    fetchMessages(); // Initial fetch

    const intervalId = setInterval(fetchMessages, 15000); // Poll every 15 seconds

    return () => {
      clearInterval(intervalId); // Cleanup on unmount or conversation change
    };
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !conversation) return;

    const messageToSend = {
      conversacion_id: conversation.id,
      contenido: newMessage,
      emisor: 'agente' as const,
      tipo: 'texto' as const,
      estado: 'PENDIENTE', // CORRECT: Set estado on the message itself
    };

    // Optimistically update UI
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      ...messageToSend,
      id: tempId,
      fecha_envio: new Date().toISOString(),
    };
    setMessages(currentMessages => [...currentMessages, optimisticMessage]);
    setNewMessage('');

    const { error } = await supabase.from('mensajes').insert(messageToSend);

    if (error) {
      console.error('Error sending message:', error);
      setError('No se pudo enviar el mensaje.');
      // Revert optimistic update
      setMessages(currentMessages => currentMessages.filter(m => m.id !== tempId));
    }
  };

  const handleCloseConversation = async () => {
    if (!conversation) return;

    const confirmation = window.confirm('¿Estás seguro de que quieres cerrar esta conversación?');
    if (!confirmation) return;

    const { error } = await supabase
      .from('conversaciones')
      .update({ estado: 'cerrada', fecha_fin: new Date().toISOString() })
      .eq('id', conversation.id);

    if (error) {
      console.error('Error closing conversation:', error);
      alert('No se pudo cerrar la conversación.');
    } else {
      setIsClosed(true);
      alert('Conversación cerrada exitosamente.');
    }
  };

  if (!conversation) {
    return (
      <div className="chat-window-container d-flex justify-content-center align-items-center">
        <div className="text-center">
          <h5>Selecciona una conversación</h5>
          <p className="text-muted">Elige una conversación de la lista para ver los mensajes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window-container">
      <Card className="h-100">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">{conversation.customerName}</h5>
            <p className="mb-0 text-muted small">{conversation.customerPhone}</p>
          </div>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleCloseConversation}
            disabled={isClosed}
          >
            {isClosed ? 'Cerrada' : 'Cerrar'}
          </Button>
        </Card.Header>

        <Card.Body className="message-area" ref={messageAreaRef}>
          {loading && <div className="text-center p-4"><Spinner animation="border" /></div>}
          {error && <Alert variant="danger" className="m-3">{error}</Alert>}
          {!loading && messages.map((msg) => (
            <div
              key={msg.id}
              className={`d-flex ${msg.emisor === 'paciente' ? 'justify-content-end' : 'justify-content-start'} mb-2`}
            >
              <div className={`message-bubble ${msg.emisor === 'paciente' ? 'user' : 'agent'}`}>
                <div className="message-content">{msg.contenido}</div>
                <div className="message-timestamp">{new Date(msg.fecha_envio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          ))}
        </Card.Body>

        <Card.Footer className="message-input-area">
          <Form onSubmit={handleSendMessage}>
            <InputGroup>
              <Form.Control
                placeholder={isClosed ? "Esta conversación ha sido cerrada." : "Escribe un mensaje..."}
                aria-label="Escribe un mensaje"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={loading || isClosed}
              />
              <Button variant="primary" type="submit" disabled={!newMessage.trim() || isClosed}>
                <FaPaperPlane />
              </Button>
            </InputGroup>
          </Form>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ChatWindow;
