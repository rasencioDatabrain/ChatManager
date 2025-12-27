
import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Alert } from 'react-bootstrap';
import UserList from '../components/UserList';
import UserEditModal from '../components/UserEditModal';
import UserDeleteModal from '../components/UserDeleteModal';
import { supabase } from '../supabaseClient';

// Define the User type based on the database schema
export interface Usuario {
  id: number;
  correo: string;
  clave?: string; // Make password optional as it's not always fetched
  nombre: string | null;
  estado: 'activo' | 'inactivo';
  rol: 'usuario' | 'admin' | 'supervisor';
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, correo, nombre, estado, rol')
      .order('nombre', { ascending: true });

    if (error) {
      console.error('Error fetching users:', error);
      setError('No se pudieron cargar los usuarios.');
    } else {
      setUsers(data as Usuario[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();

    const subscription = supabase.channel('custom-usuarios-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'usuarios' },
        (payload) => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowEditModal(true);
  };

  const handleEditUser = (user: Usuario) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user: Usuario) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleSaveUser = async (user: Partial<Usuario>) => {
    try {
      if (user.id) {
        // Edit user
        const { error } = await supabase
          .from('usuarios')
          .update({ 
            nombre: user.nombre, 
            correo: user.correo, 
            rol: user.rol, 
            estado: user.estado 
            // Not updating password on edit for now
          })
          .eq('id', user.id);
        if (error) throw error;
      } else {
        // Add new user
        if (!user.clave) throw new Error('La contraseña es obligatoria para nuevos usuarios.');
        const { error } = await supabase
          .from('usuarios')
          .insert({ 
            nombre: user.nombre, 
            correo: user.correo, 
            rol: user.rol, 
            estado: user.estado,
            clave: user.clave // Storing plain text password as per simple login implementation
          });
        if (error) throw error;
      }
      setShowEditModal(false);
      fetchUsers(); // Manually refresh the user list
    } catch (error: any) {
      alert(`Error al guardar el usuario: ${error.message}`);
    }
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        const { error } = await supabase
          .from('usuarios')
          .delete()
          .eq('id', selectedUser.id);
        if (error) throw error;
        setShowDeleteModal(false);
        fetchUsers(); // Manually refresh the user list
      } catch (error: any) {
        alert(`Error al eliminar el usuario: ${error.message}`);
      }
    }
  };

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Usuarios y Roles</h1>
        <Button variant="primary" onClick={handleAddUser}>
          Agregar Nuevo Usuario
        </Button>
      </div>
      
      {loading && <div className="text-center"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <UserList users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
      )}

      <UserEditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />

      <UserDeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onDelete={confirmDelete}
        user={selectedUser}
      />
    </Container>
  );
};

export default UserManagementPage;
