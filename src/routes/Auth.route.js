const express = require("express");
const authController = require("../controllers/auth.Controller")
const authMiddleware = require("../middleware/middleware")
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


 /**
  * @route POST/api/auth/logout
  * @description to logout 
  * @access public
  */

 authRouter.post("/logout",authController.logoutController)

 /**
  * @route POST/api/auth/logout
  * @description to get information about user
  * @access private
  */

 authRouter.post("/get-me",authMiddleware.getMe,authController.getMe)
  module.exports =authRouter