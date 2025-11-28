// models/House.js

import mongoose from "mongoose";

const houseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerId: { type: String, required: true },
    address: { type: String, required: true },
    maxDevices: { type: Number, default: 500 }
  },
  { timestamps: true }
);

export const House =
  mongoose.models.House || mongoose.model("House", houseSchema);
