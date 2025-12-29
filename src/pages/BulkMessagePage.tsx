import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Image, Alert, Tabs, Tab, Spinner } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import BulkMessageHistory from '../components/BulkMessageHistory';
import BulkHistoryDetailsModal from '../components/BulkHistoryDetailsModal';
import { FaPaperPlane } from 'react-icons/fa';
import type { BulkMessageHistoryEntry } from '../data/mockBulkMessageHistory'; // Keep this for now for the history tab

// --- Type Definitions ---
interface Group {
  id: number;
  nombre: string;
  tipo: 'manual' | 'automatico';
}

const BulkMessagePage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  
  // History tab state (can be refactored later)
  const [history, setHistory] = useState<BulkMessageHistoryEntry[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<BulkMessageHistoryEntry | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoadingGroups(true);
      const { data, error } = await supabase
        .from('grupos_clientes')
        .select('id, nombre, tipo')
        .eq('estado', 'activo');

      if (data) {
        setGroups(data);
      } else {
        console.error('Error fetching groups:', error);
      }
      setLoadingGroups(false);
    };

    fetchGroups();
    // TODO: Fetch real history data
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
      const previews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSend = () => {
    if (selectedGroupId === 'all' || !message) {
      alert('Por favor, selecciona un grupo y escribe un mensaje.');
      return;
    }
    setSendStatus('sending');
    
    // This part is still a simulation
    const targetGroup = groups.find(g => g.id === parseInt(selectedGroupId));
    console.log(`Simulating sending message to group: ${targetGroup?.nombre}`);
    
    setTimeout(() => {
      // Add to history (simulation)
      const newHistoryEntry: BulkMessageHistoryEntry = {
        id: `hist-${Date.now()}`,
        groupName: targetGroup?.nombre || 'Grupo Desconocido',
        message: message,
        timestamp: new Date(),
        status: 'Sent',
        attachmentCount: images.length,
        members: [], // Member list not fetched in this version
      };
      setHistory(prevHistory => [newHistoryEntry, ...prevHistory]);

      setSendStatus('sent');
      
      setTimeout(() => {
        setSendStatus('idle');
        setMessage('');
        setImages([]);
        setImagePreviews([]);
        setSelectedGroupId('all');
      }, 3000);
    }, 2000);
  };

  const handleShowDetails = (entry: BulkMessageHistoryEntry) => {
    setSelectedHistoryEntry(entry);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedHistoryEntry(null);
  };

  return (
    <Container fluid className="p-4">
      <h1 className="mb-4">Mensajes Masivos</h1>
      <Tabs defaultActiveKey="compose" id="bulk-message-tabs" className="mb-3">
        <Tab eventKey="compose" title="Redactar Mensaje">
          <Card>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>1. Selecciona un Grupo de Destino</Form.Label>
                    {loadingGroups ? <Spinner size="sm" /> : (
                      <Form.Select value={selectedGroupId} onChange={e => setSelectedGroupId(e.target.value)}>
                        <option value="all" disabled>-- Elige un grupo --</option>
                        {groups.map(group => (
                          <option key={group.id} value={group.id}>
                            {group.nombre} ({group.tipo === 'manual' ? 'Manual' : 'Auto'})
                          </option>
                        ))}
                      </Form.Select>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>2. Escribe tu Mensaje</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={8} 
                      placeholder="Escribe aquí tu mensaje..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>3. Adjuntar Imágenes (Opcional)</Form.Label>
                    <Form.Control type="file" multiple accept="image/*" onChange={handleImageChange} />
                  </Form.Group>
                </Col>

                <Col md={6} className="border-start">
                    <h5 className="mb-3">Vista Previa de Imágenes</h5>
                    {imagePreviews.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                            {imagePreviews.map((preview, index) => (
                                <Image key={index} src={preview} thumbnail width={100} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">Aquí aparecerán las imágenes que selecciones.</p>
                    )}
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-end">
                {sendStatus === 'idle' && (
                    <Button variant="primary" onClick={handleSend} disabled={!message || selectedGroupId === 'all'}>
                        <FaPaperPlane className="me-2" />
                        Enviar Mensaje Masivo
                    </Button>
                )}
                {sendStatus === 'sending' && <Alert variant="info">Enviando...</Alert>}
                {sendStatus === 'sent' && <Alert variant="success">¡Mensaje enviado con éxito!</Alert>}
            </Card.Footer>
          </Card>
        </Tab>
        <Tab eventKey="history" title="Historial de Envíos">
            <BulkMessageHistory history={history} onShowDetails={handleShowDetails} />
        </Tab>
      </Tabs>

      <BulkHistoryDetailsModal
        show={showDetailsModal}
        onHide={handleCloseDetailsModal}
        entry={selectedHistoryEntry}
      />
    </Container>
  );
};

export default BulkMessagePage;
