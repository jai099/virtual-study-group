const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});

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