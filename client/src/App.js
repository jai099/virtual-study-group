import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateGroupForm from "./components/CreateGroupForm";
import GroupList from "./components/GroupList";
import ChatPage from "./pages/ChatPage";
import TestChatRoom from "./pages/TestChatRoom";
import GroupDetails from "./pages/GroupDetails";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const loggedInUsername = "jai123"; // 🔐 Replace this with actual login logic later

  const handleGroupCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            
            <div style={{ textAlign: "center", padding: "20px" }}>
              <h1>📚 Virtual Study Groups</h1>
              <CreateGroupForm owner={loggedInUsername} onGroupCreated={handleGroupCreated} />
              <GroupList currentUsername={loggedInUsername} refreshTrigger={refreshTrigger} />
              
            </div>
          }
        />

        <Route
          path="/group/:id"
          element={<GroupDetails currentUsername={loggedInUsername} />}
        />

        <Route path="/chat/:groupId" element={<ChatPage currentUsername={loggedInUsername} />} />
        <Route path="/test" element={<TestChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
