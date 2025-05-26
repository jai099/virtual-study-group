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
router.delete('/:id', groupController.deleteGroup);



  
module.exports = router;
