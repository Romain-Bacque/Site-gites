import express from "express";
import multer from "multer";
import { storage } from "../utilities/cloudinary";
import { checkLogged } from "../middlewares";
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
  .put(checkLogged, catchAsync(adminController.acceptBooking))
  .delete(checkLogged, catchAsync(adminController.deleteBooking));

router
  .route("/gallery")
  .get(catchAsync(adminController.getImages))
  .post(
    checkLogged,
    upload.single("file"),
    catchAsync(adminController.addImage)
  );

router
  .route("/disabledDates")
  .post(
    checkLogged,
    validate(disabledDatesSchema),
    catchAsync(adminController.addDisabledDate)
  )
  .delete(
    checkLogged,
    validate(disabledDatesSchema),
    catchAsync(adminController.deleteDisabledDate)
  );

router.delete(
  "/gallery/:imageId",
  checkLogged,
  catchAsync(adminController.deleteImage)
);

export default router;
