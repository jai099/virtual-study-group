// ChatBox.jsx
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './ChatBox.css';

// Initialize socket globally
const socket = io('http://localhost:5000');

const ChatBox = ({ groupId, sender }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const [typing, setTyping] = useState(false);
    const [someoneTyping, setSomeoneTyping] = useState(false);
    const typingTimeoutRef = useRef(null); // ✅ Used for typing debounce
    const [showVideoCall, setShowVideoCall] = useState(null);

    //creating unique name for jitsi
    const jitsiRoomName = `StudyGroup-${groupId}`;

    useEffect(() => {
        if (!groupId) return;

        // Delay join to ensure socket is ready before other emits
        setTimeout(() => {
            socket.emit('joinroom', groupId);
        }, 100);

        const fetchMessages = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/messages/${groupId}`);
                const data = await res.json();
                setMessages(data);
            } catch (error) {
                console.error('❌ Failed to fetch messages:', error);
            }
        };

        fetchMessages();

        // Listen for incoming messages
        socket.on('receiveMessage', (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [groupId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        socket.on('showTyping', () => setSomeoneTyping(true));
        socket.on('hideTyping', () => setSomeoneTyping(false));

        return () => {
            socket.off('showTyping');
            socket.off('hideTyping');
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit('sendMessage', { groupId, sender, text: message });
            setMessage('');
            socket.emit('stopTyping', groupId); // ⛔ Stop typing after sending
        }
    };

    const handleInputChange = (e) => {
        setMessage(e.target.value);

        if (!typing) {
            setTyping(true);
            socket.emit('typing', groupId);
        }

        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            setTyping(false);
            socket.emit('stopTyping', groupId);
        }, 1000);
    };

    return (
        <div className="chat-box">
            <h2>Group Chat</h2>

            <div style={{ marginBottom: '20px' }}>
                {!showVideoCall ? (
                    <button onClick={() => setShowVideoCall(true)}>
                        🎥 Join Video Call
                    </button>
                ) : (
                    <div>
                        <iframe
                            title="Jitsi Video Call"
                            allow="camera; microphone; fullscreen; display-capture"
                            src={`https://meet.jit.si/${jitsiRoomName}`}
                            style={{
                                width: '100%',
                                height: '500px',
                                border: 0,
                                marginTop: '10px',
                                borderRadius: '8px',
                            }}
                        />

            
                        <button onClick={() => setShowVideoCall(false)} style={{ marginTop: '10px' }}>
                            ❌ Close Video Call
                        </button>
                    </div>
                )}
                </div>
            <div className="messages">
                {Array.isArray(messages) && messages.map((msg, idx) => {
                    const time = new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    });

                    return (
                        <div key={idx} className="message">
                            <strong>{msg.sender}</strong>: {msg.text}
                            <div className="timestamp">{time}</div>
                        </div>
                    );
                })}

                {someoneTyping && (
                    <div className="typing-indicator">💬 Someone is typing...</div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatBox;
