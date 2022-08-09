const catchAsync = require("../utilities/catchAsync");
const adminController = require("../controllers/adminController");
const { checkLogged } = require("../middlewares");
const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const router = express.Router();

router.get("/allBooking", checkLogged, catchAsync(adminController.allBooking));

router.put(
  "/booking/accept/:bookingId",
  checkLogged,
  catchAsync(adminController.acceptBooking)
);
router.delete(
  "/booking/refuse/:bookingId",
  checkLogged,
  catchAsync(adminController.refuseBooking)
);

router
  .route("/gallery")
  .get(catchAsync(adminController.allImages))
  .post(
    checkLogged,
    upload.single("file"),
    catchAsync(adminController.addImage)
  );

router.delete(
  "/gallery/:imageId",
  checkLogged,
  catchAsync(adminController.deleteImage)
);

module.exports = router;
