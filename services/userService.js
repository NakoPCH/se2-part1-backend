// services/userService.js

import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import {
  users,
  houses,
  rooms,
  devices,
  automations,
  scenarios,
  widgets,
  notifications
} from "../data.js";
import { generateId, isDbConnected } from "../utils/helpers.js";

/**
 * Creates a new user in DB or mock data.
 * @param {{username:string,password:string,email:string}} payload
 */
export const createUser = async (payload) => {
  const { username, password, email } = payload;

  if (isDbConnected()) {
    const existing = await User.findOne({ username });
    if (existing) {
      const err = new Error("Username already exists");
      err.statusCode = 409;
      err.userMessage = "Username already exists";
      throw err;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed, email });
    return user.toObject();
  }

  const existing = users.find((u) => u.username === username);
  if (existing) {
    const err = new Error("Username already exists");
    err.statusCode = 409;
    err.userMessage = "Username already exists";
    throw err;
  }

  const id = generateId("u", users);
  const newUser = { id, username, password, email };
  users.push(newUser);
  return newUser;
};

/**
 * Validates user credentials and returns user object.
 * @param {string} username
 * @param {string} password
 */
export const authenticateUser = async (username, password) => {
  if (isDbConnected()) {
    const user = await User.findOne({ username });
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password);
    return match ? user.toObject() : null;
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  return user || null;
};

/**
 * Returns a user by ID from mock data (or DB if needed).
 * @param {string} userId
 */
export const getUserById = async (userId) => {
  if (isDbConnected()) {
    const user = await User.findById(userId).lean();
    return user || null;
  }

  return users.find((u) => u.id === userId) || null;
};

/**
 * Computes simple statistics for the given user.
 * @param {string} userId
 */
export const getUserStatistics = async (userId) => {
  const userHouses = houses.filter((h) => h.ownerId === userId);
  const userHouseIds = userHouses.map((h) => h.id);

  const userRooms = rooms.filter((r) => userHouseIds.includes(r.houseId));
  const userRoomIds = userRooms.map((r) => r.id);

  const userDevices = devices.filter((d) => userRoomIds.includes(d.roomId));

  const userAutomations = automations.filter((a) => a.ownerId === userId);
  const userScenarios = scenarios.filter((s) => s.ownerId === userId);
  const userWidgets = widgets.filter((w) => w.userId === userId);
  const userNotifications = notifications.filter((n) => n.userId === userId);

  return {
    houses: userHouses.length,
    rooms: userRooms.length,
    devices: userDevices.length,
    automations: userAutomations.length,
    scenarios: userScenarios.length,
    widgets: userWidgets.length,
    notifications: userNotifications.length
  };
};
