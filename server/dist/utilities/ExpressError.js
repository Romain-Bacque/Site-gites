"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExpressError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, ExpressError.prototype); // this used to add custom error class with the new features to the built-in Error class
    }
}
exports.default = ExpressError;
