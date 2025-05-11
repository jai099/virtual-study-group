const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupControllers');
const Group = require("../models/Group");

router.get('/', groupController.getAllGroups);
router.post('/', groupController.createGroup);
router.put('/:id/join', groupController.joinGroup);
router.put('/:id/approve', groupController.approveRequest);
router.put('/:id/deny', groupController.denyRequest);
router.get('/:id', groupController.getGroupById);


router.post('/test/add-dummy-requests/:groupId', async (req, res) => {
    const { groupId } = req.params;
    const dummyUsers = ['dummyUser1', 'dummyUser2', 'dummyUser3'];

    try {
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ error: 'Group not found' });

        // Add only if not already requested
        dummyUsers.forEach((user) => {
            if (!group.pendingRequests.includes(user) && !group.members.includes(user)) {
                group.pendingRequests.push(user);
            }
        });

        await group.save();
        res.json({ message: 'Dummy requests added', pendingRequests: group.pendingRequests });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


  
module.exports = router;
