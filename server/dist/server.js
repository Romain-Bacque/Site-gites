"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import debug from "debug";
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv"); // Load environment variables
const _1 = __importDefault(require("."));
(0, dotenv_1.config)(); // Load environment variables from .env file
const app = (0, express_1.default)();
const port = process.env.PORT ?? 3000;
app.use(_1.default);
app.listen(port, () => console.log(`listening on port ${port}`));
