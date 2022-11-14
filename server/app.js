const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const rootDirectory = require('./utils/rootDirectory');
const sequelize = require(path.join(rootDirectory,'utils','database'));
const cors = require('cors');

//Routes
const userRoutes = require(path.join(rootDirectory,'routes','user'));
const errorRoutes = require(path.join(rootDirectory,'routes','error'));

const app = express();

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended:false});

app.use(cors());

app.use('/user',jsonParser,userRoutes);
app.use('/',errorRoutes);

sequelize.sync()
.then(()=>{
    app.listen(3000);
})
.catch(err=>console.log(err));