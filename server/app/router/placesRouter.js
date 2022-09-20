const { getActivities } = require("../middlewares");
const express = require("express");

const router = express.Router();

router.get("/", getActivities);

module.exports = router;
