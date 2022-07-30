const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT;
const { errorHandler } = require("./middleware/errorHandler");
const jwtAuth = require("./middleware/authMiddleware");

//Tell express to use the json() middleware to process requests
app.use(express.json());

//Import all the necessary functions
const { login, register, logout } = require("./controller/userController");
const {
  getNotes,
  saveNote,
  deleteNote,
  updateNote,
} = require("./controller/notesController");

//Connect with the database
mongoose.connect(process.env.MONGO_URL);

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "prod") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (_, res) => {
    res.send("API is runnning successfully!!");
  });
}

//Define all the routes
app.route("/login").post(login);

app.route("/register").post(register);

//These routes require JWT tokens to gain access to the notes
app.route("/notes").get(jwtAuth, getNotes).post(jwtAuth, saveNote);

app.post("/update", jwtAuth, updateNote);

app.post("/delete", jwtAuth, deleteNote);

app.post("/logout", jwtAuth, logout);

//Tell express to use the custom Error handling middleware => Do this after defining all the routes
app.use(errorHandler);

// -------------------------------Deployment---------------------------------------

// -------------------------------Deployment---------------------------------------

//Tell express to listen at specified PORT
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
