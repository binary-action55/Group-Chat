const path = require('path');
const rootDirectory = require('../utils/rootDirectory');
const Group = require(path.join(rootDirectory,'model','group'));
const User = require(path.join(rootDirectory,'model','user'));
const Sequelize = require('sequelize');

module.exports.createGroup = async (req,res,next)=>{
    if(req.body.groupName==null || req.body.userIds ==null){
        return res.status(400).json({message:'Bad Input One or more Inputs are undefined or null'});
    }
    
    const userIds = req.body.userIds;

    try{
        const group = await Group.create({
            name:req.body.groupName,
        });
        await req.body.user.addGroup(group,{
            through:{
                role:'Admin',
            }
        });
        for(let userId of userIds){
            const user = await User.findByPk(+userId);
            await group.addUser(user,{
                through:{
                    role:'User'
                }
            });
        }
        res.status(201).json({success:true,message:'Group Created',groupId:group.id});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}

module.exports.editGroup = async (req,res,next)=>{
    if( req.body.groupId==null ||
        req.body.groupName==null ||
        req.body.userIds ==null ||
        req.body.removeUserIds==null){
        return res.status(400).json({message:'Bad Input One or more Inputs are undefined or null'});
    }
    const groupId = +req.body.groupId;
    const groupName = req.body.groupName;
    const userIds = req.body.userIds;
    const removeUserIds = req.body.removeUserIds;
    try{
        const group = await Group.findByPk(groupId);
        if(group.name!==groupName){
            group.name = groupName;
            await group.save();
        }
        for(let userId of userIds){
            const user = await User.findByPk(+userId);
            await group.addUser(user,{
                through:{
                    role:'User'
                }
            });
        }
        for(let removeUserId of removeUserIds){
            await group.removeUser(+removeUserId);
        }
        res.status(201).json({success:true,message:'Group Edited'});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}


module.exports.getGroup = async (req,res,next)=>{
    if(req.query.groupId==null){
        return res.status(400).json({message:'Bad Input One or more Inputs are undefined or null'});
    }

    try{
        const group = await Group.findByPk(+req.query.id);
        const groupUsers = await group.getUsers();
        console.log(groupUsers);
        return res.status(200).json({success:true,group:{...group,groupUsers}});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}

module.exports.getUserGroups = async (req,res,next)=>{
    try{
        const user = req.body.user;
        const groups = await user.getGroups();
        const groupList = [];
        for(let group of groups){
            const memberCount = await group.countUsers();
            const isAdmin = groups.groupuser.role==='Admin';
            groupList.push({
                id:group.id,
                name:group.name,
                isAdmin,
                memberCount,
            })
        }
        return res.status(200).json({success:true,groupList});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}

module.exports.getGroupAddableUsers = async (req,res,next) =>{
    try{
        const user = req.body.user;
        const users = await User.findAll({where:{
           id:{
            [Sequelize.Op.not]:user.id,
           } 
        }});
        return res.status(200).json({success:true,users});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }

}

module.exports.getEditAddableUsers = async (req,res,next) =>{
    if(req.query.groupId==null)
        return res.status(400).json({message:'Bad Input'});
    
    const groupId = +req.query.groupId;
    try{
        const group = Group.findByPk(groupId);
        const user = req.body.user;
        const groupUsers = await group.getUsers();
        const groupUserIds = groupUsers.map((user)=>user.id);
        const users = await User.findAll({where:{
           id:{
            [Sequelize.Op.notIn]:groupUserIds,
           } 
        }});
        return res.status(200).json({success:true,users});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }

}

module.exports.getEditRemovableUsers = async (req,res,next) =>{
    if(req.query.groupId==null)
        return res.status(400).json({message:'Bad Input'});
    
    const groupId = +req.query.groupId;
    try{
        const group = Group.findByPk(groupId);
        const user = req.body.user;
        const users = await group.getUsers({where:{
            id:{
             [Sequelize.Op.not]:user.id,
            } 
         }});
        return res.status(200).json({success:true,users});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}

module.exports.leaveGroup = async (req,res,next) =>{
    if(req.params.groupId==null){
        return res.status(400).json({message:'Bad Input'});
    }
    const user = req.body.user;
    const groupId = +req.params.groupId;
    try{    
        await user.removeGroup(groupId);
        return res.status(201).json({success:true,message:'User left group'});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}