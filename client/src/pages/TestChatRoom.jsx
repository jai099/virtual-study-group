// TestChatRoom.jsx
import React from 'react';
import ChatBox from '../components/Chatbox'; // ✅ adjust if path is different

const TestChatRoom = () => {
  const validGroupId = '661f84c8a9f78f18d7c7f8a1'; // ✅ MongoDB valid ObjectId

  return (
    <div style={{ display: 'flex', gap: '40px', justifyContent: 'center' }}>
      <div>
        <h3>User 1</h3>
        <ChatBox groupId={validGroupId} sender="User1" />
      </div>
      <div>
        <h3>User 2</h3>
        <ChatBox groupId={validGroupId} sender="User2" />
      </div>
    </div>
  );
};

export default TestChatRoom;
