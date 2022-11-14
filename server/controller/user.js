const path = require('path');
const rootDirectory = require('../utils/rootDirectory');
const User = require(path.join(rootDirectory,'model','user'));
const bcrypt = require('bcrypt');

const SEQUELIZE_UNIQUE_ERROR = 'SequelizeUniqueConstraintError';

module.exports.signUp = async (req,res,next) =>{
    console.log(req.body);
    if(req.body.name==null||
        req.body.email==null||
        req.body.password==null||
        req.body.phoneNumber==null
    ){
        return res.status(400).json({message:'Bad Input One or more Inputs are undefined or null'});
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;

    try{
        const hash = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            email,
            password:hash,
            phoneNumber,
        });
        return res.status(201).json({success:true,message:'User Created',isUniqueEmail:true});
    }
    catch(err){
        console.log(err);
        if(err.name===SEQUELIZE_UNIQUE_ERROR){
            return res.status(400).json({message:'Email is already registered',isUniqueEmail:false});
        }
        res.status(500).json({message:err});
    } 
}