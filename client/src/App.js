// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TestChatRoom from './pages/TestChatRoom';
import GroupList from './pages/GroupList';
import ChatPage from './pages/ChatPage'; // ✅ make sure this exists

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GroupList />} />
        <Route path="/chat/:groupId" element={<ChatPage />} /> {/* ✅ Add this back */}
        <Route path="/test" element={<TestChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
