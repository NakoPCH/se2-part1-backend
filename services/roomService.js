// services/roomService.js

import { Room } from "../models/Room.js";
import { rooms } from "../data.js";
import { generateId, isDbConnected } from "../utils/helpers.js";

/**
 * Creates a room inside a house.
 * @param {{name:string,houseId:string}} payload
 */
export const createRoom = async (payload) => {
  const { name, houseId } = payload;

  if (isDbConnected()) {
    const room = await Room.create({ name, houseId });
    return room.toObject();
  }

  const id = generateId("r", rooms);
  const newRoom = { id, name, houseId };
  rooms.push(newRoom);
  return newRoom;
};

/**
 * Deletes a room by ID.
 * @param {string} roomId
 */
export const deleteRoom = async (roomId) => {
  if (isDbConnected()) {
    const result = await Room.findByIdAndDelete(roomId).lean();
    return !!result;
  }

  const index = rooms.findIndex((r) => r.id === roomId);
  if (index === -1) return false;
  rooms.splice(index, 1);
  return true;
};
