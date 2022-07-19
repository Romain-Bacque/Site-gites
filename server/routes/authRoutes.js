const catchAsync = require("../utilities/catchAsync");
const authController = require("../controllers/authController");
const express = require("express");

const router = express.Router();

router.get("/userVerification", authController.authentificationToken);
router.get("/logout", authController.logout);
router.post("/login", catchAsync(authController.login));
router.post("/register", catchAsync(authController.register));

module.exports = router;
