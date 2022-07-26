const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const { errorHandler } = require("./middleware/errorHandler");
const jwtAuth = require("./middleware/authMiddleware");

const { login, register, logout } = require("./controller/userController");
const {
  getNotes,
  saveNote,
  deleteNote,
} = require("./controller/notesController");

mongoose.connect(process.env.MONGO_URL);

app.route("/login").post(login);
app.route("/register").post(register);

app.route("/notes").get(jwtAuth, getNotes).post(jwtAuth, saveNote);

app.post("/delete", jwtAuth, deleteNote);

app.post("/logout", jwtAuth, logout);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
