
import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Alert } from 'react-bootstrap';
import ClientList from '../components/ClientList';
import ClientEditModal from '../components/ClientEditModal';
import ClientDeleteModal from '../components/ClientDeleteModal';
import { supabase } from '../supabaseClient';

// Define the Client type based on the database schema
export interface Cliente {
  id: string; // UUID
  telefono: string;
  nombre_perfil_wsp?: string | null;
  nombre_real?: string | null;
  alias?: string | null;
  rut?: string | null;
  email?: string | null;
  notas?: string | null;
  es_tutor?: boolean;
  created_at?: string;
  updated_at?: string;
}

const ClientProfilePage: React.FC = () => {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nombre_real', { ascending: true });

    if (error) {
      console.error('Error fetching clients:', error);
      setError('No se pudieron cargar los clientes.');
    } else {
      setClients(data as Cliente[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();

    const subscription = supabase.channel('custom-clientes-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clientes' },
        (payload) => {
          fetchClients();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleAddClient = () => {
    setSelectedClient(null);
    setShowEditModal(true);
  };

  const handleEditClient = (client: Cliente) => {
    setSelectedClient(client);
    setShowEditModal(true);
  };

  const handleDeleteClient = (client: Cliente) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  const handleSaveClient = async (client: Partial<Cliente>) => {
    try {
      const clientData = { ...client, updated_at: new Date().toISOString() };
      if (client.id) {
        // Edit client
        const { error } = await supabase
          .from('clientes')
          .update(clientData)
          .eq('id', client.id);
        if (error) throw error;
      } else {
        // Add new client
        const { error } = await supabase
          .from('clientes')
          .insert(clientData);
        if (error) throw error;
      }
      setShowEditModal(false);
      fetchClients(); // Manual refresh
    } catch (error: any) {
      alert(`Error al guardar el cliente: ${error.message}`);
    }
  };

  const confirmDelete = async () => {
    if (selectedClient) {
      try {
        const { error } = await supabase
          .from('clientes')
          .delete()
          .eq('id', selectedClient.id);
        if (error) throw error;
        setShowDeleteModal(false);
        fetchClients(); // Manual refresh
      } catch (error: any) {
        alert(`Error al eliminar el cliente: ${error.message}`);
      }
    }
  };

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mantenedor de Perfil de Cliente</h1>
        <Button variant="primary" onClick={handleAddClient}>
          Agregar Nuevo Cliente
        </Button>
      </div>
      
      {loading && <div className="text-center"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <ClientList clients={clients} onEdit={handleEditClient} onDelete={handleDeleteClient} />
      )}

      <ClientEditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onSave={handleSaveClient}
        client={selectedClient}
      />

      <ClientDeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onDelete={confirmDelete}
        client={selectedClient}
      />
    </Container>
  );
};

export default ClientProfilePage;
