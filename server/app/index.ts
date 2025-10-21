import "./utilities/mongooseConnect";

import routerIndex from "./router";
import cors from "cors";
import express, { RequestHandler } from "express";
import cookieParser from "cookie-parser";

// Define a whitelist of allowed origins
// const whitelist = process.env.CORS_WHITELIST
//   ? process.env.CORS_WHITELIST.split(",").map((origin) => origin.trim())
//   : [];

// CORS options
const corsOptions = {
  origin: function (
    origin: string | undefined, // origin can be undefined for same-origin requests or tools like Postman
    callback: (error: Error | null, allowed?: boolean) => void // callback expects two parameters: error and boolean (true if allowed, false if not)
  ) {
    if (!origin) return callback(null, true);
    if (origin === process.env.CORS_ORIGIN) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "X-CSRF-Token",
    "X-XSRF-TOKEN",
  ], // accept is
  credentials: true, // Allow cookies and HTTP auth
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204 while preflighted requests
};

const app = express();

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // use to parse cookies from the request headers
app.use(routerIndex);

export default app;
