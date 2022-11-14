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