import express from "express";
import adminRouter from "./adminRouter";
import authRouter from "./authRouter";
import shelterRouter from "./shelterRouter";
import errorHandler from "../utilities/errorHandler";
import csrf from "csurf";
import { createCSRFToken } from "../middlewares";

const router = express.Router();

router.use(csrf({ cookie: true }));

router.use("/favicon.ico", (_, res) => res.sendStatus(200)); // Ignore favicon requests
router.use("/form", createCSRFToken);
router.use("/", shelterRouter);
router.use("/authentification", () => console.log("authentification route"));
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
