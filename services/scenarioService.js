// services/scenarioService.js

import { Scenario } from "../models/Scenario.js";
import { scenarios } from "../data.js";
import { generateId, isDbConnected } from "../utils/helpers.js";

/**
 * Creates a scenario.
 * @param {{name:string,ownerId:string,steps:Array}} payload
 */
export const createScenario = async (payload) => {
  const { name, ownerId, steps } = payload;

  if (isDbConnected()) {
    const scenario = await Scenario.create({ name, ownerId, steps });
    return scenario.toObject();
  }

  const id = generateId("s", scenarios);
  const newScenario = { id, name, ownerId, steps: steps || [] };
  scenarios.push(newScenario);
  return newScenario;
};
