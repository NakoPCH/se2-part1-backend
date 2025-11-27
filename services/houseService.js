// services/houseService.js

import { House } from "../models/House.js";
import { houses } from "../data.js";
import { generateId, isDbConnected } from "../utils/helpers.js";
import { SECURITY } from "../config/constants.js";

/**
 * Creates a house for a user.
 * @param {{name:string,address:string,ownerId:string}} payload
 */
export const createHouse = async (payload) => {
  const { name, address, ownerId } = payload;

  if (isDbConnected()) {
    const house = await House.create({
      name,
      address,
      ownerId,
      maxDevices: SECURITY.MAX_DEVICES_PER_HOUSE
    });
    return house.toObject();
  }

  const id = generateId("h", houses);
  const newHouse = {
    id,
    name,
    address,
    ownerId,
    maxDevices: SECURITY.MAX_DEVICES_PER_HOUSE
  };
  houses.push(newHouse);
  return newHouse;
};

/**
 * Deletes a house by ID.
 * @param {string} houseId
 */
export const deleteHouse = async (houseId) => {
  if (isDbConnected()) {
    const result = await House.findByIdAndDelete(houseId).lean();
    return !!result;
  }

  const index = houses.findIndex((h) => h.id === houseId);
  if (index === -1) return false;
  houses.splice(index, 1);
  return true;
};
