const catchAsync = require("../utilities/catchAsync");
const adminController = require("../controllers/adminController");
const { checkLogged } = require("../middlewares");
const express = require("express");

const router = express.Router();

router.get("/allBooking", checkLogged, catchAsync(adminController.allBooking));

router.get(
  "/booking/accept/:bookingId",
  catchAsync(adminController.acceptBooking)
);

router.get(
  "/booking/refuse/:bookingId",
  catchAsync(adminController.refuseBooking)
);

module.exports = router;
