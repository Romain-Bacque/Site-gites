require("./utilities/mongooseConnect");

const routerIndex = require("./router");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const origin = process.env.CORS_ORIGIN;
const app = express();

app.use(cors({ credentials: true, origin }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(routerIndex);

module.exports = app;
