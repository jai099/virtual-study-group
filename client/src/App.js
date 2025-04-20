import React from 'react';
import ChatBox from './components/Chatbox';

function App() {
  const dummyGroupId = '661f84c8a9f78f18d7c7f8a1'; // replace with real group ID
  const sender = 'Jai Patel'; // can be wallet/user later


return (
  <div>
    <ChatBox groupId={dummyGroupId} sender={sender} />
  </div>
);
}
  
export default App;