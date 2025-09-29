"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = exports.User = exports.Rates = exports.Booking = exports.Shelter = void 0;
const shelter_1 = __importDefault(require("./shelter"));
exports.Shelter = shelter_1.default;
const booking_1 = __importDefault(require("./booking"));
exports.Booking = booking_1.default;
const rate_1 = __importDefault(require("./rate"));
exports.Rates = rate_1.default;
const user_1 = __importDefault(require("./user"));
exports.User = user_1.default;
const image_1 = __importDefault(require("./image"));
exports.Image = image_1.default;
