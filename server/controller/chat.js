const path = require('path');
const User = require('../model/user');
const rootDirectory = require('../utils/rootDirectory');
const Chat = require(path.join(rootDirectory,'model','chat'));
const Sequelize = require('sequelize');

module.exports.postChat = async (req,res,next)=>{
    if(req.body.message==null){
        return res.json(401).json({message:'Bad Input'});
    }
    
    const message = req.body.message;
    const user = req.body.user;
    try{
        const msg = await user.createChat({
            message,
        });
        res.status(201).json({success:true,message:'post added'});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}

module.exports.getAllChat = async (req,res,next)=>{
    try{
        let chatList = [];
        const timeOffset = req.query.timeOffset || new Date(0).toISOString(); 
        const config = {
            where:{
                createdAt:{
                    [Sequelize.Op.gt]:timeOffset,
                }
            },
        };
        const limit = +req.query.limit;
        if(limit!==-1 && limit!=null){
            config.limit = limit;
            config.order = [['createdAt','DESC']];
        }
        const chats = await Chat.findAll(config);
        if(limit!==-1 && limit!=null){
            chats.reverse();
        }
        for(let chat of chats){
            const author = await User.findByPk(chat.userId);        
            chatList.push({
                time:chat.createdAt,
                message: `${author.name}: ${chat.message}`,
            });
        }
        res.status(200).json({success:true,chatList});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}