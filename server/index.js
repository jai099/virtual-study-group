const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io')
require('dotenv').config();


//Routes
const groupRoutes = require('./routes/groupRoutes');



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",

    },
});
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/groups', groupRoutes);


app.get('/', (req, res) => {
    res.send('Server is running');
});

// Real-time chat using Socket.io

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    //Join Group chat 
    socket.on('joinroom', (groupId) => {
        socket.join(groupId);
        console.log(`User joined group: ${groupId}`);
    });


    // Sending messages on group
    socket.on('sendMessage', async ({ groupId, sender, text }) => {
        try {
            const newMessage = new MessageChannel({ groupId, sender, text });
            await newMessage.save();

            //Show message in the same group
            io.to(groupId).emit('receiveMessage', newMessage);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });


    // Disconnect
    socket.on('disconnect', () => {
        console.log("User disconnected:", socket.id)
    });
});

// Mongodb connection
mongoose.connect(process.env.MONGO_URI)

 .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    })

.catch((err) => {
        console.log('Error connecting to MongoDB:', err.message);
    });