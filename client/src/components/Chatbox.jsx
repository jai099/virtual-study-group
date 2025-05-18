// ChatBox.jsx
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import styles from './ChatBox.module.css';


// ✅ Initialize socket globally
const socket = io('http://localhost:5000');

const ChatBox = ({ groupId, sender }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const [typing, setTyping] = useState(false);
    const [someoneTyping, setSomeoneTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    const [showVideoCall, setShowVideoCall] = useState(null);
    const [showWhiteboard, setShowWhiteboard] = useState(false);

    // ✅ Unique room name for Jitsi
    const jitsiRoomName = `StudyGroup-${groupId || 'default'}`;
console.log('🔍 groupId:', groupId);  // Add this line

    useEffect(() => {
        // ✅ Exit early if groupId is not valid
        if (!groupId) {
            console.warn('⚠️ No groupId provided. Skipping join and fetch.');
            return;
        }

        // ✅ Delay join to ensure socket is ready before other emits
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

        // ✅ Listen for new messages
        socket.on('receiveMessage', (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        // ✅ Cleanup socket listener on unmount or groupId change
        return () => {
            socket.off('receiveMessage');
        };
    }, [groupId]);

    useEffect(() => {
        // ✅ Auto-scroll to latest message
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // ✅ Typing indicators setup
        socket.on('showTyping', () => setSomeoneTyping(true));
        socket.on('hideTyping', () => setSomeoneTyping(false));

        return () => {
            socket.off('showTyping');
            socket.off('hideTyping');
        };
    }, []);

    const sendMessage = () => {
        if (!message.trim()) return;

        // ✅ Prevent sending if groupId is invalid
        if (!groupId) {
            console.error('❌ Cannot send message. groupId is undefined.');
            return;
        }

        // ✅ Emit message
        socket.emit('sendMessage', { groupId, sender, text: message });
        setMessage('');

        // ✅ Stop typing after sending
        socket.emit('stopTyping', groupId);
    };

    const handleInputChange = (e) => {
        setMessage(e.target.value);

        // ✅ Avoid typing event if groupId is not available
        if (!groupId) return;

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
        <div className={styles.pageContainer}>
        <div className={styles.chatBox}>
            <h2 className={styles.heading}>Group Chat</h2>

            <div className={styles.actionButtons}>
  {!showVideoCall && (
    <button onClick={() => setShowVideoCall(true)}>
      🎥 Join Video Call
    </button>
  )}

  {!showWhiteboard && (
    <button onClick={() => setShowWhiteboard(true)}>
      📋 Open Whiteboard
    </button>
  )}
</div>

<div className={styles.videoWhiteboardWrapper}>
  {showVideoCall && (
    <iframe
      title="Jitsi Video Call"
      allow="camera; microphone; fullscreen; display-capture"
      src={`https://meet.jit.si/${jitsiRoomName}`}
      className={styles.videoCallFrame}
    />
  )}

  {showWhiteboard && (
    <iframe
      title="Excalidraw Whiteboard"
      src={`/whiteboard/${groupId}`}
      className={styles.whiteboardFrame}
    />
  )}
</div>

<div className={styles.actionButtons}>
  {showVideoCall && (
    <button onClick={() => setShowVideoCall(false)}>
      ❌ Close Video Call
    </button>
  )}

  {showWhiteboard && (
    <button onClick={() => setShowWhiteboard(false)}>
      ❌ Close Whiteboard
    </button>
  )}
</div>
      


<div className={styles.messages}>
                {Array.isArray(messages) && messages.map((msg, idx) => {
                    const time = new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    });

                    return (
                        <div key={idx} className={styles.message}>

                            <strong>{msg.sender}</strong>: {msg.text}
                            <div className="timestamp">{time}</div>
                        </div>
                    );
                })}

                {someoneTyping && (
                     <div className={styles.typingIndicator}>💬 Someone is typing...</div>
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
            <button onClick={sendMessage}  className={styles.sendButton}>Send</button>
            </div>
            </div>
    );
};

export default ChatBox;
