// middleware/validation.js

import { sendError } from "../utils/responses.js";

/**
 * Simple required-fields validator for request bodies.
 * @param {string[]} fields
 */
export const requireFields = (fields) => (req, res, next) => {
  const missing = fields.filter((field) => !req.body || req.body[field] == null);

  if (missing.length > 0) {
    const err = new Error(`Missing required fields: ${missing.join(", ")}`);
    err.statusCode = 400;
    err.userMessage = "Validation error";
    return sendError(res, err, err.userMessage, err.statusCode);
  }

  return next();
};
