const path = require('path');
const rootDirectory = require('../utils/rootDirectory');
const Sequelize = require('sequelize');

const sequelize = require(path.join(rootDirectory,'utils','database'));

const groupUser = sequelize.define('groupuser',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
    },
    role:{
        type:Sequelize.STRING,
        allowNull:false,
    },
});

module.exports = groupUser;