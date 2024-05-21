const jwt=require('jsonwebtoken');
const User=require('./models/user');

const access= async(req,res,next)=>{
    let token;
    if(req.headers.authorization){
        try{
            token=req.headers.authorization.split(" ")[1];

            const decoded=jwt.verify(token,process.env.SECRET_TOKEN);
            req.user =await User.findById(decoded.id).select("-password");
            next();
        } catch(err){
            res.status(401).json({error: 'Unable to identify user'});
        }
    }
    else{
        res.status(401).json({error: 'Invalid token'});
    }
};

module.exports={access};
