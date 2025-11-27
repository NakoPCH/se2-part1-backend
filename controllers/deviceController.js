// controllers/deviceController.js

import {
  createDevice,
  deleteDevice,
  updateDevice,
  getDeviceStatus,
  performDeviceAction,
  updateSecurityState
} from "../services/deviceService.js";
import { sendSuccess, sendError } from "../utils/responses.js";

/**
 * POST /rooms/:roomId/devices
 */
export const createDeviceController = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const device = await createDevice({ ...req.body, roomId });
    return sendSuccess(res, device, "Device added", 201);
  } catch (error) {
    return next(error);
  }
};

/**
 * DELETE /devices/:deviceId
 */
export const deleteDeviceController = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const deleted = await deleteDevice(deviceId);
    if (!deleted) {
      return sendError(res, "Device not found", "Not found", 404);
    }
    return sendSuccess(res, { id: deviceId }, "Device removed", 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * PUT /devices/:deviceId
 */
export const updateDeviceController = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const device = await updateDevice(deviceId, req.body);
    if (!device) {
      return sendError(res, "Device not found", "Not found", 404);
    }
    return sendSuccess(res, device, "Device updated", 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /devices/:deviceId/status
 */
export const getDeviceStatusController = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const status = await getDeviceStatus(deviceId);
    if (!status) {
      return sendError(res, "Device not found", "Not found", 404);
    }
    return sendSuccess(res, status, "Status retrieved", 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /devices/:deviceId/action
 */
export const performDeviceActionController = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const state = await performDeviceAction(deviceId, req.body || {});
    if (!state) {
      return sendError(res, "Device not found", "Not found", 404);
    }
    return sendSuccess(res, state, "Action performed", 200);
  } catch (error) {
    return next(error);
  }
};

/**
 * PUT /security/:deviceId/state
 */
export const updateSecurityStateController = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const state = await updateSecurityState(deviceId, req.body || {});
    if (!state) {
      return sendError(res, "Device not found", "Not found", 404);
    }
    return sendSuccess(res, state, "Security system updated", 200);
  } catch (error) {
    return next(error);
  }
};
