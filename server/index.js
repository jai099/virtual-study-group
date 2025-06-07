const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const Message = require('./models/Message');

// Routes
const groupRoutes = require('./routes/groupRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const server = http.createServer(app);

// ✅ Allow your deployed frontend domain
const allowedOrigin = 'https://virtual-study-group-orih.vercel.app';

const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
        methods: ['GET', 'POST'],
    },
});

// ✅ Apply CORS with correct config
app.use(cors({
    origin: ['https://virtual-study-group-orih.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
  

app.use(express.json());

// Health check route
app.get('/', (req, res) => {
    res.send({
        activeStatus: true,
        error: false,
    });
});

// Routes
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);

// Socket.io functionality
io.on('connection', (socket) => {
    // Join group chat
    socket.on('joinroom', (groupId) => {
        socket.join(groupId);
        console.log(`User joined group: ${groupId}`);
    });

    // Handle message sending
    socket.on('sendMessage', async ({ groupId, sender, text }) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(groupId)) {
                console.log('❌ Invalid Group ID:', groupId);
                return;
            }

            const objectId = new mongoose.Types.ObjectId(groupId);
            const newMessage = new Message({ groupId: objectId, sender, text });
            await newMessage.save();

            io.to(groupId).emit('receiveMessage', newMessage);
            console.log('✅ Message sent:', newMessage);
        } catch (error) {
            console.error('❌ Error saving message:', error);
        }
    });

    // Typing indicator
    socket.on('typing', (groupId) => {
        socket.to(groupId).emit("showTyping");
    });

    socket.on('stopTyping', (groupId) => {
        socket.to(groupId).emit("hideTyping");
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log("User disconnected:", socket.id);
    });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        server.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
        });
    })
    .catch((err) => {
        console.log('MongoDB connection error:', err.message);
    });

module.exports = app;
