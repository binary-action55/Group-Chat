const path = require('path');
const jwt = require('jsonwebtoken');
const rootDirectory = require('../utils/rootDirectory');

//Model
const User = require(path.join(rootDirectory,'model','user'));

const JSON_WEB_TOKEN_ERROR = 'JsonWebTokenError';

module.exports.authorize = async (req,res,next) =>{
    if(req.headers.authorization==null){
        return res.status(401).json({message:'Not Authorized'});
    }

    const token = req.headers.authorization;
    try{
        const body = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findByPk(body.id);
        if(user===null)
            throw new Error('user not found');
        req.body.user = user;
        next();
    }
    catch(err){
        console.log(err);
        if(err.name===JSON_WEB_TOKEN_ERROR){
            return res.status(401).json({message:'Not Authorized'});
        }
        res.status(500).json({message:'Server Error'});
    }
}