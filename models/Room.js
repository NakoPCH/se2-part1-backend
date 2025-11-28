// models/Room.js

import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    houseId: { type: String, required: true }
  },
  { timestamps: true }
);

export const Room =
  mongoose.models.Room || mongoose.model("Room", roomSchema);
