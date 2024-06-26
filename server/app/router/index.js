const express = require("express");
const adminRouter = require("./adminRouter");
const activitiesRouter = require("./activitiesRouter");
const authRouter = require("./authRouter");
const shelterRouter = require("./shelterRouter");
const errorHandler = require("../utilities/errorHandler");
const router = express.Router();
const csrf = require("csurf");
const { createCSRFToken } = require("../middlewares");

router.use(csrf({ cookie: true }));

router.use("/favicon.ico", (_, res) => res.sendStatus(200));
router.use("/form", createCSRFToken);
router.use("/", shelterRouter);
router.use("/authentification", authRouter);
router.use("/admin", adminRouter);
router.use("/activities", activitiesRouter);

/**
 * gestion de la 404
 */
router.use(errorHandler.notFound);

/**
 * gestion des erreurs
 */
router.use(errorHandler.manage);

module.exports = router;
