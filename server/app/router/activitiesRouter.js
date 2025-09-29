"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const catchAsync_1 = __importDefault(require("../utilities/catchAsync"));
const router = (0, express_1.Router)();
router.get("/", (0, catchAsync_1.default)(middlewares_1.getActivities));
exports.default = router;
