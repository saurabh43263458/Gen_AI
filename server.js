// dotenv and config() function used for loading environment variables from .env file into process.env
require("dotenv").config()
const app = require("./src/app");
const connectToDb = require("./src/config/database");

// used for connecting to data
connectToDb();

// listen  function start server and make it listen the request.
app.listen(3000,()=>{
    console.log("server has been created")
})