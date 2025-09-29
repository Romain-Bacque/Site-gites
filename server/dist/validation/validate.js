"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const debug_1 = __importDefault(require("debug"));
const ExpressError_1 = __importDefault(require("../utilities/ExpressError"));
const debugReqBody = (0, debug_1.default)("validate:requestBody");
const debugErr = (0, debug_1.default)("validate:error");
/**
 * Function to validate a part of the request (body, query, or params)
 * @param schema - Joi schema to heed
 * @param property - Which property to validate ('body', 'query', or 'params')
 */
const validate = (schema, property = "body") => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property]);
        if (error) {
            const message = error.details.map((elt) => elt.message).join(", ");
            debugReqBody(req[property]);
            debugErr(error);
            res.sendStatus(400);
            throw new ExpressError_1.default(message, 400);
        }
        else {
            next();
        }
    };
};
exports.validate = validate;
