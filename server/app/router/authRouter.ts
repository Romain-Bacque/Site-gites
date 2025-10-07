import express from "express";
import authController from "../controllers/authController";
import { validate } from "../validation/validate";
import {
  registerSchema,
  loginSchema,
  passwordSchema,
  emailSchema,
  confirmEmailSchema,
} from "../validation/schemas";
import catchAsync from "../utilities/catchAsync";
import { checkCSRFToken } from "../middlewares";

const router = express.Router();

router.get("/userVerification", checkCSRFToken, authController.authenticationCheck);
router.get("/logout", checkCSRFToken, authController.logout);
router.post("/verifyCaptcha", checkCSRFToken, catchAsync(authController.verifyRecaptcha));
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
router.get(
  "/email-confirm",
  checkCSRFToken,
  validate(confirmEmailSchema, "query"),
  catchAsync(authController.emailConfirmation)
);
router.post(
  "/forgot-password",
  checkCSRFToken,
  validate(emailSchema),
  catchAsync(authController.handleForgotPassword)
);
router.patch(
  "/reset-password/:id/:token",
  checkCSRFToken,
  validate(passwordSchema),
  catchAsync(authController.resetPassword)
);

export default router;
