const adminController = require("../controllers/adminController");
const { checkLogged } = require("../middlewares");
const express = require("express");
const multer = require("multer");
const { storage } = require("../utilities/cloudinary");
const catchAsync = require("../utilities/catchAsync");
const { validate } = require("../validation/validate");
const { disabledDatesSchema } = require("../validation/schemas");
const upload = multer({ storage });

const router = express.Router();

router.get("/allBooking", checkLogged, adminController.getAllBooking);

router
  .route("/booking/:bookingId")
  .put(checkLogged, adminController.acceptBooking)
  .delete(checkLogged, adminController.refuseBooking);

router
  .route("/gallery")
  .get(catchAsync(adminController.getAllImages))
  .post(
    checkLogged,
    upload.single("file"),
    catchAsync(adminController.addImage)
  );

router
  .route("/disabledDates")
  .post(checkLogged, validate(disabledDatesSchema), catchAsync(adminController.addDisabledDate))
  .delete(checkLogged, validate(disabledDatesSchema), catchAsync(adminController.deleteDisabledDate));

router.delete(
  "/gallery/:imageId",
  checkLogged,
  catchAsync(adminController.deleteImage)
);

module.exports = router;
