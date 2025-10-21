"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../utilities/cloudinary");
const middlewares_1 = require("../middlewares");
const adminController_1 = __importDefault(require("../controllers/adminController"));
const catchAsync_1 = __importDefault(require("../utilities/catchAsync"));
const validate_1 = require("../validation/validate");
const schemas_1 = require("../validation/schemas");
const upload = (0, multer_1.default)({ storage: cloudinary_1.storage });
const router = express_1.default.Router();
router.get("/allBooking", middlewares_1.checkLogged, (0, catchAsync_1.default)(adminController_1.default.getAllBooking));
router
    .route("/booking/:bookingId")
    .put(middlewares_1.csrfProtection, middlewares_1.checkLogged, (0, catchAsync_1.default)(adminController_1.default.acceptBooking))
    .delete(middlewares_1.csrfProtection, middlewares_1.checkLogged, (0, catchAsync_1.default)(adminController_1.default.deleteBooking));
router
    .route("/gallery")
    .get((0, catchAsync_1.default)(adminController_1.default.getSheltersWithImages))
    .post(middlewares_1.csrfProtection, middlewares_1.checkLogged, upload.single("file"), (0, catchAsync_1.default)(adminController_1.default.addImage));
router
    .route("/disabledDates")
    .post(middlewares_1.csrfProtection, middlewares_1.checkLogged, (0, validate_1.validate)(schemas_1.disabledDatesSchema), (0, catchAsync_1.default)(adminController_1.default.addDisabledDate))
    .delete(middlewares_1.csrfProtection, middlewares_1.checkLogged, (0, validate_1.validate)(schemas_1.disabledDatesSchema), (0, catchAsync_1.default)(adminController_1.default.deleteDisabledDate));
router.delete("/gallery/:imageId", middlewares_1.csrfProtection, middlewares_1.checkLogged, (0, catchAsync_1.default)(adminController_1.default.deleteImage));
exports.default = router;
