
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ActiveConversationsWidget from '../components/dashboard/ActiveConversationsWidget';
import UserGroupsWidget from '../components/dashboard/UserGroupsWidget';
import AgentPerformanceWidget from '../components/dashboard/AgentPerformanceWidget';
import SalesChartWidget from '../components/dashboard/SalesChartWidget';

const DashboardHomePage: React.FC = () => {
  return (
    <Container fluid className="p-4">
      <h1 className="mb-4">Dashboard</h1>
      <Row>
        {/* Main Chart */}
        <Col xs={12} lg={8} className="mb-4">
          <SalesChartWidget />
        </Col>

        {/* Side Cards */}
        <Col xs={12} lg={4} className="mb-4">
          <Row>
            <Col xs={12} className="mb-4">
                <ActiveConversationsWidget />
            </Col>
            <Col xs={12} className="mb-4">
                <UserGroupsWidget />
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        {/* Full-width Table */}
        <Col xs={12} className="mb-4">
          <AgentPerformanceWidget />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardHomePage;
