const gitesController = require("../controllers/gitesController");
const express = require("express");

const router = express.Router();

router.post("/booking", gitesController.postBooking);
router
  .route("/rates")
  .get(gitesController.getRates)
  .put(gitesController.editRates);
router.get("/disabledDates", gitesController.getDisabledDates);

module.exports = router;
