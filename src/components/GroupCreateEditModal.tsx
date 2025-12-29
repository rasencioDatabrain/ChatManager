import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, ListGroup, InputGroup, Spinner } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import type { Grupo, Cliente } from '../pages/UserGroupsPage';
import { FaTrash, FaPlus } from 'react-icons/fa';

interface GroupCreateEditModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (group: Partial<Grupo>, members: Cliente[]) => void;
  groupToEdit: Grupo | null;
  allClients: Cliente[];
}

const GroupCreateEditModal: React.FC<GroupCreateEditModalProps> = ({ show, onHide, onSave, groupToEdit, allClients }) => {
  const [groupData, setGroupData] = useState<Partial<Grupo>>({});
  const [members, setMembers] = useState<Cliente[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMembers = async (groupId: number) => {
      setLoadingMembers(true);
      const { data, error } = await supabase
        .from('grupo_cliente_miembros')
        .select('cliente_id')
        .eq('grupo_id', groupId);

      if (error) {
        console.error('Error fetching members:', error);
        setMembers([]);
      } else {
        const memberIds = new Set(data.map(m => m.cliente_id));
        const currentMembers = allClients.filter(client => memberIds.has(client.id));
        setMembers(currentMembers);
      }
      setLoadingMembers(false);
    };

    if (groupToEdit) {
      setGroupData(groupToEdit);
      fetchMembers(groupToEdit.id);
    } else {
      setGroupData({ nombre: '', descripcion: '', estado: 'activo' });
      setMembers([]);
    }
  }, [groupToEdit, show, allClients]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGroupData({ ...groupData, [name]: value });
  };

  const handleAddMember = (client: Cliente) => {
    if (!members.some(m => m.id === client.id)) {
      setMembers([...members, client]);
    }
  };

  const handleRemoveMember = (clientId: string) => {
    setMembers(members.filter(m => m.id !== clientId));
  };

  const handleSave = () => {
    if (!groupData.nombre) {
      alert('El nombre del grupo es obligatorio.');
      return;
    }
    onSave(groupData, members);
  };

  const availableClients = allClients
    .filter(client => !members.some(m => m.id === client.id))
    .filter(client => 
      (client.nombre_real && client.nombre_real.toLowerCase().includes(searchTerm.toLowerCase())) ||
      client.telefono.includes(searchTerm)
    );

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{groupToEdit ? 'Editar Grupo' : 'Crear Nuevo Grupo'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Grupo</Form.Label>
            <Form.Control type="text" name="nombre" value={groupData.nombre || ''} onChange={handleInputChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" name="descripcion" rows={2} value={groupData.descripcion || ''} onChange={handleInputChange} />
          </Form.Group>
          <hr />
          <h5>Miembros del Grupo ({members.length})</h5>
          <Row>
            <Col md={6}>
              <h6>Añadir Clientes</h6>
              <Form.Control 
                type="text" 
                placeholder="Buscar por nombre o teléfono..." 
                className="mb-2"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {availableClients.map(client => (
                  <ListGroup.Item key={client.id} action onClick={() => handleAddMember(client)}>
                    {client.nombre_real || 'Sin Nombre'} ({client.telefono})
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col md={6}>
              <h6>Miembros Actuales</h6>
              {loadingMembers ? <Spinner size="sm" /> : (
                <ListGroup style={{ maxHeight: '255px', overflowY: 'auto' }}>
                  {members.map(member => (
                    <ListGroup.Item key={member.id} className="d-flex justify-content-between align-items-center">
                      {member.nombre_real || 'Sin Nombre'} ({member.telefono})
                      <Button variant="link" className="text-danger" onClick={() => handleRemoveMember(member.id)}><FaTrash /></Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleSave}>Guardar Cambios</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GroupCreateEditModal;
