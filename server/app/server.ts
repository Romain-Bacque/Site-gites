// import debug from "debug";
import express from "express";
import { config } from "dotenv";
import appRouter from ".";

config(); // Load environment variables from .env file

const app = express();

const port = process.env.PORT ?? 3000;

app.use(appRouter);

app.listen(port, () => console.log(`listening on port ${port}`));
