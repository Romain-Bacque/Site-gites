require("dotenv").config();

require("./app/utilities/mongooseConnect");
const port = process.env.PORT || 3000;
const routerIndex = require("./app/router");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3001" }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use(routerIndex);

app.listen(port, () => console.log(`listening on port ${port}`));
