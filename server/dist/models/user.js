"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: [true, "Username cannot be blank"],
    },
    password: {
        type: String,
        required: [true, "Password cannot be blank"],
    },
    email: {
        type: String,
        required: [true, "Email cannot be blank"],
        unique: true,
    },
    role: {
        type: String,
        required: [true, "Role cannot be blank"],
        default: "customer",
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
});
// Static method to compare passwords
userSchema.statics.findAndValidate = async function (password, username) {
    const foundedUser = await this.findOne({ username });
    if (!foundedUser)
        return false;
    const isValid = await bcrypt_1.default.compare(password, foundedUser.password);
    return isValid ? foundedUser : false;
};
// Static method to hash password
userSchema.statics.hashPassword = async function (plainTextPassword) {
    return await bcrypt_1.default.hash(plainTextPassword, 10);
};
// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt_1.default.hash(this.password, 12);
    next();
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
