import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, ListGroup, InputGroup, Dropdown, ButtonGroup } from 'react-bootstrap';
import type { UserGroup, GroupMember } from '../data/mockUserGroups';
import { mockConversations } from '../data/mockConversations';
import { FaTrash, FaPlus } from 'react-icons/fa';

// Prepare a list of unique contacts from conversations
const availableContacts = mockConversations.reduce((acc: GroupMember[], conv) => {
  if (!acc.some(c => c.phone === conv.customerPhone)) {
    acc.push({ id: conv.id, name: conv.customerName, phone: conv.customerPhone });
  }
  return acc;
}, []);

interface GroupCreateEditModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (group: UserGroup) => void;
  groupToEdit?: UserGroup | null;
}

const GroupCreateEditModal: React.FC<GroupCreateEditModalProps> = ({ show, onHide, onSave, groupToEdit }) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');

  useEffect(() => {
    if (groupToEdit) {
      setGroupName(groupToEdit.name);
      setDescription(groupToEdit.description);
      setMembers(groupToEdit.members || []);
    } else {
      setGroupName('');
      setDescription('');
      setMembers([]);
    }
  }, [groupToEdit, show]);

  const handleAddMemberManually = () => {
    if (newMemberName && newMemberPhone && !members.some(m => m.phone === newMemberPhone)) {
      const newMember: GroupMember = { 
        id: `user-${Date.now()}`,
        name: newMemberName, 
        phone: newMemberPhone 
      };
      setMembers([...members, newMember]);
      setNewMemberName('');
      setNewMemberPhone('');
    }
  };

  const handleAddFromContacts = (contact: GroupMember) => {
    if (!members.some(m => m.phone === contact.phone)) {
      setMembers([...members, contact]);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

  const handleSave = () => {
    if (!groupName) {
      alert('El nombre del grupo es obligatorio.');
      return;
    }
    const newGroup: UserGroup = {
      id: groupToEdit ? groupToEdit.id : `group-${Date.now()}`,
      name: groupName,
      description: description,
      creationDate: groupToEdit ? groupToEdit.creationDate : new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      members: members,
    };
    onSave(newGroup);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{groupToEdit ? 'Editar Grupo' : 'Crear Nuevo Grupo'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Grupo</Form.Label>
            <Form.Control type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Group>
          <hr />
          <h5>Miembros del Grupo ({members.length})</h5>
          <Row>
            <Col md={6}>
              <h6>Añadir manualmente</h6>
              <InputGroup className="mb-2">
                <Form.Control placeholder="Nombre" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} />
              </InputGroup>
              <InputGroup className="mb-2">
                <Form.Control placeholder="Teléfono (+569...)" value={newMemberPhone} onChange={e => setNewMemberPhone(e.target.value)} />
                <Button variant="outline-secondary" onClick={handleAddMemberManually}><FaPlus /></Button>
              </InputGroup>
            </Col>
            <Col md={6}>
              <h6>Añadir desde contactos</h6>
                <Dropdown as={ButtonGroup} className="d-block">
                    <Button variant="outline-primary" className="w-75">Seleccionar Contacto</Button>
                    <Dropdown.Toggle split variant="outline-primary" id="dropdown-split-basic" />
                    <Dropdown.Menu style={{maxHeight: '200px', overflowY: 'auto'}}>
                        {availableContacts.map(contact => (
                            <Dropdown.Item key={contact.id} onClick={() => handleAddFromContacts(contact)}>{contact.name} ({contact.phone})</Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
          </Row>
          <ListGroup className="mt-3" style={{maxHeight: '200px', overflowY: 'auto'}}>
            {members.map(member => (
              <ListGroup.Item key={member.id} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{member.name}</strong><br/>
                  <small className="text-muted">{member.phone}</small>
                </div>
                <Button variant="link" className="text-danger" onClick={() => handleRemoveMember(member.id)}><FaTrash /></Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {groupToEdit && (
            <div className="text-muted me-auto">
                <small>Creado: {groupToEdit.creationDate} | Actualizado: {groupToEdit.lastUpdated}</small>
            </div>
        )}
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleSave}>Guardar Cambios</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GroupCreateEditModal;