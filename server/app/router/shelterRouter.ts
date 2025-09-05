import express from "express";
import shelterController from "../controllers/shelterController";
import catchAsync from "../utilities/catchAsync";
import { validate } from "../validation/validate";
import { postBookingSchema, putRatesSchema } from "../validation/schemas";
import { checkCSRFToken } from "../middlewares";

const router = express.Router();

router.get("/shelters", catchAsync(shelterController.getShelters));
router.post(
  "/booking",
  validate(postBookingSchema),
  catchAsync(shelterController.postBooking)
);
router
  .route("/rates")
  .get(catchAsync(shelterController.getRates))
  .put(
    checkCSRFToken,
    validate(putRatesSchema),
    catchAsync(shelterController.editRates)
  );
router.get(
  "/disabledDates/:shelterId",
  catchAsync(shelterController.getDisabledDates)
);

export default router;
