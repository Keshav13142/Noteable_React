const { Note } = require("../models/models");
const asyncHandler = require("express-async-handler");

const getNotes = asyncHandler(async (req, res) => {
  const user = req.user;
  const notes = await Note.find({ user_id: user._id });
  res.status(200).json(notes);
});

const saveNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const user = req.user;
  const note = await Note.create({
    user_id: user._id,
    title: title.trim(),
    content: content.trim(),
  });
  res.status(200).json({
    note: note,
  });
});

const deleteNote = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user._id != req.body.uid) {
    res.status(401).json({
      error: {
        status: true,
        message: "Access denied",
        info: "Please login to perform this action!",
      },
    });
  } else {
    await Note.deleteOne({ _id: req.body.id });
    res.status(200).json({
      message: "Note deleted successfully",
    });
  }
});

module.exports = { getNotes, saveNote, deleteNote };
