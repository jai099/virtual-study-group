const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// Create a new group
router.post('/', groupController.createGroup);

// Get all groups
router.get('/', groupController.getAllGroups);

// Get a single group by ID
router.get('/:id', groupController.getGroupById);

// Update a group by ID
router.put('/:id', groupController.updateGroup);

// Delete a group by ID
router.delete('/:id', groupController.deleteGroup);

// Join requests
router.put('/:id/join', groupController.joinGroup);       // user sends join request
router.put('/:id/approve', groupController.approveRequest); // owner approves
router.put('/:id/deny', groupController.denyRequest);       // owner denies

module.exports = router;
