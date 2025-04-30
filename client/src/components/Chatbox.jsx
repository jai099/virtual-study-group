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

        //Fetching old messages

        const fetchMessages = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/messages/${groupId}`);
                const data = await res.json();
                setMessages(data);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };

        fetchMessages();

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
                {Array.isArray(messages) && messages.map((msg, idx) => {
                    const time = new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                
               return (
                    <div key={idx} className="message">
                        <strong>{msg.sender}</strong>: {msg.text}
                        <div className='timestamp'>{time}</div>
                    </div>
                );
            })}
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
