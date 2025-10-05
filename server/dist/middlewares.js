"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCSRFToken = exports.createCSRFToken = exports.checkLogged = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let csrfToken = null;
const checkLogged = (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (!token) {
        res.sendStatus(401); // Unauthorized if no token is present
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
        if (err) {
            res.sendStatus(401); // Unauthorized if token verification fails
        }
        else {
            next();
        }
    });
};
exports.checkLogged = checkLogged;
const createCSRFToken = (req, res) => {
    csrfToken = req.csrfToken(); // Generate a new CSRF token
    res.send({ csrfToken });
};
exports.createCSRFToken = createCSRFToken;
const checkCSRFToken = (req, res, next) => {
    if (!csrfToken ||
        !req.headers["x-csrf-token"] ||
        csrfToken !== req.headers["x-csrf-token"]) {
        res.sendStatus(403);
        return;
    }
    next();
};
exports.checkCSRFToken = checkCSRFToken;
