const path = require('path');
const User = require('../model/user');
const rootDirectory = require('../utils/rootDirectory');
const Chat = require(path.join(rootDirectory,'model','chat'));
const Group = require(path.join(rootDirectory,'model','group'));
const Sequelize = require('sequelize');

module.exports.postChat = async (req,res,next)=>{
    if(req.body.message==null || req.body.groupId==null){
        return res.status(401).json({message:'Bad Input'});
    }
    
    const message = req.body.message;
    const user = req.body.user;
    const groupId = +req.body.groupId;

    try{
        const group = await Group.findByPk(groupId);
        const userFromGroup = await group.getUsers({where:{id:user.id}});
        if(userFromGroup.length===0)
            return res.status(400).json({message:'User not in group'});
        const msg = await user.createChat({
            message,
            groupId,
        });
        res.status(201).json({success:true,message:'post added'});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}

module.exports.getGroupChat = async (req,res,next)=>{
    if(req.query.groupId==null)
        return res.status(401).json({message:'Bad Input'});
    try{
        let chatList = [];
        const timeOffset = req.query.timeOffset || new Date(0).toISOString(); 
        const group = await Group.findByPk(+req.query.groupId);
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
        const chats = await group.getChats(config);
        if(limit!==-1 && limit!=null){
            chats.reverse();
        }
        for(let chat of chats){
            const author = await chat.getUser();       
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