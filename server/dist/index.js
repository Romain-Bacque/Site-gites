"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./utilities/mongooseConnect");
const router_1 = __importDefault(require("./router"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Define a whitelist of allowed origins
// const whitelist = process.env.CORS_WHITELIST
//   ? process.env.CORS_WHITELIST.split(",").map((origin) => origin.trim())
//   : [];
// CORS options
const corsOptions = {
    origin: function (origin, // origin can be undefined for same-origin requests or tools like Postman
    callback // callback expects two parameters: error and boolean (true if allowed, false if not)
    ) {
        if (!origin)
            return callback(null, true);
        if (origin === process.env.CORS_ORIGIN) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-CSRF-Token'], // accept is 
    credentials: true, // Allow cookies and HTTP auth
    optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204 while preflighted requests
};
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)()); // use to parse cookies from the request headers
app.use(router_1.default);
exports.default = app;
