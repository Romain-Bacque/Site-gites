const debug = require("debug")("controller:auth");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const ExpressError = require("../utilities/ExpressError");
const emailHandler = require("../utilities/emailhandler");
const path = require("path");

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
      debug(err);
      next(err);
    }
  },
  register: async function (req, res, next) {
    try {
      const { password, username, email } = req.body;

      const userExist = await User.find({ $or: [{ username }, { email }] });

      if (userExist.length)
        throw new ExpressError("This user already exists", 409);

      const newUser = new User({ username, password, email });
      await newUser.save();

      const accessToken = generateAccessToken({ username, email });
      res.cookie("accessToken", accessToken, cookieConfig).sendStatus(200);
    } catch (err) {
      debug(err);
      next(err);
    }
  },
  logout: function (req, res) {
    if (req.cookies.accessToken) {
      res.clearCookie("accessToken").sendStatus(200);
    }
  },
  async handleForgotPassword(req, res) {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Check if user exists in database thanks to its email address
    if (!user) {
      return res.status(401).json({ message: "user is not registered" });
    }

    const { JWT_SECRET } = process.env;
    const secret = JWT_SECRET + user.password; // user password is used in the secret to prevent reset link reusability
    const payload = {
      id: user.id,
      email: user.email,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "24h" });
    const link = `${process.env.CORS_ORIGIN}/reset-password/${user.id}/${token}`;

    emailHandler.init({
      service: "gmail",
      emailFrom: "biere.de.ta.region@gmail.com",
      subject: "Réinitialisation du mot de passe",
      template: path.join(
        __dirname,
        "../utilities/emailTemplate/resetPassword.ejs"
      ),
    });

    await emailHandler.sendEmail({
      name: user.username,
      email: "bacqueromain@orange.fr",
      link,
    });
    res.sendStatus(200);
  },
  async resetPassword(req, res) {
    const { id, token } = req.params;
    const { password } = req.body;
    const user = await User.findById(id);
    // Check if the user exists in database thanks to its ID
    if (!user) {
      return res.sendStatus(401);
    }

    const { SECRET } = process.env;
    const secret = SECRET + user.password; // user password is use in the secret to prevent reset link reusability

    jwt.verify(token, secret, (err) => {
      if (err) {
        return res.sendStatus(401);
      }
    });

    const hashedPassword = await User.hashPassword(password);
    const isPasswordUpdated = await User.findByIdAndUpdate(id, {
      password: hashedPassword,
    });

    if (isPasswordUpdated) {
      res.sendStatus(200);
    } else next();
  },
};

module.exports = authController;
