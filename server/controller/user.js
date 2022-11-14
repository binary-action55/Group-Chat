const path = require('path');
const rootDirectory = require('../utils/rootDirectory');
const User = require(path.join(rootDirectory,'model','user'));
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SEQUELIZE_UNIQUE_ERROR = 'SequelizeUniqueConstraintError';

module.exports.signUp = async (req,res,next) =>{
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

module.exports.login = async (req,res,next) =>{
    if(req.body.email==null||
        req.body.password==null
    ){
        return res.status(400).json({message:'Bad Input One or more Inputs are undefined or null'});
    }

    const email = req.body.email;
    const password = req.body.password;

    try{
        const user = await User.findAll({where:{email}});
        if(user.length===0){
            return res.status(400).json({message:'user not found',isValidUser:false});
        }
        const match = await bcrypt.compare(password,user[0].password);
        if(!match)
            return res.status(400).json({message:'user not authorized',isValidUser:true,isValidPassword:false})
        
        const token = jwt.sign({id:user[0].id},process.env.JWT_SECRET);       
        return res.status(200).json({success:true,message:'User Authorized',isValidUser:true,isValidPassword:true ,token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    } 
}