const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const mongoose = require('mongoose'); 

router.get('/:groupId', async (req, res) => {
    try {
        const { groupId } = req.params;

        // 🛠 Convert string to ObjectId
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: 'Invalid group ID' });
        }

        const messages = await Message.find({ groupId: new mongoose.Types.ObjectId(groupId) });

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
