const path = require('path');
const rootDirectory = require('../utils/rootDirectory');
const Sequelize = require('sequelize');

const sequelize = require(path.join(rootDirectory,'utils','database'));

const Chat = sequelize.define('chat',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
    },
    message:{
        type:Sequelize.STRING,
        allowNull:false,
    },
});

module.exports = Chat;