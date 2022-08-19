const express = require("express");
const adminRouter = require("./adminRouter");
const authRouter = require("./authRouter");
const gitesRouter = require("./gitesRouter");
const errorHandler = require("../utilities/errorHandler");
const router = express.Router();

router.use("/favicon.ico", (_, res) => res.sendStatus(200));

router.use("/", gitesRouter);
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

module.exports = router;
