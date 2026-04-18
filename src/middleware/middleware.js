const tokenBlacklist = require("../models/blacklist.model.js")
const jwt = require("jsonwebtoken");
async function getMe(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(400).json({
            message:"token is not found"
        })
    }
    const isBlacklist = await tokenBlacklist.findOne({token})
    if(isBlacklist){
        return  res.status(400).json({
            message:"token is invalid"
        })
    }
    else
  try{
    const decode = jwt.verify(token,process.env.JWT_SECERT);
  if(decode){
    req.user = decode;
  }
  next();
  }
  catch(error){
       return res.status(401).json({
        message:"error"
       })
  }
}

module.exports = {getMe}