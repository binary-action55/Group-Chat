const express = require('express');
const path = require('path');
const rootDirectory = require('../utils/rootDirectory');

const router = express.Router();

const chatController = require(path.join(rootDirectory,'controller','chat'));

router.get('/',chatController.getGroupChat);
router.post('/',chatController.postChat);
router.post('/uploadFile',chatController.uploadFile);

module.exports = router;