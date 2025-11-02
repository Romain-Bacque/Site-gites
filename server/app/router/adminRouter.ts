import express from "express";
import multer from "multer";
import { storage } from "../utilities/cloudinary";
import { checkLogged, csrfProtection } from "../middlewares";
import adminController from "../controllers/adminController";
import catchAsync from "../utilities/catchAsync";
import { validate } from "../validation/validate";
import { disabledDatesSchema } from "../validation/schemas";

const upload = multer({ storage });

const router = express.Router();

router.get(
  "/allBooking",
  checkLogged,
  catchAsync(adminController.getAllBooking)
);

router
  .route("/booking/:bookingId")
  .put(csrfProtection, checkLogged, catchAsync(adminController.updateBooking))
  .delete(
    csrfProtection,
    checkLogged,
    catchAsync(adminController.deleteBooking)
  );

router
  .route("/gallery")
  .get(catchAsync(adminController.getSheltersWithImages))
  .post(
    csrfProtection,
    checkLogged,
    upload.single("file"),
    catchAsync(adminController.addImage)
  );

router
  .route("/disabledDates")
  .post(
    csrfProtection,
    checkLogged,
    validate(disabledDatesSchema),
    catchAsync(adminController.addDisabledDate)
  )
  .delete(
    csrfProtection,
    checkLogged,
    validate(disabledDatesSchema),
    catchAsync(adminController.deleteDisabledDate)
  );

router.delete(
  "/gallery/:imageId",
  csrfProtection,
  checkLogged,
  catchAsync(adminController.deleteImage)
);

export default router;
