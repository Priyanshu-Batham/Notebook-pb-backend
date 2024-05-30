const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const noteModel = require("../models/note");

//CRUD API ENDPOINTS FOR NOTES GOES HERE

//ROUTE 1: Create Note
router.post(
  "/create",
  auth,
  [
    body("title").isLength({ min: 3 }),
    body("description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      //check if request body has proper title and description
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.send(errors);

      //creating the note record in database
      const note = await noteModel.create({
        userId: req.id,
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag,
      });

      console.log(note);
      return res.send(note);
    } catch (e) {
      return res.send(e.message);
    }
  }
);

//ROUTE 2: Read Note
router.post(
  "/read",
  auth,
  async (req, res) => {
    try {
      //middleware fun: auth() appended the userId from JWT Token
      const userId = req.id;

      //Fetching the notes of user whose userID we got from JWT token
      const notes = await noteModel.find({userId: userId});
      return res.send(notes);
    } catch (e) {
      return res.send(e.message);
    }
  }
);

module.exports = router;