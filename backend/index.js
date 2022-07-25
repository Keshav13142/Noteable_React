const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const {
  login,
  register,
  getNotes,
  saveNote,
  deleteNote,
} = require("./services/controller");

mongoose.connect(process.env.MONGO_URL);

app.route("/login").post(login);
app.route("/register").post(register);

app.route("/notes").get(getNotes).post(saveNote);

app.post("/delete", deleteNote);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
