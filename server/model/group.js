const path = require('path');
const rootDirectory = require('../utils/rootDirectory');
const Sequelize = require('sequelize');

const sequelize = require(path.join(rootDirectory,'utils','database'));

const Group = sequelize.define('group',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
});

module.exports = Group;