const catchAsync = require("../utilities/catchAsync");
const adminController = require("../controllers/adminController");
const { checkLogged } = require("../middlewares");
const express = require("express");

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

module.exports = router;
