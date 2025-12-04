// utils/helpers.js

import mongoose from "mongoose";

/**
 * Returns true if a MongoDB connection is ready.
 * @returns {boolean}
 */
export const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Generates an incremental string ID with the given prefix based
 * on an array of existing objects that have an `id` property.
 * @param {string} prefix
 * @param {Array<{id: string}>} collection
 * @returns {string}
 */
export const generateId = (prefix, collection) => {
  let max = 0;
  for (const item of collection) {
    if (!item.id) continue;
    const numeric = parseInt(String(item.id).replace(prefix, ""), 10);
    if (!Number.isNaN(numeric) && numeric > max) {
      max = numeric;
    }
  }
  return `${prefix}${max + 1}`;
};
