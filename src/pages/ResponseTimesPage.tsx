import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import type { ChartOptions, ChartData } from 'chart.js';
import { supabase } from '../supabaseClient';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResponseTimesPage: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData<'bar'>>({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponseTimes = async () => {
      setLoading(true);
      setError(null);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const { data, error: fetchError } = await supabase
        .from('conversaciones')
        .select('fecha_inicio, fecha_fin')
        .gte('fecha_inicio', sevenDaysAgo.toISOString())
        .not('fecha_fin', 'is', null);

      if (fetchError) {
        console.error('Error fetching response times:', fetchError);
        setError('No se pudo cargar los tiempos de respuesta.');
        setLoading(false);
        return;
      }

      // Process data
      const dailyDurations: { [key: string]: number[] } = {};

      data.forEach(conv => {
        if (conv.fecha_inicio && conv.fecha_fin) {
            const startDate = new Date(conv.fecha_inicio);
            const endDate = new Date(conv.fecha_fin);
            const durationMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);

            if (durationMinutes >= 0) {
                const dateKey = startDate.toISOString().split('T')[0];
                if (!dailyDurations[dateKey]) {
                    dailyDurations[dateKey] = [];
                }
                dailyDurations[dateKey].push(durationMinutes);
            }
        }
      });

      const labels: string[] = [];
      const averages: number[] = [];
      
      const dateMap: { [key: string]: number | null } = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        const dateKey = d.toISOString().split('T')[0];
        labels.push(d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }));
        dateMap[dateKey] = null;
      }

      Object.keys(dailyDurations).forEach(dateKey => {
          const durations = dailyDurations[dateKey];
          const average = durations.reduce((a, b) => a + b, 0) / durations.length;
          if (dateMap.hasOwnProperty(dateKey)) {
              dateMap[dateKey] = average;
          }
      });

      const sortedDateKeys = Object.keys(dateMap).sort();
      sortedDateKeys.forEach(key => {
          averages.push(dateMap[key] || 0);
      });


      setChartData({
        labels,
        datasets: [
          {
            label: 'Tiempo de Respuesta Promedio (min)',
            data: averages,
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });

      setLoading(false);
    };

    fetchResponseTimes();
  }, []);

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Promedio Diario de Tiempo de Respuesta (Últimos 7 Días)',
        font: { size: 18 }
      },
    },
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Minutos'
            }
        }
    }
  };

  return (
    <Container fluid className="p-4">
      <h1 className="mb-4">Tiempos de Respuesta</h1>
      <div className="w-75 mx-auto">
        <Card>
          <Card.Header>
              <Card.Title as="h5">Tiempos de Respuesta</Card.Title>
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

export default ResponseTimesPage;
