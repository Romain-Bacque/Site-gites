import debugLib from "debug";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import path from "path";
import { User } from "../models";
import ExpressError from "../utilities/ExpressError";
import emailHandler from "../utilities/emailhandler";

const debug = debugLib("controller:auth");

const redirectFn = (isValid: boolean) => {
  return `/admin/email-confirm?isValid=${isValid}`;
};

const getCookieConfig = () => ({
  expires: new Date(Date.now() + 86400000), // 86400000ms = 24h
  httpOnly: true, // accessible only by web server
  secure: true,
});

const generateAccessToken = (user: object) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "24h",
  });
};

const authController = {
  authenticationCheck: function (req: Request, res: Response) {
    const token = req.cookies?.accessToken;

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any) => {
      if (err) {
        res.sendStatus(401);
      } else res.sendStatus(200);
    });
  },

  emailConfirmation: async function (req: Request, res: Response) {
    const { id, token } = req.query;

    if (!id || !token) {
      return res.status(401).redirect(redirectFn(false));
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(401).redirect(redirectFn(false));
    } else if (user.isEmailVerified) {
      return res.status(200).redirect(redirectFn(true));
    }

    const SECRET = process.env.SECRET as string;
    const secret = SECRET + user.password; // we combine the secret with the user's password to make sure the token is invalidated if the user changes their password

    jwt.verify(token as string, secret, (err: any) => {
      if (err) {
        return res.status(401).redirect(redirectFn(false));
      } else {
        user.isEmailVerified = true;
        user.save();
        return res.status(200).redirect(redirectFn(true));
      }
    });
  },

  login: async function (req: Request, res: Response) {
    const { password, username } = req.body;
    const foundedUser = await User.findAndValidate(password, username);

    if (!foundedUser) return res.sendStatus(401);

    const user = {
      password: foundedUser.password,
      username: foundedUser.username,
    };
    const accessToken = generateAccessToken(user);

    if (!accessToken)
      throw new ExpressError("no value in accessToken const", 500);

    res
      .cookie("accessToken", accessToken, getCookieConfig())
      .status(200)
      .json({
        userData: {
          username: user.username,
        },
      });
  },

  register: async function (req: Request, res: Response) {
    const { password, username, email } = req.body;
    const userExist = await User.find({ $or: [{ username }, { email }] });

    if (userExist.length) return res.sendStatus(409);

    const user = new User({ username, password, email });

    await user.save();

    const accessToken = generateAccessToken({ username, email });
    // I use id and token as query params to identify the user and verify the token is valid
    const link = `${process.env.HOST}/api/auth/email-confirm?id=${user.id}&token=${accessToken}`;

    emailHandler.init({
      service: "gmail",
      emailFrom: (process.env.ADMIN_EMAIL as string) || "",
      subject: "Email de confirmation",
      template: path.join(
        process.cwd(),
        "../utilities/emailTemplate/confirmPassword.ejs"
      ),
    });

    await emailHandler.sendEmail({
      name: user.username,
      email: user.email,
      link,
    });
  },

  logout: function (_: Request, res: Response) {
    res.clearCookie("accessToken").sendStatus(200);
  },

  async handleForgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.sendStatus(401);

    const JWT_SECRET = process.env.JWT_SECRET as string;
    const secret = JWT_SECRET + user.password;
    const payload = {
      id: user.id,
      email: user.email,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "24h" });
    const link = `${process.env.CORS_ORIGIN}/reset-password/${user.id}/${token}`;

    emailHandler.init({
      service: "gmail",
      emailFrom: (process.env.ADMIN_EMAIL as string) || "",
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

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { id, token } = req.params;
    const { password } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return res.sendStatus(401);
    }

    const SECRET = process.env.SECRET as string;
    const secret = SECRET + user.password;

    try {
      jwt.verify(token, secret);
    } catch (err) {
      return res.sendStatus(401);
    }

    const hashedPassword = await User.hashPassword(password);
    const isPasswordUpdated = await User.findByIdAndUpdate(id, {
      password: hashedPassword,
    });

    if (isPasswordUpdated) {
      res.sendStatus(200);
    } else next();
  },
};

export default authController;
