"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shelterController_1 = __importDefault(require("../controllers/shelterController"));
const catchAsync_1 = __importDefault(require("../utilities/catchAsync"));
const validate_1 = require("../validation/validate");
const schemas_1 = require("../validation/schemas");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.get("/activities", (0, catchAsync_1.default)(shelterController_1.default.getActivities));
router.get("/shelters", (0, catchAsync_1.default)(shelterController_1.default.getShelters));
router.post("/booking", (0, validate_1.validate)(schemas_1.postBookingSchema), (0, catchAsync_1.default)(shelterController_1.default.postBooking));
router
    .route("/rates/:shelterId")
    .get((0, catchAsync_1.default)(shelterController_1.default.getRatesByShelterId))
    .put(middlewares_1.checkCSRFToken, (0, validate_1.validate)(schemas_1.putRatesSchema), (0, catchAsync_1.default)(shelterController_1.default.editRates));
router.get("/disabledDates/:shelterId", (0, catchAsync_1.default)(shelterController_1.default.getDisabledDates));
exports.default = router;
