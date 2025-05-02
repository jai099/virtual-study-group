import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TestChatRoom from './pages/TestChatRoom';
import GroupList from './pages/GroupList';
import ChatPage from './pages/ChatPage';
import CreateGroupForm from './components/CreateGroupForm'; // ✅ make sure this file exists

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleGroupCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1 style={{ textAlign: 'center' }}>📚 Virtual Study Groups</h1>
              <CreateGroupForm onGroupCreated={handleGroupCreated} />
              <GroupList refreshTrigger={refreshTrigger} />
            </>
          }
        />
        <Route path="/chat/:groupId" element={<ChatPage />} />
        <Route path="/test" element={<TestChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;