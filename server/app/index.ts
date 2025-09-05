import "./utilities/mongooseConnect";

import routerIndex from "./router";
import cors from "cors";
import express, { RequestHandler } from "express";
import cookieParser from "cookie-parser";

const origin = process.env.CORS_ORIGIN;
const app = express();

app.use(cors({ credentials: true, origin }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser() as RequestHandler);
app.use(routerIndex);

export default app;
