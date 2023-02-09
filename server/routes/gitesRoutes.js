const catchAsync = require("../utilities/catchAsync");
const gitesController = require("../controllers/gitesController");
const express = require("express");

const router = express.Router();

router.post("/booking", catchAsync(gitesController.postBooking));
router
  .route("/rates")
  .get(catchAsync(gitesController.getRates))
  .put(catchAsync(gitesController.editRates));
router.get("/disabledDates", catchAsync(gitesController.getDisabledDates));

module.exports = router;
