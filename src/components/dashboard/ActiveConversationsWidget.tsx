
import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert } from 'react-bootstrap';
import { FaComments } from 'react-icons/fa';
import { supabase } from '../../supabaseClient';

const ActiveConversationsWidget: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveConversations = async () => {
      setLoading(true);
      setError(null);

      const { count, error } = await supabase
        .from('conversaciones')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'activa');

      if (error) {
        console.error('Error fetching active conversations:', error);
        setError('No se pudo cargar el dato.');
        setCount(0);
      } else {
        setCount(count || 0);
      }
      setLoading(false);
    };

    fetchActiveConversations();

    // Set up a real-time subscription to update the count
    const subscription = supabase.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversaciones' },
        (payload) => {
          // Refetch the count when a change occurs
          fetchActiveConversations();
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const renderContent = () => {
    if (loading) {
      return <Spinner animation="border" />;
    }
    if (error) {
      return <Alert variant="danger" className="p-2 m-0">{error}</Alert>;
    }
    return (
      <Card.Text className="fs-2 fw-bold">
        {count}
      </Card.Text>
    );
  };

  return (
    <Card className="h-100">
      <Card.Body className="d-flex flex-column justify-content-center align-items-center">
        <div className="mb-3">
          <FaComments size={40} className="text-primary" />
        </div>
        <Card.Title as="h4">Conversaciones Activas</Card.Title>
        {renderContent()}
      </Card.Body>
    </Card>
  );
};

export default ActiveConversationsWidget;
