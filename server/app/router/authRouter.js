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
const { checkCSRFToken } = require("../middlewares");

const router = express.Router();

router.get("/userVerification", authController.authenticationCheck);
router.get("/logout", authController.logout);
router.post(
  "/login",
  checkCSRFToken,
  validate(loginSchema),
  catchAsync(authController.login)
);
router.post(
  "/register",
  checkCSRFToken,
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
  checkCSRFToken,
  validate(passwordSchema),
  catchAsync(authController.resetPassword)
);

module.exports = router;
