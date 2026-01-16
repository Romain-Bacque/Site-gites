import { config } from "dotenv";
import debugLib from "debug";
import mongoose from "mongoose";

config();

const debug = debugLib("database");

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
  throw new Error("DB_URL non définie dans le fichier .env");
}

mongoose.connect(dbUrl);

const database = mongoose.connection;

database.on("error", debug.bind(console, "Erreur de connexion :"));
database.once("open", () => {
  debug("✅ Connexion à MongoDB réussie");
});
