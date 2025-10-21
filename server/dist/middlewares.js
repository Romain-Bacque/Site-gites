"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCSRFToken = exports.checkLogged = exports.csrfProtection = void 0;
const csurf_1 = __importDefault(require("csurf"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.csrfProtection = (0, csurf_1.default)({
    cookie: {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    },
});
// Vérifie que l'utilisateur est connecté
const checkLogged = (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (!token)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
        if (err)
            return res.sendStatus(401);
        next();
    });
};
exports.checkLogged = checkLogged;
// Génère un nouveau token et le renvoie au client
const createCSRFToken = (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", req.csrfToken(), {
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
        sameSite: "none",
    });
    res.status(200).json({ csrfToken });
};
exports.createCSRFToken = createCSRFToken;
