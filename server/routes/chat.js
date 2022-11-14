const express = require('express');
const path = require('path');
const rootDirectory = require('../utils/rootDirectory');

const router = express.Router();

const chatController = require(path.join(rootDirectory,'controller','chat'));

router.post('/',chatController.postChat);

module.exports = router;