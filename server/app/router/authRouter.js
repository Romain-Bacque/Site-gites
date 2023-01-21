const authController = require("../controllers/authController");
const express = require("express");
const { validate } = require("../validation/validate");
const {
  registerSchema,
  loginSchema,
  passwordSchema,
  emailSchema,
} = require("../validation/schemas");
const catchAsync = require("../utilities/catchAsync");

const router = express.Router();

router.get("/userVerification", authController.authenticationCheck);
router.get("/logout", authController.logout);
router.post("/login", validate(loginSchema), catchAsync(authController.login));
router.post(
  "/register",
  validate(registerSchema),
  catchAsync(authController.register)
);
router.post(
  "/forgot-password",
  validate(emailSchema),
  catchAsync(authController.handleForgotPassword)
);
router.patch(
  "/reset-password/:id/:token",
  validate(passwordSchema),
  catchAsync(authController.resetPassword)
);

module.exports = router;
