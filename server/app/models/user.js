const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username cannot be blank"],
  },
  password: {
    type: String,
    required: [true, "Password cannot be blank"],
  },
  email: {
    type: String,
    required: [true, "Email cannot be blank"],
    unique: true,
  },
  role: {
    type: String,
    required: [true, "Role cannot be blank"],
    default: "customer",
  },
});

// Middleware that compare passwords
userSchema.statics.findAndValidate = async function (password, username) {
  const foundedUser = await this.findOne({ username });

  if (!foundedUser) return false;

  const isValid = await bcrypt.compare(password, foundedUser.password);

  return isValid ? foundedUser : false;
};

// Middlewares that hashes the password
userSchema.statics.hashPassword = async function (plainTextPassword) {
  return await bcrypt.hash(plainTextPassword, 10);
};
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
