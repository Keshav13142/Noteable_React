const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
require("dotenv").config();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const {
  login,
  register,
  getNotes,
  logout,
  saveNote,
  deleteNote,
} = require("./services/controller");
mongoose.connect(process.env.MONGO_URL);

const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(
  sessions({
    secret: process.env.SECRET,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

app
  .route("/login")
  .post(login)
  .get((req, res) => {
    res.render("login", {
      loggedIn: false,
      error: {},
    });
  });
app
  .route("/register")
  .get((req, res) => {
    res.render("register", {
      loggedIn: false,
      error: {},
    });
  })
  .post(register);

app.get("/", (_, res) => {
  res.redirect("/login");
});

app.get("/logout", logout);

app.route("/notes").get(getNotes).post(saveNote);

app.post("/delete", deleteNote);
app.listen(3000, () => {
  console.log(`Listening on port ${port}`);
});
