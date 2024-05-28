const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user')

//api to fetch users using GET on '/getusers'
router.get('/getusers', async (req, res)=>{
  const data = await userModel.find();
  res.send(data);
})


//api to create a user using POST on '/createuser'
router.post("/createuser",[
  body('name').isLength({min: 3}),
  body('email').isEmail(),
  body('password').isLength({min: 5})
],
 (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.send(errors);
  }
  
  userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }).then((user)=>{
    console.log(user);
    res.json(user);
  }).catch((e)=>{
    res.send(e.message);
  });
});

module.exports = router;
