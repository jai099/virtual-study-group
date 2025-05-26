import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatBox.module.css';

const ChatBox = ({ groupId, sender }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // ✅ Function to get messages from server
  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages/${groupId}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  // ✅ Run once + poll every 3s
  useEffect(() => {
    fetchMessages(); // Get messages first time
    const interval = setInterval(fetchMessages, 3000); // Repeat every 3s
    return () => clearInterval(interval); // Stop polling on unmount
  }, [groupId]);

  // ✅ Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, sender, text: message }),
      });
      setMessage('');
      fetchMessages(); // Fetch immediately after sending
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className={styles.chatBox}>
      <h2 className={styles.heading}>Group Chat</h2>

      <div className={styles.messages}>
        {messages.map((msg, idx) => (
          <div key={idx} className={styles.message}>
            <strong>{msg.sender}</strong>: {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type your message"
      />
      <button onClick={sendMessage} className={styles.sendButton}>Send</button>
    </div>
  );
};

export default ChatBox;
