const bcrypt = require("bcrypt");
const e = require("express");
const { User, Note } = require("../models/models");

const register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.render("register", {
      title: "Register",
      loggedIn: false,
      error: {
        status: true,
        message: "Mandatory fields are empty!!",
        info: "Please enter all the required details",
      },
    });
  } else {
    if (await User.findOne({ email })) {
      res.render("register", {
        title: "Register",
        loggedIn: false,
        error: {
          status: true,
          message: "Email already exists!!",
          info: "Try logging in if you already have an account",
        },
      });
    } else {
      const hashPass = await bcrypt.hash(password, 10);
      const user = await User.create({
        name: name,
        email: email,
        password: hashPass,
      });
      req.session.user = user;
      res.redirect("/notes");
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.render("login", {
      title: "Login",
      loggedIn: false,
      error: {
        status: true,
        message: "Invalid credentials!!",
        info: "Please check you email and password!",
      },
    });
  } else {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = { name: user.name, _id: user._id };
      res.redirect("notes");
    } else
      res.render("login", {
        title: "Login",
        loggedIn: false,
        error: {
          status: true,
          message: "Invalid credentials!!",
          info: "Please check you email and password!",
        },
      });
  }
};

const getNotes = async (req, res) => {
  const user = req.session.user;
  if (user) {
    const notes = await Note.find({ user_id: req.session.user._id });
    res.render("notes", {
      name: user.name,
      title: "My notes",
      loggedIn: true,
      error: {},
      notes: notes,
    });
  } else {
    res.redirect("login");
  }
};

const logout = (req, res) => {
  req.session.user = null;
  res.redirect("login");
};

const saveNote = async (req, res) => {
  const { title, content } = req.body;
  if (!req.session.user) {
    res.redirect("/logout");
  } else {
    const note = await Note.create({
      user_id: req.session.user._id,
      title: title.trim(),
      content: content.trim(),
    });
    res.redirect("/notes");
  }
};

const deleteNote = async (req, res) => {
  if (!req.session.user) {
    res.redirect("/logout");
  } else {
    if (req.session.user._id != req.body.uid) res.redirect("/logout");
    else {
      await Note.deleteOne({ _id: req.body.id });
      res.redirect("/notes");
    }
  }
};
module.exports = { register, login, getNotes, logout, saveNote, deleteNote };
