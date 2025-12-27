
import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { supabase } from '../../supabaseClient';
import { FaChartLine } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
};

const SalesChartWidget: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversationData = async () => {
      setLoading(true);
      setError(null);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('conversaciones')
        .select('fecha_inicio')
        .in('estado', ['activa', 'cerrada'])
        .gte('fecha_inicio', thirtyDaysAgo.toISOString());

      if (error) {
        console.error('Error fetching conversation data:', error);
        setError('No se pudieron cargar los datos del gráfico.');
        setLoading(false);
        return;
      }

      // Process data
      const countsByDay = data.reduce((acc, curr) => {
        const date = new Date(curr.fecha_inicio).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Fill in missing dates with 0 counts
      const labels = [];
      const dataPoints = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        labels.unshift(date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }));
        dataPoints.unshift(countsByDay[dateString] || 0);
      }

      setChartData({
        labels,
        datasets: [
          {
            label: 'Conversaciones por Día',
            data: dataPoints,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            tension: 0.1
          },
        ],
      });

      setLoading(false);
    };

    fetchConversationData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <div className="d-flex justify-content-center align-items-center h-100"><Spinner animation="border" /></div>;
    }
    if (error) {
      return <div className="d-flex justify-content-center align-items-center h-100"><Alert variant="danger">{error}</Alert></div>;
    }
    if (chartData) {
      return <Line options={options} data={chartData} />;
    }
    return null;
  };

  return (
    <Card className="h-100">
      <Card.Header className="d-flex align-items-center">
        <FaChartLine className="me-2" />
        <h5 className="mb-0">Conversaciones por Día (Últimos 30 días)</h5>
      </Card.Header>
      <Card.Body>
        <div style={{ height: '300px' }}>
          {renderContent()}
        </div>
      </Card.Body>
    </Card>
  );
};

export default SalesChartWidget;
