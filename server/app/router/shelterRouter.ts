import express from "express";
import shelterController from "../controllers/shelterController";
import catchAsync from "../utilities/catchAsync";
import { validate } from "../validation/validate";
import {
  postBookingSchema,
  putRatesSchema,
  putShelterDescriptionSchema,
} from "../validation/schemas";
import { csrfProtection, checkLogged } from "../middlewares";

const router = express.Router();

router.get("/activities", catchAsync(shelterController.getActivities));
router.get("/shelters", catchAsync(shelterController.getShelters));
router.put(
  "/shelters/:id",
  csrfProtection,
  checkLogged,
  validate(putShelterDescriptionSchema),
  catchAsync(shelterController.updateShelterDescription)
);
router.put(
  "/shelters/:id/image/:imageId",
  csrfProtection,
  checkLogged,
  catchAsync(shelterController.setMainImage)
);
router.post(
  "/booking",
  csrfProtection,
  validate(postBookingSchema),
  catchAsync(shelterController.postBooking)
);
router
  .route("/rates/:shelterId")
  .get(catchAsync(shelterController.getRatesByShelterId))
  .put(
    csrfProtection,
    checkLogged,
    validate(putRatesSchema),
    catchAsync(shelterController.editRates)
  );
router.get(
  "/disabledDates/:shelterId",
  catchAsync(shelterController.getDisabledDates)
);

export default router;
