const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  //  useCreateIndex: true,
  useUnifiedTopology: true,
  //  useFindAndModify: false
});

const database = mongoose.connection;

database.on("error", console.error.bind(console, "connection error:"));
database.once("open", () => {
  console.log("Database connected");
});
