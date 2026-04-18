const mongoose = require("mongoose")
const { applyTimestamps } = require("./user.model")


const  blacklistSchema =  new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is blacklisted it is unauthorizied access"]
    }
},
{
    timestamps: true
  })

const tokenBlacklist = mongoose.model("blacklistToken",blacklistSchema);

module.exports = tokenBlacklist;