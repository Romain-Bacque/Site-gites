const { User } = require("../models");
const jwt = require("jsonwebtoken");

const cookieConfig = {
  expire: new Date(Date.now() + 900000),
  httpOnly: true,
  secure: false,
};

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3600s",
  });
};

const authController = {
  authentificationToken: function (req, res) {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        message: "access unauthorized",
      });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
      if (err) {
        return res.status(401).json({
          message: "access unauthorized",
        });
      }
      res.sendStatus(200);
    });
  },
  login: async function (req, res) {
    try {
      const { password, username } = req.body;
      const foundUser = await User.findAndValidate(password, username);
      if (foundUser) {
        const user = { password, username };

        const accessToken = generateAccessToken(user);

        res.cookie("accessToken", accessToken, cookieConfig).sendStatus(200);
      } else throw new Error();
    } catch (err) {
      console.trace(err);
      res.status(401).json({ message: err.message });
    }
  },
  register: async function (req, res) {
    try {
      const { password, username, email } = req.body;

      const userExist = await User.find({
        username,
        email,
      });

      if (userExist.length) throw new Error("This user already exists.");

      const newUser = new User({ username, password, email });
      await newUser.save();

      const accessToken = generateAccessToken({ username, email });
      res.cookie("accessToken", accessToken, cookieConfig).sendStatus(200);
    } catch (err) {
      console.trace(err);
      res.status(404).json({ message: err.message });
    }
  },
  logout: function (req, res) {
    if (req.cookies.accessToken) {
      res.clearCookie("accessToken").sendStatus(200);
    }
  },
};

module.exports = authController;
