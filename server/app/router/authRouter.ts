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

router.get("/userVerification", authController.authenticationCheck);
router.get("/logout", authController.logout);
router.post("/verify-captcha", () => {
  console.log("test");
});
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
  validate(confirmEmailSchema, "query"),
  catchAsync(authController.emailConfirmation)
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

export default router;
