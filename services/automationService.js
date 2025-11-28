// services/automationService.js

import { Automation } from "../models/Automation.js";
import { automations } from "../data.js";
import { generateId, isDbConnected } from "../utils/helpers.js";

/**
 * Creates an automation rule.
 * @param {{name:string,ownerId:string,rules:Array}} payload
 */
export const createAutomation = async (payload) => {
  const { name, ownerId, rules } = payload;

  if (isDbConnected()) {
    const automation = await Automation.create({ name, ownerId, rules });
    return automation.toObject();
  }

  const id = generateId("a", automations);
  const newAutomation = { id, name, ownerId, rules: rules || [] };
  automations.push(newAutomation);
  return newAutomation;
};
