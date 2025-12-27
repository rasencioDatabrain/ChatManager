
import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import ClientList from '../components/ClientList';
import ClientEditModal from '../components/ClientEditModal';
import ClientDeleteModal from '../components/ClientDeleteModal';
import { mockClients } from '../data/mockClients';
import type { ClientProfileData } from '../data/mockClients';

const ClientProfilePage: React.FC = () => {
  const [clients, setClients] = useState<ClientProfileData[]>(mockClients);
  const [selectedClient, setSelectedClient] = useState<ClientProfileData | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAddClient = () => {
    setSelectedClient(null);
    setShowEditModal(true);
  };

  const handleEditClient = (client: ClientProfileData) => {
    setSelectedClient(client);
    setShowEditModal(true);
  };

  const handleDeleteClient = (client: ClientProfileData) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  const handleSaveClient = (client: ClientProfileData) => {
    if (client.id) {
      // Edit
      setClients(clients.map((c) => (c.id === client.id ? client : c)));
    } else {
      // Add
      const newClient = { ...client, id: Math.max(...clients.map(c => c.id)) + 1 };
      setClients([...clients, newClient]);
    }
    setShowEditModal(false);
  };

  const confirmDelete = () => {
    if (selectedClient) {
      setClients(clients.filter((c) => c.id !== selectedClient.id));
      setShowDeleteModal(false);
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
      
      <ClientList clients={clients} onEdit={handleEditClient} onDelete={handleDeleteClient} />

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
