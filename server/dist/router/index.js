"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRouter_1 = __importDefault(require("./adminRouter"));
const authRouter_1 = __importDefault(require("./authRouter"));
const shelterRouter_1 = __importDefault(require("./shelterRouter"));
const errorHandler_1 = __importDefault(require("../utilities/errorHandler"));
const csurf_1 = __importDefault(require("csurf"));
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.use((0, csurf_1.default)({ cookie: true }));
router.use("/favicon.ico", (_, res) => res.sendStatus(200)); // Ignore favicon requests
router.use("/form", middlewares_1.createCSRFToken);
router.use("/", shelterRouter_1.default);
router.use("/authentification", authRouter_1.default);
router.use("/admin", adminRouter_1.default);
/**
 * gestion de la 404
 */
router.use(errorHandler_1.default.notFound);
/**
 * gestion des erreurs
 */
router.use(errorHandler_1.default.manage);
exports.default = router;
