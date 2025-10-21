"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const ExpressError_1 = __importDefault(require("./ExpressError"));
const debug = (0, debug_1.default)("errorHandler");
const errorHandler = {
    /**
     * Method that triggers an error if a 'not found' error occurs
     */
    notFound(_, __, next) {
        next(new ExpressError_1.default("Not Found", 404));
    },
    /**
     * Method that manages all other errors
     */
    manage(err, _, res, __) {
        // creation of log file
        console.error(err);
        const now = new Date();
        const fileName = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.log`;
        const filePath = path_1.default.join(__dirname, `../../log/${fileName}`);
        const errorMessage = `${now.getHours()}:${now.getMinutes()} ${err}\r`;
        // Append the error message to the log file
        (0, fs_1.appendFile)(filePath, errorMessage, (error) => {
            if (error)
                debug(error);
        });
        res.sendStatus(500);
    },
};
exports.default = errorHandler;
