const shelterController = require("../controllers/shelterController.js");
const express = require("express");
const catchAsync = require("../utilities/catchAsync.js");

const router = express.Router();

router.get("/shelters", catchAsync(shelterController.getShelters));
router.post("/booking", catchAsync(shelterController.postBooking));
router
  .route("/rates")
  .get(catchAsync(shelterController.getRates))
  .put(catchAsync(shelterController.editRates));
router.get("/disabledDates", catchAsync(shelterController.getDisabledDates));

module.exports = router;
