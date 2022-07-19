require("dotenv").config();

const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const authRoutes = require("./routes/authRoutes");
const gitesRoutes = require("./routes/gitesRoutes");
const adminRoutes = require("./routes/adminRoutes");
const methodOverride = require("method-override");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

const dbUrl = "mongodb://localhost:27017/gites";

// // Gérer l'authentification de l'user

// Connection à mongoose
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  //  useCreateIndex: true,
  useUnifiedTopology: true,
  //  useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Enable CORS
// Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served.
app.use(cors({ credentials: true, origin: "http://localhost:3001" }));

// Decodage du body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Override methode 'post'
app.use(methodOverride("_method"));

app.use(cookieParser());

// Capture favicon
app.use("/favicon.ico", (_, res) => {
  res.sendStatus(200);
});

// Routers
app.use("/", gitesRoutes);
app.use("/authentification", authRoutes);
app.use("/admin", adminRoutes);

// On ecoute sur le bon port
app.listen(port, () => console.log(`listening on port ${port}`));
