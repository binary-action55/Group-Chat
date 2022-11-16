const express = require('express');
const path = require('path');
const rootDirectory = require('../utils/rootDirectory');

const router = express.Router();

const groupController = require(path.join(rootDirectory,'controller','group'));

router.post('/',groupController.createGroup);
router.get('/',groupController.getGroup);
router.get('/getAddableUsers',groupController.getGroupAddableUsers);
router.get('/userGroups',groupController.getUserGroups);
router.delete('/leaveGroup/:groupId',groupController.leaveGroup);

module.exports = router;