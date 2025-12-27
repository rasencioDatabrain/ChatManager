
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import type { Usuario } from '../pages/UserManagementPage';

interface UserEditModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (user: Partial<Usuario>) => void;
  user: Usuario | null;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ show, onHide, onSave, user }) => {
  const [formData, setFormData] = useState<Partial<Usuario>>({});

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      // Default values for new user
      setFormData({ rol: 'usuario', estado: 'activo' });
    }
  }, [user, show]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{user ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre || ''}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="correo"
              value={formData.correo || ''}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          {!user && (
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="clave"
                value={formData.clave || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              name="rol"
              value={formData.rol || 'usuario'}
              onChange={handleInputChange}
            >
              <option value="usuario">Usuario</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              name="estado"
              value={formData.estado || 'activo'}
              onChange={handleInputChange}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserEditModal;
