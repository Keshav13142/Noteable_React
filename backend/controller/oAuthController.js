const asyncHandler = require("express-async-handler");
const { User, Session } = require("../models/models");
const jwt = require("jsonwebtoken");
const axios = require("axios");

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

  var { name, avatar_url, email, id } = userInfo.data;

  if (!email) email = id + "@gmail.com";

  var user = await User.findOne({ email });

  //Compare with the hashed password using bcrypt.compare
  if (!(await User.findOne({ email }))) {
    //Save the user in the database
    user = await User.create({
      name: name,
      email: email,
      authentication: "GitHub OAuth",
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

module.exports = { gitHubAuthRedirect };
