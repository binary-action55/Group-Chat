const express = require('express');
const path = require('path');
const rootDirectory = require('../utils/rootDirectory');

const router = express.Router();

const errorController = require(path.join(rootDirectory,'controller','error'));

router.use('/',errorController.page404);

module.exports = router;