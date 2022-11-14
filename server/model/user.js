const path = require('path');
const rootDirectory = require('../utils/rootDirectory');
const Sequelize = require('sequelize');

const sequelize = require(path.join(rootDirectory,'utils','database'));

const User = sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true,
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    phoneNumber:{
        type:Sequelize.STRING,
        allowNull:false,
    },
});

module.exports = User;