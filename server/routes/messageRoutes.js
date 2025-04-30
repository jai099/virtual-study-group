const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/:groupId', async (req, res) => {
    try {
        const messages = await Message.find({ groupId: req.params.groupId });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;