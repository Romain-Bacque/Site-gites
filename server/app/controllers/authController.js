const { User } = require("../models");
const jwt = require("jsonwebtoken");
const ExpressError = require("../utilities/ExpressError");

const cookieConfig = {
  expires: new Date(Date.now() + 900000),
  httpOnly: true,
  secure: true,
};

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1y",
  });
};

const authController = {
  authentificationToken: function (req, res) {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new ExpressError("access unauthorized", 401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
      if (err) {
        throw new ExpressError("access unauthorized", 401);
      }
      res.sendStatus(200);
    });
  },
  login: async function (req, res, next) {
    try {
      const { password, username } = req.body;
      const foundUser = await User.findAndValidate(password, username);
      if (foundUser) {
        const user = { password, username };

        const accessToken = generateAccessToken(user);

        res.cookie("accessToken", accessToken, cookieConfig).sendStatus(200);
      } else throw new ExpressError("access unauthorized", 401);
    } catch (err) {
      console.trace(err);
      next(err);
    }
  },
  register: async function (req, res, next) {
    try {
      const { password, username, email } = req.body;

      const userExist = await User.find({
        username,
        email,
      });

      if (userExist.length)
        throw new ExpressError("This user already exists", 409);

      const newUser = new User({ username, password, email });
      await newUser.save();

      const accessToken = generateAccessToken({ username, email });
      res.cookie("accessToken", accessToken, cookieConfig).sendStatus(200);
    } catch (err) {
      console.trace(err);
      next(err);
    }
  },
  logout: function (req, res) {
    if (req.cookies.accessToken) {
      res.clearCookie("accessToken").sendStatus(200);
    }
  },
};

module.exports = authController;
