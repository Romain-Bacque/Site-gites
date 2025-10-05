"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const models_1 = require("../models");
const ExpressError_1 = __importDefault(require("../utilities/ExpressError"));
const emailhandler_1 = __importDefault(require("../utilities/emailhandler"));
const axios_1 = __importDefault(require("axios"));
const debug = (0, debug_1.default)("controller:auth");
const redirectFn = (isValid) => {
    return `${process.env.CORS_ORIGIN}/admin/email-confirm?isValid=${isValid}`;
};
const getCookieConfig = () => ({
    expires: new Date(Date.now() + 86400000), // 86400000ms = 24h
    httpOnly: true, // accessible only by web server
    secure: true,
});
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "24h",
    });
};
// Email sending helper
async function sendEmail({ service, emailFrom, subject, templatePath, name, email, link, }) {
    emailhandler_1.default.init({
        service,
        emailFrom,
        subject,
        template: templatePath,
    });
    await emailhandler_1.default.sendEmail({
        name,
        email,
        link,
    });
}
const authController = {
    authenticationCheck: function (req, res) {
        const token = req.cookies?.accessToken;
        if (!token)
            return res.sendStatus(401);
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
            if (err) {
                res.sendStatus(401);
            }
            else
                res.sendStatus(200);
        });
    },
    emailConfirmation: async function (req, res) {
        const { id, token } = req.query;
        if (!id || !token) {
            return res.status(401).redirect(redirectFn(false));
        }
        const user = await models_1.User.findById(id);
        if (!user) {
            return res.status(401).redirect(redirectFn(false));
        }
        else if (user.isEmailVerified) {
            return res.status(200).redirect(redirectFn(true));
        }
        const SECRET = process.env.ACCESS_TOKEN_SECRET;
        jsonwebtoken_1.default.verify(token, SECRET, (err) => {
            if (err) {
                return res.status(401).redirect(redirectFn(false));
            }
            else {
                user.isEmailVerified = true;
                user.save();
                return res.status(200).redirect(redirectFn(true));
            }
        });
    },
    verifyRecaptcha: async function (req, res) {
        const { recaptchaToken } = req.body;
        try {
            const response = await axios_1.default.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`);
            if (response.data.success) {
                return res.status(200).json({ success: true });
            }
            else {
                return res.status(400).json({ success: false });
            }
        }
        catch (error) {
            return res.status(500).json({ success: false });
        }
    },
    login: async function (req, res) {
        const { password, username } = req.body;
        const user = await models_1.User.findAndValidate(password, username);
        if (!user || !user.isEmailVerified)
            return res.sendStatus(401);
        const userData = {
            password: user.password,
            username: user.username,
        };
        const accessToken = generateAccessToken(userData);
        if (!accessToken) {
            throw new ExpressError_1.default("no value in accessToken const", 500);
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
    register: async function (req, res) {
        const { password, username, email } = req.body;
        const userExist = await models_1.User.find({ $or: [{ username }, { email }] });
        if (userExist.length)
            return res.sendStatus(409);
        const user = new models_1.User({ username, password, email });
        const accessToken = generateAccessToken({ id: user.id });
        const link = `http${process.env.NODE_ENV === "production" ? "s" : ""}://${process.env.HOST}:${process.env.PORT}/authentification/email-confirm?id=${user.id}&token=${accessToken}`;
        await sendEmail({
            service: "gmail",
            emailFrom: process.env.EMAIL_FROM || "",
            subject: "Email de confirmation",
            templatePath: path_1.default.join(__dirname, "../utilities/emailTemplate/confirmEmail.ejs"),
            name: user.username,
            email: process.env.ADMIN_EMAIL,
            link,
        });
        await user.save();
        res.sendStatus(200);
    },
    logout: function (_, res) {
        res.clearCookie("accessToken").sendStatus(200);
    },
    async handleForgotPassword(req, res) {
        const { email } = req.body;
        const user = await models_1.User.findOne({ email });
        if (!user)
            return res.sendStatus(401);
        const JWT_SECRET = process.env.JWT_SECRET;
        const secret = JWT_SECRET + user.password;
        const payload = {
            id: user.id,
            email: user.email,
        };
        const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "24h" });
        const link = `${process.env.CORS_ORIGIN}/reset-password/${user.id}/${token}`;
        await sendEmail({
            service: "gmail",
            emailFrom: process.env.EMAIL_FROM || "",
            subject: "Réinitialisation du mot de passe",
            templatePath: path_1.default.join(__dirname, "../utilities/emailTemplate/resetPassword.ejs"),
            name: user.username,
            email: process.env.ADMIN_EMAIL,
            link,
        });
        res.sendStatus(200);
    },
    async resetPassword(req, res, next) {
        const { id, token } = req.params;
        const { password } = req.body;
        const user = await models_1.User.findById(id);
        if (!user) {
            return res.sendStatus(401);
        }
        const SECRET = process.env.SECRET;
        const secret = SECRET + user.password;
        try {
            jsonwebtoken_1.default.verify(token, secret);
        }
        catch (err) {
            return res.sendStatus(401);
        }
        const hashedPassword = await models_1.User.hashPassword(password);
        const isPasswordUpdated = await models_1.User.findByIdAndUpdate(id, {
            password: hashedPassword,
        });
        if (isPasswordUpdated) {
            res.sendStatus(200);
        }
        else
            next();
    },
};
exports.default = authController;
