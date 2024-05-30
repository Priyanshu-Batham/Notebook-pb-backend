const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const auth = require('../middleware/auth')
require("dotenv").config();

//ROUTE 1: LogIn | validates email password | returns JWT token
router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  async (req, res) => {
    try {
      //check if request body has proper email and password
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.send(errors);

      //looking up the database for user
      const user = await userModel.findOne({ email: req.body.email });

      //No user found with corresponding Email
      if (!user) return res.send("Incorrect Credentials");

      //User found in the database so now we match password
      bcrypt.compare(req.body.password, user.password, function (err, result) {
        //if some server error happens
        if (err) {
          console.log(err);
          return res.send(err);
        }

        //If passwords don't match
        if (!result) return res.send("Incorrect Credentials");

        //Passwords match so we return a JWT so that user don't have to login again
        //generating the jwt token based on user.id and user.name to send back to user
        var token = jwt.sign(
          { id: user.id, name: user.name },
          process.env.JWT_SIGN
        );

        res.json({ authToken: token });
      });
    } catch (e) {
      res.send(e.message);
    }
  }
);

//ROUTE 2: SignUp | creates a user | returns JWT token
router.post(
  "/signup",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //check if request body has proper name, email and password
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.send(errors);

    try {
      //salting the password before storing in database
      const salt = await bcrypt.genSalt(10);
      const saltedPass = await bcrypt.hash(req.body.password, salt);

      //creating the user record in database
      const user = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        password: saltedPass,
      });

      //generating the jwt token based on user.id and user.name to send back to user
      var token = jwt.sign(
        { id: user.id, name: user.name },
        process.env.JWT_SIGN
      );

      console.log(token);
      res.json({ authToken: token });
    } catch (e) {
      console.log(e.message);
      res.send(e.message);
    }
  }
);

//ROUTE 3: Authentication | Fetches User | returns User Data
router.post('/auth', auth, async(req, res)=>{
  try{
    const userId = req.id;
    const user = await userModel.findOne({_id: userId});
    if(user) return res.json({user: user});
    else return res.json({error: "No user found with this Token"});
  }
  catch(e){
    return res.json({error: e});
  }
})


module.exports = router;
