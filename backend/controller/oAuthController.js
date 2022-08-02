const asyncHandler = require("express-async-handler");
const { OAuth2Client } = require("google-auth-library");
const { login } = require("./userController");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuthRedirect = asyncHandler(async (req, res) => {
  const {
    token: { access_token },
  } = req.body;

  console.log(access_token.substring(5));
  const ticket = await client.verifyIdToken({
    idToken: access_token.substring(5),
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  console.log(ticket);
  const { name, email, picture } = ticket.getPayload();

  console.log(name, email);
  res.json({ hello: "ji" });
});

module.exports = { googleAuthRedirect };
