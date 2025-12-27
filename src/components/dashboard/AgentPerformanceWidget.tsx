
import React, { useState, useEffect } from 'react';
import { Card, Table, Spinner, Alert } from 'react-bootstrap';
import { FaUserTie } from 'react-icons/fa';
import { supabase } from '../../supabaseClient';

interface AgentStats {
  name: string;
  active: number;
  closed: number;
  avgResponseTime: string;
}

const AgentPerformanceWidget: React.FC = () => {
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDuration = (milliseconds: number) => {
    if (isNaN(milliseconds) || milliseconds < 0) {
      return 'N/A';
    }
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const activePromise = supabase
        .from('conversaciones')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'activa');

      const closedPromise = supabase
        .from('conversaciones')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'cerrada');

      const responseTimePromise = supabase
        .from('conversaciones')
        .select('fecha_inicio, fecha_fin')
        .eq('estado', 'cerrada')
        .not('fecha_fin', 'is', null);

      const [activeRes, closedRes, responseTimeRes] = await Promise.all([
        activePromise,
        closedPromise,
        responseTimePromise,
      ]);

      if (activeRes.error || closedRes.error || responseTimeRes.error) {
        throw new Error('Error al cargar las estadísticas del agente.');
      }

      let totalMilliseconds = 0;
      if (responseTimeRes.data && responseTimeRes.data.length > 0) {
        totalMilliseconds = responseTimeRes.data.reduce((acc, curr) => {
          const startTime = new Date(curr.fecha_inicio).getTime();
          const endTime = new Date(curr.fecha_fin).getTime();
          return acc + (endTime - startTime);
        }, 0);
      }
      
      const avgMilliseconds = responseTimeRes.data.length > 0 ? totalMilliseconds / responseTimeRes.data.length : 0;

      setStats({
        name: 'Chat Clinica Pediatrica',
        active: activeRes.count || 0,
        closed: closedRes.count || 0,
        avgResponseTime: formatDuration(avgMilliseconds),
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    const subscription = supabase.channel('custom-conversaciones-channel-for-agent')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversaciones' },
        (payload) => {
          fetchStats();
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
          <td colSpan={4} className="text-center">
            <Spinner animation="border" size="sm" />
          </td>
        </tr>
      );
    }
    if (error) {
      return (
        <tr>
          <td colSpan={4}>
            <Alert variant="danger" className="p-2 m-0">{error}</Alert>
          </td>
        </tr>
      );
    }
    if (stats) {
      return (
        <tr>
          <td>{stats.name}</td>
          <td>{stats.active}</td>
          <td>{stats.closed}</td>
          <td>{stats.avgResponseTime}</td>
        </tr>
      );
    }
    return null;
  };

  return (
    <Card className="h-100">
      <Card.Header className="d-flex align-items-center">
        <FaUserTie className="me-2" />
        <h5 className="mb-0">Rendimiento de Agentes</h5>
      </Card.Header>
      <Card.Body>
        <Table striped hover size="sm">
          <thead>
            <tr>
              <th>Agente</th>
              <th>Activas</th>
              <th>Cerradas</th>
              <th>T. Respuesta</th>
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

export default AgentPerformanceWidget;
