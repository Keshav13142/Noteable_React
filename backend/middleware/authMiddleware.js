const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { User, Session } = require("../models/models");
const authentication = asyncHandler(async (req, res, next) => {
  //get the auth header from the request
  const authHeader = req.headers.authorization;

  //check if the auth header starts with "Bearer ....token"
  if (authHeader && authHeader.startsWith("Bearer")) {
    //extract the token from the header
    const token = authHeader.split(" ")[1];
    if ((await Session.findOne({ token: token })) != null) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        if (userId) {
          const user = await User.findById(userId).select("-password");
          req.user = user;
          next();
        } else {
          res.status(401);
          throw new Error("Session has expired");
        }
        if (!token) {
          res.status(401);
          throw new Error("Session has expired");
        }
      } catch (err) {
        throw new Error(err);
      }
    } else {
      res.status(401);
      throw new Error("Session has expired");
    }
  } else {
    res.status(401);
    throw new Error("Session has expired");
  }
});

module.exports = authentication;
