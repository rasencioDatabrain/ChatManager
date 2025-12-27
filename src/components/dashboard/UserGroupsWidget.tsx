
import React, { useState, useEffect } from 'react';
import { Card, Table, Spinner, Alert } from 'react-bootstrap';
import { FaUsers } from 'react-icons/fa';
import { supabase } from '../../supabaseClient';

const UserGroupsWidget: React.FC = () => {
  const [uniqueUsers, setUniqueUsers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUniqueUsers = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('conversaciones')
      .select('paciente_id');

    if (error) {
      console.error('Error fetching unique users:', error);
      setError('No se pudo cargar el dato.');
      setUniqueUsers(0);
    } else {
      const uniquePhones = new Set(data.map(c => c.paciente_id));
      setUniqueUsers(uniquePhones.size);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUniqueUsers();

    const subscription = supabase.channel('custom-conversaciones-channel-for-users')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversaciones' },
        (payload) => {
          fetchUniqueUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={2} className="text-center">
            <Spinner animation="border" size="sm" />
          </td>
        </tr>
      );
    }
    if (error) {
      return (
        <tr>
          <td colSpan={2}>
            <Alert variant="danger" className="p-2 m-0">{error}</Alert>
          </td>
        </tr>
      );
    }
    return (
      <tr>
        <td>Chat Clinica Pediatrica</td>
        <td className="fw-bold text-end">{uniqueUsers}</td>
      </tr>
    );
  };

  return (
    <Card className="h-100">
      <Card.Header className="d-flex align-items-center">
        <FaUsers className="me-2" />
        <h5 className="mb-0">Usuarios por Chat</h5>
      </Card.Header>
      <Card.Body>
        <Table hover size="sm">
          <thead>
            <tr>
              <th>Chat</th>
              <th className="text-end">Usuarios Únicos</th>
            </tr>
          </thead>
          <tbody>
            {renderContent()}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default UserGroupsWidget;
