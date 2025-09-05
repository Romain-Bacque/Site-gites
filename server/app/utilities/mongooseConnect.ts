import { config } from "dotenv";
import debugLib from "debug";
import mongoose from "mongoose";

config(); // Load environment variables from .env file

const debug = debugLib("database");

mongoose.connect(String(process.env.DB_URL) as string);

const database = mongoose.connection;

database.on("error", debug.bind(console, "connection error:"));
database.once("open", () => {
  debug("Database connected");
});
