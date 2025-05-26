const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io')
require('dotenv').config();
const Message = require('./models/Message')

//Routes
const groupRoutes = require('./routes/groupRoutes');
const messageRoutes = require('./routes/messageRoutes')



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',     
        methods: ['GET', 'POST'],

    },
});
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send({
        activeStatus: true,
        error:false,
    })
})
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
    res.send('Server is running');
});

// Real-time chat using Socket.io

io.on('connection', (socket) =>
{

    //Join Group chat 
    socket.on('joinroom', (groupId) => {
        socket.join(groupId);
        console.log(`User joined group: ${groupId}`);
    });


    // Sending messages on group
    socket.on('sendMessage', async ({ groupId, sender, text }) => {
        try {
            console.log('Raw Incoming:', { groupId, sender, text });

            // 🛠 Validate groupId format before using it
            if (!mongoose.Types.ObjectId.isValid(groupId)) {
                console.log('❌ Invalid Group ID:', groupId);
                return;
            }
            const objectId = new mongoose.Types.ObjectId(groupId);

            const newMessage = new Message({ groupId: objectId, sender, text });
            await newMessage.save();
            io.to(groupId).emit('receiveMessage', newMessage);

            console.log('✅ Saved and Emitted:', newMessage);
        } catch (error) {
            console.error('❌ Error saving message:', error);
        }
    });

    //user started typing 
    socket.on('typing', (groupId) => {
        socket.to(groupId).emit("showTyping")
    });

    //User stopped typing
    socket.on('stopTyping', (groupId) => {
        socket.to(groupId).emit("hideTyping");
    })



    // Disconnect
    socket.on('disconnect', () => {
        console.log("User disconnected:", socket.id)
    });
});

// Mongodb connection
mongoose.connect(process.env.MONGO_URI)

 .then(() => {
        console.log('Connected to MongoDB');
        server.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    })

.catch((err) => {
        console.log('Error connecting to MongoDB:', err.message);
    });


module.exports = app;