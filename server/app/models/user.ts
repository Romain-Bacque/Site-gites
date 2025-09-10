import bcrypt from "bcrypt";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
}

interface IUserModel extends Model<IUser> {
  findAndValidate(password: string, username: string): Promise<IUser | false>;
  hashPassword(plainTextPassword: string): Promise<string>;
}

const userSchema = new Schema<IUser>({
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
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
});

// Static method to compare passwords
userSchema.statics.findAndValidate = async function (
  password: string,
  username: string
): Promise<IUser | false> {
  const foundedUser = await this.findOne({ username });

  if (!foundedUser) return false;

  const isValid = await bcrypt.compare(password, foundedUser.password);

  return isValid ? foundedUser : false;
};

// Static method to hash password
userSchema.statics.hashPassword = async function (
  plainTextPassword: string
): Promise<string> {
  return await bcrypt.hash(plainTextPassword, 10);
};

// Pre-save middleware to hash password
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
