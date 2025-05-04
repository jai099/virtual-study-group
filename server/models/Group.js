const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    members: {
        type: [String], // Array of usernames or userIds
        default: []
    },
    pendingRequests: {
        type: [String], // Store usernames or userIds
        default: []
    },
    owner: {
        type: String, // Username or userId of group creator
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Group', groupSchema);
