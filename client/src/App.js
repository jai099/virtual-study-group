import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatBox from './components/Chatbox';
import TestChatRoom from './pages/TestChatRoom';
import GroupList from './pages/GroupList';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
  const { groupId } = useParams();
  return <ChatBox groupId={groupId} sender="Jai Patel" />
}
function App() {
  const dummyGroupId = '661f84c8a9f78f18d7c7f8a1'; // replace with real group ID
  const sender = 'Jai Patel'; // can be wallet/user later

  return (
    <Router>
      <Routes>
        <Route path="/" element={<GroupList />} />
        <Route path="/chat/:groupId" element={<ChatPage />} />
        <Route path="/" element={<ChatBox groupId={dummyGroupId} sender={sender} />} />
        <Route path="/test" element={<TestChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
