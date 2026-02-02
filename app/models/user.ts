import "./user";
import "./project";

import mongoose, { Schema } from "mongoose";

export interface IUser {
  name?: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  accessToken?: string;
  refreshToken?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
