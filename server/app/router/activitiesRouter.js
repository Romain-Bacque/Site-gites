const { getActivities } = require("../middlewares");
const express = require("express");
const catchAsync = require("../utilities/catchAsync");

const router = express.Router();

router.get("/", catchAsync(getActivities));

module.exports = router;
