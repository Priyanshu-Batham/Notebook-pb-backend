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
  [body("title").isLength({min: 1}), body("description").isLength({min: 1})],
  async (req, res) => {
    try {
      //check if request body has proper title and description
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.json({ error: "Title and description should not be empty" });

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
router.post("/read", auth, async (req, res) => {
  try {
    //middleware fun: auth() appended the userId from JWT Token
    const userId = req.id;

    //Fetching the notes of user whose userID we got from JWT token
    const notes = await noteModel.find({ userId: userId });
    return res.send(notes);
  } catch (e) {
    return res.send(e.message);
  }
});

//ROUTE 3: Update Note
router.put(
  "/update:noteId",
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

      //fetch the note from req.params.id given in request url
      const noteId = req.params.noteId;

      //check if the note is of this user or he's tryna update someone else's note
      let note = await noteModel.findOne({ _id: noteId });
      if (req.id.toString() !== note.userId.toString())
        return res.send("Not your Note Nigga");

      //if all above conditions are passed that means its safe to update the note
      await noteModel.updateOne(
        { _id: noteId },
        {
          title: req.body.title,
          description: req.body.description,
          tag: req.body.tag,
        }
      );

      note = await noteModel.findOne({ _id: noteId });

      console.log(note);
      return res.send(note);
    } catch (e) {
      return res.send(e.message);
    }
  }
);

//ROUTE 4: Delete Note
router.delete("/delete:noteId", auth, async (req, res) => {
  try {
    //fetch the note id from req.params.id given in request url
    const noteId = req.params.noteId;

    //check if the note is of this user or he's tryna update someone else's note
    let note = await noteModel.findOne({ _id: noteId });
    if (req.id.toString() !== note.userId.toString())
      return res.send("Not your Note Nigga");

    //if all above conditions are passed that means its safe to delete the note
    const dbAck = await noteModel.deleteOne({ _id: noteId });

    console.log(dbAck);
    return res.send(dbAck);
  } catch (e) {
    return res.send(e.message);
  }
});

//ROUTE 5: Get Specific Note to Read
router.get("/getThisOne:noteId", async (req, res) => {
  try {
    //fetch the note id from req.params.id given in request url
    const noteId = req.params.noteId;

    //check if the note is present in database
    let note = await noteModel.findOne({ _id: noteId });

    //if note is not found return error
    if (!note) return res.json({ error: "note not found" });

    //else return the note
    console.log(note);
    return res.send(note);
  } catch (e) {
    //if any error occurs send error message
    return res.send(e.message);
  }
});

module.exports = router;
