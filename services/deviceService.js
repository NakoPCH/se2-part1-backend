// services/deviceService.js

import { Device } from "../models/Device.js";
import { devices } from "../data.js";
import { generateId, isDbConnected } from "../utils/helpers.js";

/**
 * Adds a device to a room.
 * @param {{name:string,roomId:string,type:string,category?:string}} payload
 */
export const createDevice = async (payload) => {
  const { name, roomId, type, category } = payload;

  if (isDbConnected()) {
    const device = await Device.create({ name, roomId, type, category });
    return device.toObject();
  }

  const id = generateId("d", devices);
  const newDevice = {
    id,
    name,
    roomId,
    type,
    category: category || null,
    status: "online",
    state: {}
  };
  devices.push(newDevice);
  return newDevice;
};

/**
 * Deletes a device.
 * @param {string} deviceId
 */
export const deleteDevice = async (deviceId) => {
  if (isDbConnected()) {
    const result = await Device.findByIdAndDelete(deviceId).lean();
    return !!result;
  }

  const index = devices.findIndex((d) => d.id === deviceId);
  if (index === -1) return false;
  devices.splice(index, 1);
  return true;
};

/**
 * Updates device category or other metadata.
 * @param {string} deviceId
 * @param {{category?:string,name?:string}} updates
 */
export const updateDevice = async (deviceId, updates) => {
  if (isDbConnected()) {
    const device = await Device.findByIdAndUpdate(deviceId, updates, {
      new: true
    }).lean();
    return device;
  }

  const device = devices.find((d) => d.id === deviceId);
  if (!device) return null;
  Object.assign(device, updates);
  return device;
};

/**
 * Gets current device status.
 * @param {string} deviceId
 */
export const getDeviceStatus = async (deviceId) => {
  if (isDbConnected()) {
    const device = await Device.findById(deviceId).lean();
    if (!device) return null;
    return device.state || {};
  }

  const device = devices.find((d) => d.id === deviceId);
  if (!device) return null;
  return device.state || {};
};

/**
 * Performs an action on the device (mocked).
 * @param {string} deviceId
 * @param {Object} action
 */
export const performDeviceAction = async (deviceId, action) => {
  if (isDbConnected()) {
    const device = await Device.findById(deviceId);
    if (!device) return null;
    device.state = { ...(device.state || {}), ...action };
    await device.save();
    return device.state;
  }

  const device = devices.find((d) => d.id === deviceId);
  if (!device) return null;

  device.state = { ...(device.state || {}), ...action };
  return device.state;
};

/**
 * Updates the security state of a device (e.g., arm/disarm).
 * @param {string} deviceId
 * @param {Object} state
 */
export const updateSecurityState = async (deviceId, state) => {
  return performDeviceAction(deviceId, state);
};
