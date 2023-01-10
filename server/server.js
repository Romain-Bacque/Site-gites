require("dotenv").config();
require("./app/utilities/mongooseConnect");

const routerIndex = require("./app/router");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:4000" }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use(routerIndex);

app.listen(port, () => console.log(`listening on port ${port}`));
