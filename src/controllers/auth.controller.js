const {validationResult} = require("express-validator");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports.signUp = async (req, res) => {
    try {
      const errors = validationResult(req);
      if ( !errors.isEmpty()) {
        return res.status(400)
          .json({
            errors: errors.array()
          });
      }
      const userExists = await User.prototype.exists("email", req.body.email);
      if (userExists) {
        return res.status(400)
          .json({
            msg: "User with this email already exists"
          });
      }
  
      req.body.password = await bcrypt.hash(req.body.password, 11);
  
      const user = await (new User(req.body)).create();
      
      return res.status(201)
        .json({
          user: user,
          msg: "You have successfully registered"
        });
    } catch (e) {
      console.error(e);
      return res.status(500)
        .json({
          msg: e || "Server Error"
        });
    }
  };

module.exports.signIn = async (req, res) => {
    try {
      const errors = validationResult(req);
      if ( !errors.isEmpty()) {
        return res.status(400)
          .json({
            errors: errors.array()
          });
      }
  
      const user = await User.prototype.findByQuery("email", req.body.email);
      if ( !user) {
        return res.status(404)
          .json({
            msg: "Invalid email or password"
          });
      }
  
      const passIsCorrect = await bcrypt.compare(req.body.password, user.password);
      if ( !passIsCorrect) {
        return res.status(404)
          .json({
            msg: "Invalid email or password"
          });
      }
  
      if (user.status === User.STATUS_INACTIVE) {
        return res.status(403)
          .json({
            id: user.id,
            msg: "Your account has been deactivated"
          });
      }
  
      const token = jwt.sign({
        id: user.id,
        email: user.email
      }, config.get("JWT_SECRET"), {expiresIn: "2h"});
  
      return res.status(200)
        .json({
          token: token,
          msg: "You have successfully logged in"
        });
    } catch (e) {
      console.error(e);
      return res.status(500)
        .json({
          msg: "Server Error"
        });
    }
};