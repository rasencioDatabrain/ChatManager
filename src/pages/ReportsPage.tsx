
import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { ChartOptions, ChartData } from 'chart.js';
import { supabase } from '../supabaseClient';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportsPage: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData<'bar'>>({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversationVolume = async () => {
      setLoading(true);
      setError(null);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('conversaciones')
        .select('fecha_inicio, estado_conversacion')
        .gte('fecha_inicio', sevenDaysAgo.toISOString());

      if (error) {
        console.error('Error fetching conversation volume:', error);
        setError('No se pudo cargar el volumen de conversaciones.');
        setLoading(false);
        return;
      }

      // --- Process Data ---
      const counts: { [key: string]: { manual: number; automatica: number } } = {};
      const labels: string[] = [];

      // Initialize last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        const dateKey = d.toISOString().split('T')[0];
        labels.push(d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }));
        counts[dateKey] = { manual: 0, automatica: 0 };
      }

      // Populate counts
      data.forEach(conv => {
        const dateKey = new Date(conv.fecha_inicio).toISOString().split('T')[0];
        if (counts[dateKey]) {
          if (conv.estado_conversacion === 'manual') {
            counts[dateKey].manual++;
          } else if (conv.estado_conversacion === 'automatica') {
            counts[dateKey].automatica++;
          }
        }
      });

      const dateKeys = Object.keys(counts).sort();
      const manualData = dateKeys.map(key => counts[key].manual);
      const automaticaData = dateKeys.map(key => counts[key].automatica);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Manuales',
            data: manualData,
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Automáticas',
            data: automaticaData,
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      });

      setLoading(false);
    };

    fetchConversationVolume();
  }, []);

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Volumen de Conversaciones (Últimos 7 Días)',
        font: { size: 18 }
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

  return (
    <Container fluid className="p-4">
      <h1 className="mb-4">Reportes y Métricas</h1>
      
      <div className="w-75 mx-auto">
        <Card>
          <Card.Header>
              <Card.Title as="h5">Volumen de Conversaciones</Card.Title>
          </Card.Header>
          <Card.Body style={{ height: '45vh' }} className="d-flex justify-content-center align-items-center">
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && <Bar data={chartData} options={{...chartOptions, maintainAspectRatio: false}} />}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default ReportsPage;
