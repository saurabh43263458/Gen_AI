const express = require("express");
const authController = require("../controllers/auth.Controller")

const authRouter = express.Router();

 /**
  * @route POST /api/auth/register
  * @description register new user
  * @access Public
  */

 authRouter.post("/register",authController.registerUserController);

 /**
  * @route GET/api/auth/login
  * @description login user
  * @access public
  */
 authRouter.get("/login",authController.loginUserController);

module.exports =authRouter