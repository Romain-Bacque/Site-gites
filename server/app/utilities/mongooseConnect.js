const debug = require("debug")("database");
const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  //  useCreateIndex: true,
  useUnifiedTopology: true,
  //  useFindAndModify: false
});

const database = mongoose.connection;

database.on("error", debug.bind(console, "connection error:"));
database.once("open", () => {
  debug("Database connected");
});
