import fs from "fs";
import path from "path";

// Define the file path
const DATA_FILE = path.join(process.cwd(), "automations.json");

// Helper: Read from file
const getAutomationsFromFile = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper: Write to file
const saveAutomationsToFile = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// GET /automations
export const getAutomations = (req, res) => {
  const automations = getAutomationsFromFile();
  res.json(automations);
};

// POST /automations
export const createAutomation = (req, res) => {
  const { name, time, selectedDevices, action } = req.body;

  if (!name || !time || !selectedDevices || selectedDevices.length === 0) {
    return res.status(400).json({ error: "Please fill all fields and select at least one device." });
  }

  const automations = getAutomationsFromFile();
  
  const newAutomation = {
    id: Date.now().toString(),
    name,
    time, // e.g., "19:00"
    selectedDevices, // Array of Device IDs
    action, // "turn_on" or "turn_off"
    isActive: true
  };

  automations.push(newAutomation);
  saveAutomationsToFile(automations);

  res.status(201).json(newAutomation);
};

// DELETE /automations/:id
export const deleteAutomation = (req, res) => {
  const { id } = req.params;
  let automations = getAutomationsFromFile();
  automations = automations.filter(a => a.id !== id);
  saveAutomationsToFile(automations);
  res.json({ message: "Deleted" });
};

// PUT /automations/:id (Toggle Active/Inactive)
export const toggleAutomation = (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  
  const automations = getAutomationsFromFile();
  const index = automations.findIndex(a => a.id === id);
  
  if (index !== -1) {
    automations[index].isActive = isActive;
    saveAutomationsToFile(automations);
    res.json(automations[index]);
  } else {
    res.status(404).json({ error: "Not found" });
  }
};