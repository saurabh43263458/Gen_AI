const express = require("express");
const app = express();

//  Data that is coming from clients is in raw format this express.json() convert's that into JSON format and add it into req.body

app.use(express.json())

/** import authroute we have created  */

const authRouter = require("./routes/Auth.route");


/** creating base route for entire routes of authRoute all the requirst that are coing to this base route will be directed this authRouter */

app.use("/api/auth",authRouter);


module.exports =app