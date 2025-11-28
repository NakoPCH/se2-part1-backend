// utils/responses.js

/**
 * Sends a standardized success JSON response.
 * @param {import('express').Response} res
 * @param {*} data
 * @param {string} message
 * @param {number} statusCode
 */
export const sendSuccess = (res, data, message = "OK", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    error: null,
    message
  });
};

/**
 * Sends a standardized error JSON response.
 * @param {import('express').Response} res
 * @param {Error|string} error
 * @param {string} message
 * @param {number} statusCode
 */
export const sendError = (res, error, message = "Error", statusCode = 500) => {
  const errorMessage = typeof error === "string" ? error : error.message;
  return res.status(statusCode).json({
    success: false,
    data: null,
    error: errorMessage,
    message
  });
};
