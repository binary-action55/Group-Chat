const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const rootDirectory = require('./utils/rootDirectory');
const sequelize = require(path.join(rootDirectory,'utils','database'));
const cors = require('cors');
const compression = require('compression');

//Routes
const userRoutes = require(path.join(rootDirectory,'routes','user'));
const errorRoutes = require(path.join(rootDirectory,'routes','error'));
const chatRoutes = require(path.join(rootDirectory,'routes','chat'));
const groupRoutes = require(path.join(rootDirectory,'routes','group'));

//Models
const User = require(path.join(rootDirectory,'model','user'));
const Chat = require(path.join(rootDirectory,'model','chat'));
const Group = require(path.join(rootDirectory,'model','group'));
const GroupUser = require(path.join(rootDirectory,'model','groupuser'));

//Middleware
const userAuthorization = require(path.join(rootDirectory,'middleware','authorization'));

const app = express();

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended:false});

app.use(cors());
app.use(compression());

app.use('/user',jsonParser,userRoutes);
app.use('/chat',jsonParser,userAuthorization.authorize,chatRoutes);
app.use('/group',jsonParser,userAuthorization.authorize,groupRoutes);
app.use('/',errorRoutes);

User.hasMany(Chat);
Chat.belongsTo(User,{contraints:true,onDelete:'CASCADE'});

Group.belongsToMany(User,{through:GroupUser});
User.belongsToMany(Group,{through:GroupUser});

Group.hasMany(Chat);
Chat.belongsTo(Group,{contraints:true,onDelete:'CASCADE'});

sequelize.sync()
.then(()=>{
    app.listen(3000);
})
.catch(err=>console.log(err));