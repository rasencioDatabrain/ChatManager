
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, ButtonGroup, Spinner, Alert } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import { FaPlus, FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
import GroupCreateEditModal from '../components/GroupCreateEditModal';
import GroupDeleteModal from '../components/GroupDeleteModal';

// --- Type Definitions ---
export interface Grupo {
  id: number;
  nombre: string;
  descripcion: string | null;
  tipo: 'manual' | 'automatico';
  estado: 'activo' | 'inactivo';
  created_at: string;
  grupo_cliente_miembros: { count: number }[];
}

export interface Cliente {
  id: string; // UUID
  telefono: string;
  nombre_real?: string | null;
}

const UserGroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<Grupo[]>([]);
  const [allClients, setAllClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Grupo | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch groups and their member counts in one go
      const { data: groupsData, error: groupsError } = await supabase
        .from('grupos_clientes')
        .select('*, grupo_cliente_miembros(count)')
        .eq('tipo', 'manual');

      if (groupsError) throw groupsError;
      setGroups(groupsData as any);

      // Fetch all clients to pass to the modal
      const { data: clientsData, error: clientsError } = await supabase
        .from('clientes')
        .select('id, nombre_real, telefono');
      
      if (clientsError) throw clientsError;
      setAllClients(clientsData);

    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('No se pudieron cargar los datos. Verifique las RLS y las relaciones de las tablas de grupos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Note: Real-time subscription would be more complex here due to the member count join.
    // A manual refresh after actions is more reliable for now.
  }, []);

  const handleShowCreateModal = () => {
    setSelectedGroup(null);
    setShowEditModal(true);
  };

  const handleShowEditModal = (group: Grupo) => {
    setSelectedGroup(group);
    setShowEditModal(true);
  };

  const handleShowDeleteModal = (group: Grupo) => {
    setSelectedGroup(group);
    setShowDeleteModal(true);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedGroup(null);
  };

  const handleSaveGroup = async (groupData: Partial<Grupo>, members: Cliente[]) => {
    try {
      let groupId = groupData.id;

      // Step 1: Save group details (Insert or Update)
      if (groupId) { // Edit existing group
        const { error } = await supabase
          .from('grupos_clientes')
          .update({ nombre: groupData.nombre, descripcion: groupData.descripcion, estado: groupData.estado })
          .eq('id', groupId);
        if (error) throw error;
      } else { // Create new group
        const { data, error } = await supabase
          .from('grupos_clientes')
          .insert({ nombre: groupData.nombre, descripcion: groupData.descripcion, tipo: 'manual', estado: 'activo' })
          .select('id')
          .single();
        if (error) throw error;
        groupId = data.id;
      }

      if (!groupId) {
        throw new Error("No se pudo obtener el ID del grupo.");
      }

      // Step 2: Manage Members (The "transaction")
      // Get current members from DB
      const { data: currentMembersInDb, error: fetchError } = await supabase
        .from('grupo_cliente_miembros')
        .select('cliente_id')
        .eq('grupo_id', groupId);
      if (fetchError) throw fetchError;

      const currentMemberIds = new Set(currentMembersInDb.map(m => m.cliente_id));
      const newMemberIds = new Set(members.map(m => m.id));

      // Find members to remove
      const membersToRemove = [...currentMemberIds].filter(id => !newMemberIds.has(id));
      if (membersToRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from('grupo_cliente_miembros')
          .delete()
          .eq('grupo_id', groupId)
          .in('cliente_id', membersToRemove);
        if (deleteError) throw deleteError;
      }

      // Find members to add
      const membersToAdd = [...newMemberIds].filter(id => !currentMemberIds.has(id));
      if (membersToAdd.length > 0) {
        const newMemberRows = membersToAdd.map(cliente_id => ({ grupo_id: groupId, cliente_id }));
        const { error: insertError } = await supabase
          .from('grupo_cliente_miembros')
          .insert(newMemberRows);
        if (insertError) throw insertError;
      }

      handleCloseModals();
      fetchData(); // Refresh data
      
    } catch (err: any) {
      alert('Error al guardar el grupo: ' + err.message);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    try {
      const { error } = await supabase
        .from('grupos_clientes')
        .delete()
        .eq('id', groupId);
      if (error) throw error;
      handleCloseModals();
      fetchData(); // Refresh data
    } catch (err: any) {
      alert('Error al eliminar el grupo: ' + err.message);
    }
  };

  return (
    <>
      <Container fluid className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Grupos de Usuarios (Manuales)</h1>
          <Button variant="primary" onClick={handleShowCreateModal}>
            <FaPlus className="me-2" />
            Crear Nuevo Grupo
          </Button>
        </div>

        {loading && <div className="text-center"><Spinner /></div>}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nombre del Grupo</th>
                <th>Descripción</th>
                <th>Nº de Miembros</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id}>
                  <td>{group.nombre}</td>
                  <td>{group.descripcion}</td>
                  <td>{group.grupo_cliente_miembros[0]?.count || 0}</td>
                  <td className="text-center">
                    <ButtonGroup size="sm">
                      <Button variant="info" className="text-white"><FaUsers /></Button>
                      <Button variant="outline-primary" onClick={() => handleShowEditModal(group)}>
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" onClick={() => handleShowDeleteModal(group)}>
                        <FaTrash />
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>

      <GroupCreateEditModal 
        show={showEditModal}
        onHide={handleCloseModals}
        onSave={handleSaveGroup}
        groupToEdit={selectedGroup}
        allClients={allClients}
      />

      <GroupDeleteModal
        show={showDeleteModal}
        onHide={handleCloseModals}
        onConfirm={() => selectedGroup && handleDeleteGroup(selectedGroup.id)}
        groupToDelete={selectedGroup}
      />
    </>
  );
};

export default UserGroupsPage;
