import express from "express";
import authController from "../controllers/authController";
import { validate } from "../validation/validate";
import {
  registerSchema,
  loginSchema,
  passwordSchema,
  emailSchema,
  confirmEmailSchema,
  updatePasswordSchema,
} from "../validation/schemas";
import catchAsync from "../utilities/catchAsync";
import { csrfProtection, checkAuthenticated } from "../middlewares";

const router = express.Router();

router.get("/userVerification", authController.authenticationCheck);
router.get("/logout", authController.logout);
router.post("/verifyCaptcha", csrfProtection, catchAsync(authController.verifyRecaptcha));
router.post("/login", csrfProtection, validate(loginSchema), catchAsync(authController.login));
router.post(
  "/register",
  csrfProtection,
  validate(registerSchema),
  catchAsync(authController.register)
);
router.get(
  "/email-confirm",
  validate(confirmEmailSchema, "query"),
  catchAsync(authController.emailConfirmation)
);
router.post(
  "/forgot-password",
  csrfProtection,
  validate(emailSchema),
  catchAsync(authController.handleForgotPassword)
);
router.patch(
  "/reset-password/:id/:token",
  csrfProtection,
  validate(passwordSchema),
  catchAsync(authController.resetPassword)
);
router.patch(
  "/update-password",
  csrfProtection,
  checkAuthenticated,
  validate(updatePasswordSchema),
  catchAsync(authController.updatePassword)
);

export default router;
