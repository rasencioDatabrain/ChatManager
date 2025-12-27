
import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import ConversationList from '../components/ConversationList';
import type { AppConversation } from '../types';
import ChatWindow from '../components/ChatWindow';

const ConversationsPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<AppConversation | null>(null);

  const handleSelectConversation = (conversation: AppConversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <Row g={0} className="h-100">
      <Col md={5} lg={4} xl={4} className="border-end">
        <ConversationList onSelectConversation={handleSelectConversation} />
      </Col>
      <Col md={7} lg={8} xl={8}>
        <ChatWindow conversation={selectedConversation} />
      </Col>
    </Row>
  );
};

export default ConversationsPage;
