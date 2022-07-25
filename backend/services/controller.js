const bcrypt = require("bcrypt");
const { User, Note } = require("../models/models");

const register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(401).json({
      error: {
        status: true,
        message: "Mandatory fields are missing!",
        info: "Please enter all the details",
      },
    });
  } else {
    if (await User.findOne({ email })) {
      res.status(401).json({
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
      res.status(200).json({
        name: user.name,
        _id: user._id,
      });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401).json({
      error: {
        status: true,
        message: "Invalid credentials!!",
        info: "Please check you email and password!",
      },
    });
  } else {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        name: user.name,
        _id: user._id,
      });
    } else
      res.status(401).json({
        error: {
          status: true,
          message: "Invalid credentials!!",
          info: "Please check you email and password!",
        },
      });
  }
};

const getNotes = async (req, res) => {
  const user = JSON.parse(req.headers.user);
  if (user) {
    const notes = await Note.find({ user_id: user._id });
    res.status(200).json(notes);
  } else {
    res.status(401).json({
      error: {
        status: true,
        message: "Access denied",
        info: "Please login to perform this action!",
      },
    });
  }
};

const saveNote = async (req, res) => {
  const { title, content } = req.body;
  const user = await JSON.parse(req.headers.user);
  if (!user) {
    res.status(401).json({
      error: {
        status: true,
        message: "Access denied",
        info: "Please login to perform this action!",
      },
    });
  } else {
    const note = await Note.create({
      user_id: user._id,
      title: title.trim(),
      content: content.trim(),
    });
    res.status(200).json({
      note: note,
    });
  }
};

const deleteNote = async (req, res) => {
  const user = await JSON.parse(req.headers.user);
  if (!user) {
    res.status(401).json({
      error: {
        status: true,
        message: "Access denied",
        info: "Please login to perform this action!",
      },
    });
  } else {
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
  }
};
module.exports = { register, login, getNotes, saveNote, deleteNote };
