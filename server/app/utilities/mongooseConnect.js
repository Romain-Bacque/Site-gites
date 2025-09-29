"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const debug_1 = __importDefault(require("debug"));
const mongoose_1 = __importDefault(require("mongoose"));
(0, dotenv_1.config)();
const debug = (0, debug_1.default)("database");
const dbUrl = process.env.DB_URL;
if (!dbUrl) {
    throw new Error("DB_URL non définie dans le fichier .env");
}
mongoose_1.default.connect(dbUrl);
const database = mongoose_1.default.connection;
database.on("error", debug.bind(console, "Erreur de connexion :"));
database.once("open", () => {
    debug("✅ Connexion à MongoDB réussie");
});
