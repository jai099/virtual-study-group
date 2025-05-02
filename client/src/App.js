// 📁 src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateGroupForm from "./components/CreateGroupForm";
import GroupList from "./components/GroupList"; // ✅ Import from correct path
import ChatPage from "./pages/ChatPage";
import TestChatRoom from "./pages/TestChatRoom";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 🚀 Called when a group is created to trigger refresh
  const handleGroupCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ textAlign: "center", padding: "20px" }}>
              <h1>📚 Virtual Study Groups</h1>
              <CreateGroupForm onGroupCreated={handleGroupCreated} />
              <GroupList refreshTrigger={refreshTrigger} />
            </div>
          }
        />
        <Route path="/chat/:groupId" element={<ChatPage />} />
        <Route path="/test" element={<TestChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
