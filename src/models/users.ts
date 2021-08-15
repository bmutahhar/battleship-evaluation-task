import { Schema, model } from "mongoose";

export interface UserInterface {
  _id?: Schema.Types.ObjectId;
  fullName: string;
  username: string;
  email: string;
  password: string;
  status?: string;
  isAdmin?: boolean;
}

const UserSchema = new Schema<UserInterface>(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model("Users", UserSchema);
