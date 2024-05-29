const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const userModel = require("../models/user");
require('dotenv').config();

//api to fetch users using GET on '/getusers'
router.get("/getusers", async (req, res) => {
  const data = await userModel.find();
  res.send(data);
});

//api to create a user using POST on '/createuser'
router.post(
  "/createuser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //check if request body has proper name email and password
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

      //generating the jwt token based on user.id to send back to user
      var token = jwt.sign({"id":user.id, "name": user.name}, process.env.JWT_SIGN);

      console.log(token);
      res.json({'authToken': token});
    } catch (e) {
      console.log(e.message);
      res.send(e.message);
    }
  }
);

module.exports = router;
