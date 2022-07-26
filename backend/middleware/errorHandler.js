const errorHandler = (error, req, res, next) => {
  //check the status code of the error message .
  const status = res.statusCode ? res.statusCode : 400;
  res.status(status);
  res.json({
    error: {
      info: error.message,
      stack: process.env.NODE_ENV === "dev" ? error.stack : null,
    },
  });
};

module.exports = { errorHandler };
