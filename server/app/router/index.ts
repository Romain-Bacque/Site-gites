import express from "express";
import adminRouter from "./adminRouter";
import authRouter from "./authRouter";
import shelterRouter from "./shelterRouter";
import errorHandler from "../utilities/errorHandler";
import csrf from "csurf";
import { createCSRFToken } from "../middlewares";

const router = express.Router();

// const csrfProtection = csrf({ cookie: true });

// router.use(csrfProtection);
router.use("/form", createCSRFToken);
router.use("/favicon.ico", (_, res) => res.sendStatus(200)); // Ignore favicon requests
router.use("/", shelterRouter);
router.use("/authentification", authRouter);
router.use("/admin", adminRouter);

/**
 * gestion de la 404
 */
router.use(errorHandler.notFound);

/**
 * gestion des erreurs
 */
router.use(errorHandler.manage);

export default router;
