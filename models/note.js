const mongoose = require("mongoose");
const { Schema } = mongoose;

const noteSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  tag: {
    type: String,
    default: "general",
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

const model = mongoose.model("note", noteSchema);
model.createIndexes();
module.exports = model;
