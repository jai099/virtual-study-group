const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupControllers');

router.get('/', groupController.getAllGroups);
router.post('/', groupController.createGroup);
router.get('/:id', groupController.getGroupById);
router.put('/:id/join', groupController.joinGroup);
router.put('/:id/approve', groupController.approveRequest);
router.put('/:id/deny', groupController.denyRequest);

module.exports = router;
