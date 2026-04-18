const userModel = require("../models/user.model");
const bcrypt =require("bcryptjs");
const jwt = require("jsonwebtoken")
const tokenBlacklist = require("../models/blacklist.model.js")
/**
 * @name registterUserContoller
 * @description register a new user , expects username,email aand password
 * @access public
 */
async function registerUserController(req,res){
    /* destructing the "requist" object for extrating the username,email,password*/
    const {username,email,password} = req.body;
    /* checking whether we get required detail about user before registering*/
    if(!username || !email || !password ){
         return res.status(400).json({
            message:"Please provide username, email, password"
         })
    }
    /**
     * checking whether username or email already taken 
     */
    const isUserAlreadyExist = await userModel.findOne({$or:[{username},{email}]})

    if(isUserAlreadyExist){
        if( username===isUserAlreadyExist.username){
        return res.status(409).json({
            message:"username is already taken"
        })
    }
    else if(email===isUserAlreadyExist.email){
        return res.status(409).json({
            message:"email is already exist"
        })
    }
    }
  
/** using bcrypt for hashing password  with cost factor*/
    const hash = await bcrypt.hash(password,10);
/** now creating user using userModel  */
    const User = userModel.create({
        username:username,
        email,email,
        password:hash
    })
/** generating token using jsonwebtoken , it involves user id and username as object and also JWT.SECERT and also expire Time */
    const token = jwt.sign({
        id:User._id,username:User.username
    },
    process.env.JWT_SECERT,
    {expiresIn:"1d"}
)
res.cookie("token",token);
return res.status(200).json({
    message:"user has been registered",
    user:{
        id:(await User)._id,
        name:User.username,
        email:(await User).email
    }
})
   
}
/**
 * @name loginUserController
 * @description for login a user 
 * @access public 
 */
async function loginUserController(req,res){
    const {email,password} = req.body
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).json({
            message:"user doesnot exist"
        })
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(401).json({
            message:"password doesnot match"
        })
    }
     const token = jwt.sign({
        id:user._id,
        username:user.username
     },
     process.env.JWT_SECERT,
     {expiresIn:"1d"}
    )
     res.cookie("token",token);
     return res.status(200).json({
        message:"user successfully login",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
     })
}
/**
 * @name logout
 * @description logout user and blacklist them
 * @access public
 */

async function logoutController(req,res){
    const token = req.cookies.token;

    if(token){
        await tokenBlacklist.create({token});
    }
    res.clearCookie("token");
    res.status(200).json({
        message:"User logged out successful"
    })
}


/**
 * @name getMe
 * @description get the detail of user 
 * @access private
 * 
 */
  async function getMe(req,res){
        const userdetail = await userModel.findOne({username:req.user.username})
        if(!userdetail){
            return res.status(400).json({
                message:"user doesnot exist"
            })
        }
        return res.status(200).json({
            user:{
                user:userdetail.username,
                email:userdetail.email,
            }})
   }
 
module.exports ={registerUserController,loginUserController,logoutController,getMe}