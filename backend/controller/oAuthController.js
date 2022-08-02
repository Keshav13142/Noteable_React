const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { User, Session } = require("../models/models");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const googleAuthRedirect = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const data = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`
  );

  const { name, email, picture } = data.data;

  var user = await User.findOne({ email });

  //Compare with the hashed password using bcrypt.compare
  if (!(await User.findOne({ email }))) {
    const hashPass = await bcrypt.hash(ticket.getUserId(), 10);

    //Save the user in the database
    user = await User.create({
      name: name,
      email: email,
      password: hashPass,
    });
  }
  res.status(200).json({
    name: name,
    avatar_url: picture,
    token: genereateToken(user._id),
  });
});

const gitHubAuthRedirect = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const response = await axios.post(
    `https://github.com/login/oauth/access_token`,
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
    }
  );
  const access_token = response.data.split("&")[0].substring(13);
  const config = { headers: { Authorization: "token " + access_token } };
  const userInfo = await axios.get("https://api.github.com/user", config);
  var { name, avatar_url, email, id, node_id } = userInfo.data;
  if (!email) email = id + "@gmail.com";

  var user = await User.findOne({ email });

  //Compare with the hashed password using bcrypt.compare
  if (!(await User.findOne({ email }))) {
    const hashPass = await bcrypt.hash(node_id, 10);

    //Save the user in the database
    user = await User.create({
      name: name,
      email: email,
      password: hashPass,
    });
  }
  res.status(200).json({
    name: name,
    avatar_url: avatar_url,
    token: genereateToken(user._id),
  });
});

const genereateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

  //Save the session details in the database
  Session.create({
    user_id: id,
    token: token,
  });

  return token;
};

module.exports = { googleAuthRedirect, gitHubAuthRedirect };
