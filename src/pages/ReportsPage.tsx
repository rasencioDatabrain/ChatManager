
import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Card, Button } from 'react-bootstrap';
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
import type { ChartOptions } from 'chart.js';
import { mockConversations } from '../data/mockConversations';
import type { Conversation } from '../data/mockConversations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ConversationVolumeChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

const ReportsPage: React.FC = () => {
  const [chartData, setChartData] = useState<ConversationVolumeChartData>({
    labels: [],
    datasets: [],
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterType, setFilterType] = useState('last7days'); // 'last7days', 'last30days', 'custom'

  const processConversationData = (conversations: Conversation[], type: string, start?: string, end?: string) => {
    const counts: { [key: string]: number } = {};
    const labels: string[] = [];
    let filteredConvs = conversations;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (type === 'last7days' || type === 'last30days') {
      const days = type === 'last7days' ? 7 : 30;
      const tempToday = new Date(); // Use a temporary date object for calculations
      tempToday.setHours(0, 0, 0, 0);

      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(tempToday);
        d.setDate(tempToday.getDate() - i);
        labels.push(d.toISOString().split('T')[0]);
        counts[d.toISOString().split('T')[0]] = 0;
      }
      
      const filterCutoffDate = new Date(tempToday);
      filterCutoffDate.setDate(tempToday.getDate() - days + 1);
      
      filteredConvs = conversations.filter(conv => {
        const convDate = new Date(conv.timestamp);
        convDate.setHours(0, 0, 0, 0);
        return convDate >= filterCutoffDate;
      });
    } else if (type === 'custom' && start && end) {
      const s = new Date(start);
      const e = new Date(end);
      e.setHours(23, 59, 59, 999); // Include the whole end day

      const currentDate = new Date(s);
      while (currentDate <= e) {
        labels.push(currentDate.toISOString().split('T')[0]);
        counts[currentDate.toISOString().split('T')[0]] = 0;
        currentDate.setDate(currentDate.getDate() + 1);
      }
      filteredConvs = conversations.filter(conv => {
        const convDate = new Date(conv.timestamp);
        return convDate >= s && convDate <= e;
      });
    } else {
        // Default to last 7 days if no filter or custom dates are invalid
        const tempToday = new Date();
        tempToday.setHours(0, 0, 0, 0);
        for (let i = 6; i >= 0; i--) {
            const d = new Date(tempToday);
            d.setDate(tempToday.getDate() - i);
            labels.push(d.toISOString().split('T')[0]);
            counts[d.toISOString().split('T')[0]] = 0;
        }
        const filterCutoffDate = new Date(tempToday);
        filterCutoffDate.setDate(tempToday.getDate() - 6);
        filteredConvs = conversations.filter(conv => {
            const convDate = new Date(conv.timestamp);
            convDate.setHours(0, 0, 0, 0);
            return convDate >= filterCutoffDate;
        });
    }

    filteredConvs.forEach(conv => {
      const dateKey = new Date(conv.timestamp).toISOString().split('T')[0];
      if (counts[dateKey] !== undefined) {
        counts[dateKey]++;
      }
    });

    const data = labels.map(label => counts[label]);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Número de Conversaciones',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  useEffect(() => {
    processConversationData(mockConversations, filterType, startDate, endDate);
  }, [filterType, startDate, endDate]);

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Volumen de Conversaciones por Día',
      },
    },
  };

  return (
    <Container fluid className="p-4">
      <h1>Reportes y Métricas</h1>
      <h3>Volumen de Conversaciones</h3>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Filtros</Card.Title>
          <Form>
            <Row className="align-items-end">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Tipo de Filtro</Form.Label>
                  <Form.Select value={filterType} onChange={e => setFilterType(e.target.value)}>
                    <option value="last7days">Últimos 7 días</option>
                    <option value="last30days">Últimos 30 días</option>
                    <option value="custom">Personalizado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              {filterType === 'custom' && (
                <>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Fecha Inicio</Form.Label>
                      <Form.Control type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Fecha Fin</Form.Label>
                      <Form.Control type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </Form.Group>
                  </Col>
                </>
              )}
              <Col md={3}>
                <Button variant="primary" onClick={() => processConversationData(mockConversations, filterType, startDate, endDate)}>Aplicar Filtro</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Bar data={chartData} options={chartOptions} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReportsPage;
