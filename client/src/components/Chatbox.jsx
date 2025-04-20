// Chatbox.jsx
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Initialize socket outside component but inside module scope
const socket = io('http://localhost:5000'); // ✅ Make sure backend is running on this port

const ChatBox = ({ groupId, sender }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!groupId) return; 

        
        socket.emit('joinroom', groupId);

        socket.on('receiveMessage', (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });
        return () => {
            socket.off('receiveMessage');
        };
    }, [groupId]);

    const sendMessage = () => {
        if (message.trim()) {
            
            console.log("Sending:", { groupId, sender, text: message });

            
            socket.emit('sendMessage', { groupId, sender, text: message });
            setMessage('');
        }
    };

    return (
        <div className="chat-box">
            <h2>Group Chat</h2>

            <div className="messages">
                {Array.isArray(messages) && messages.map((msg, idx) => (
                    <div key={idx} className="message">
                        <strong>{msg.sender}</strong>: {msg.text}
                    </div>
                ))}
            </div>

            <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatBox;
