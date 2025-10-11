import debugLib from "debug";
import { Request, Response, NextFunction, CookieOptions } from "express";
import jwt from "jsonwebtoken";
import path from "path";
import { User } from "../models";
import ExpressError from "../utilities/ExpressError";
import emailHandler from "../utilities/emailhandler";
import axios from "axios";

const debug = debugLib("controller:auth");

const redirectFn = (isValid: boolean) => {
  return `${process.env.CORS_ORIGIN}/admin/email-confirm?isValid=${isValid}`;
};

const getCookieConfig = (): CookieOptions => ({
  expires: new Date(Date.now() + 86400000), // 86400000ms = 24h
  httpOnly: true, // accessible only by web server
  secure: true,
  sameSite: "none",
});

const generateAccessToken = (user: object) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "24h",
  });
};

// Email sending helper
async function sendEmail({
  service,
  emailFrom,
  subject,
  templatePath,
  name,
  email,
  link,
}: {
  service: string;
  emailFrom: string;
  subject: string;
  templatePath: string;
  name: string;
  email: string;
  link: string;
}) {
  emailHandler.init({
    service,
    emailFrom,
    subject,
    template: templatePath,
  });

  await emailHandler.sendEmail({
    name,
    email,
    link,
  });
}

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

    const SECRET = process.env.ACCESS_TOKEN_SECRET as string;

    jwt.verify(token as string, SECRET, (err: any) => {
      if (err) {
        return res.status(401).redirect(redirectFn(false));
      } else {
        user.isEmailVerified = true;
        user.save();
        return res.status(200).redirect(redirectFn(true));
      }
    });
  },

  verifyRecaptcha: async function (req: Request, res: Response) {
    const { recaptchaToken } = req.body;

    try {
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
      );

      if (response.data.success) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(400).json({ success: false });
      }
    } catch (error) {
      return res.status(500).json({ success: false });
    }
  },

  login: async function (req: Request, res: Response) {
    const { password, username } = req.body;
    const user = await User.findAndValidate(password, username);

    if (!user || !user.isEmailVerified) return res.sendStatus(401);

    const userData = {
      password: user.password,
      username: user.username,
    };
    const accessToken = generateAccessToken(userData);

    if (!accessToken) {
      throw new ExpressError("no value in accessToken const", 500);
    }

    res
      .cookie("accessToken", accessToken, getCookieConfig())
      .status(200)
      .json({
        userData: {
          username: userData.username,
        },
      });
  },

  register: async function (req: Request, res: Response) {
    const { password, username, email } = req.body;
    const userExist = await User.find({ $or: [{ username }, { email }] });

    if (userExist.length) return res.sendStatus(409);

    const user = new User({ username, password, email });

    const accessToken = generateAccessToken({ id: user.id });
    const link = `http${process.env.NODE_ENV === "production" ? "s" : ""}://${
      process.env.HOST
    }:${process.env.PORT}/authentification/email-confirm?id=${
      user.id
    }&token=${accessToken}`;

    await sendEmail({
      service: "gmail",
      emailFrom: (process.env.EMAIL_FROM as string) || "",
      subject: "Email de confirmation",
      templatePath: path.join(
        __dirname,
        "../utilities/emailTemplate/confirmEmail.ejs"
      ),
      name: user.username,
      email: process.env.ADMIN_EMAIL as string,
      link,
    });

    await user.save();

    res.sendStatus(200);
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

    await sendEmail({
      service: "gmail",
      emailFrom: (process.env.EMAIL_FROM as string) || "",
      subject: "Réinitialisation du mot de passe",
      templatePath: path.join(
        __dirname,
        "../utilities/emailTemplate/resetPassword.ejs"
      ),
      name: user.username,
      email: process.env.ADMIN_EMAIL as string,
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
