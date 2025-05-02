// /src/pages/ChatPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ChatBox from '../components/Chatbox'; // path adjust kar agar folder structure alag ho

const ChatPage = () => {
  const { groupId } = useParams();

  if (!groupId) {
    console.warn('⛔ groupId not found yet, skipping render...');
    return <div>Loading...</div>;
  }

  return <ChatBox groupId={groupId} sender="Jai Patel" />;
};

export default ChatPage;
