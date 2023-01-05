const adminController = require("../controllers/adminController");
const { checkLogged } = require("../middlewares");
const express = require("express");
const multer = require("multer");
const { storage } = require("../utilities/cloudinary");
const upload = multer({ storage });

const router = express.Router();

router.get("/allBooking", checkLogged, adminController.allBooking);

router
  .route("/booking/:bookingId")
  .put(checkLogged, adminController.acceptBooking)
  .delete(checkLogged, adminController.refuseBooking);

router
  .route("/gallery")
  .get(adminController.allImages)
  .post(checkLogged, upload.single("file"), adminController.addImage);

router
  .route("/disabledDates")
  .post(checkLogged, adminController.postDisabledDate)
  .delete(checkLogged, adminController.deleteDisabledDate);

router.delete("/gallery/:imageId", checkLogged, adminController.deleteImage);

module.exports = router;
