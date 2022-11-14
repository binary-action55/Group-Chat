const express = require('express');
const path = require('path');
const rootDirectory = require('../utils/rootDirectory');

const router = express.Router();

const userController = require(path.join(rootDirectory,'controller','user'));

router.post('/signup',userController.signUp);
router.post('/login',userController.login);

module.exports = router;