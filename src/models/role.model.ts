import { Schema, model } from "mongoose";

export const roles = ["user", "admin"];

const roleSchema = new Schema(
  {
    name: String,
  },
  { versionKey: false }
);
export default model("roles", roleSchema);
