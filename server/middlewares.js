const jwt = require("jsonwebtoken");

const checkLogged = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    res.status(401).json({
      message: "access unauthorized",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
    if (err) {
      res.status(401).json({
        message: "access unauthorized",
      });
    } else {
      next();
    }
  });
};

module.exports = {
  checkLogged,
};
