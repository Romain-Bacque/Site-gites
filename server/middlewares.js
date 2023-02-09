const jwt = require("jsonwebtoken");

const checkLogged = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    res.json({
      ok: false,
      status: 401,
      message: "access unauthorized",
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
    if (err) {
      res.json({
        ok: false,
        status: 401,
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
